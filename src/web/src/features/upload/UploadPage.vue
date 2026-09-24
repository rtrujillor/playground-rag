<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import {
  MAX_UPLOAD_SIZE_BYTES,
  SUPPORTED_UPLOAD_TYPES,
} from '../../shared/api/upload';
import { useUploadStore } from './uploadStore';

const uploadStore = useUploadStore();
const { entries, isSubmitting, supportsUpload, totalSize, persistenceMessage } =
  storeToRefs(uploadStore);
const { removeFile, handleSubmit } = uploadStore;
const fileInput = ref<globalThis.HTMLInputElement | null>(null);
function formatSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function handleFileSelection(event: globalThis.Event) {
  const target = event.target as globalThis.HTMLInputElement;
  uploadStore.addFiles(Array.from(target.files ?? []));
  target.value = '';
}
</script>

<template>
  <v-container class="py-10" max-width="900">
    <v-sheet class="pa-6 pa-sm-8" rounded="lg" border>
      <h1 class="text-h4 text-sm-h3 mb-3">Upload Documents</h1>
      <p class="text-body-1 text-medium-emphasis mb-5">
        Choose one or more documents, then add more files as needed. Review the
        combined list and remove any files before submitting.
      </p>

      <v-btn
        color="primary"
        :disabled="isSubmitting"
        @click="fileInput?.click()"
      >
        Choose files
      </v-btn>
      <input
        id="upload-documents"
        ref="fileInput"
        aria-label="Choose files"
        type="file"
        hidden
        class="d-none"
        :disabled="isSubmitting"
        multiple
        :accept="SUPPORTED_UPLOAD_TYPES.join(',')"
        @change="handleFileSelection"
      />

      <div class="mt-6">
        <p v-if="persistenceMessage" role="status">{{ persistenceMessage }}</p>
        <p class="mb-2 text-body-2 text-medium-emphasis">
          Supported types: {{ SUPPORTED_UPLOAD_TYPES.join(', ') }}
        </p>
        <p class="mb-2 text-body-2 text-medium-emphasis">
          Max file size: {{ formatSize(MAX_UPLOAD_SIZE_BYTES) }}
        </p>
      </div>

      <div v-if="entries.length" class="mt-6">
        <h2 class="text-h6 mb-3">Selected files ({{ entries.length }})</h2>
        <p class="text-body-2 mb-3" aria-live="polite">
          Total size: {{ formatSize(totalSize) }}
        </p>
        <ul class="pa-0 ma-0" style="list-style: none">
          <li
            v-for="entry in entries"
            :key="entry.id"
            class="d-flex flex-wrap ga-3 align-center justify-space-between pa-3 mb-2 rounded border"
          >
            <div>
              <div class="font-weight-medium text-break">
                {{ entry.file.name }}
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ formatSize(entry.file.size) }} ·
                {{ entry.file.name.split('.').pop()?.toUpperCase() }}
              </div>
            </div>
            <div v-if="entry.status !== 'queued'" class="text-right">
              <div class="text-body-2">{{ entry.status }}</div>
              <div class="text-caption text-medium-emphasis">
                {{ entry.message }}
              </div>
            </div>
            <v-btn
              variant="text"
              color="error"
              :disabled="isSubmitting"
              :aria-label="`Remove ${entry.file.name}`"
              @click="removeFile(entry.id)"
              >Remove</v-btn
            >
          </li>
        </ul>
      </div>

      <p v-if="!entries.length" class="mt-6 text-medium-emphasis">
        No files selected yet.
      </p>

      <div v-if="supportsUpload" class="mt-5 d-flex justify-end">
        <button
          type="button"
          class="px-4 py-2 rounded text-white bg-primary"
          :disabled="isSubmitting"
          @click="handleSubmit"
        >
          {{ isSubmitting ? 'Uploading…' : 'Submit files' }}
        </button>
      </div>
    </v-sheet>
  </v-container>
</template>
