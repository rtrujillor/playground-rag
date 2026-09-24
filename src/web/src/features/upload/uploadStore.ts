import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import {
  type UploadFileResult,
  uploadFiles,
  validateUploadFile,
} from '../../shared/api/upload';

interface UploadEntry {
  id: number;
  file: globalThis.File;
  status: UploadFileResult['status'];
  message: string;
}
export const useUploadStore = defineStore('upload', () => {
  const entries = ref<UploadEntry[]>([]);
  const isSubmitting = ref(false);
  const persistenceMessage = ref('');
  const supportsUpload = computed(() =>
    entries.value.some(
      (entry) => !validateUploadFile(entry.file) && entry.status !== 'uploaded',
    ),
  );
  const totalSize = computed(() =>
    entries.value.reduce((total, entry) => total + entry.file.size, 0),
  );
  function addFiles(files: File[]) {
    if (isSubmitting.value) return;
    for (const file of files) {
      const duplicate = entries.value.some(
        (entry) =>
          entry.file.name === file.name &&
          entry.file.size === file.size &&
          entry.file.lastModified === file.lastModified,
      );
      if (duplicate) continue;
      const error = validateUploadFile(file);
      entries.value.push({
        id: Math.max(-1, ...entries.value.map((entry) => entry.id)) + 1,
        file,
        status: error ? 'rejected' : 'queued',
        message: error ?? 'Ready for submission.',
      });
    }
  }
  function removeFile(id: number) {
    if (!isSubmitting.value)
      entries.value = entries.value.filter((entry) => entry.id !== id);
  }
  async function handleSubmit() {
    if (isSubmitting.value) return;
    const pending = entries.value.filter(
      (entry) => !validateUploadFile(entry.file) && entry.status !== 'uploaded',
    );
    if (!pending.length) return;
    isSubmitting.value = true;
    try {
      await Promise.all(
        pending.map(async (entry) => {
          entry.status = 'uploading';
          entry.message = 'Uploading…';
          try {
            const [result] = await uploadFiles([entry.file]);
            if (!result) throw new Error('Missing upload result');
            entry.status = result.status;
            entry.message = result.message;
          } catch {
            entry.status = 'failed';
            entry.message = 'Upload failed. Please try again.';
          }
        }),
      );
    } finally {
      isSubmitting.value = false;
    }
  }

  return {
    entries,
    isSubmitting,
    persistenceMessage,
    supportsUpload,
    totalSize,
    addFiles,
    removeFile,
    handleSubmit,
  };
});
