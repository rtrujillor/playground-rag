export type UploadStatus =
  | 'queued'
  | 'validating'
  | 'uploading'
  | 'uploaded'
  | 'failed'
  | 'rejected';

export interface UploadFileResult {
  id: string;
  name: string;
  size: number;
  status: UploadStatus;
  message: string;
}

export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;
export const SUPPORTED_UPLOAD_TYPES = ['.pdf', '.txt', '.md', '.docx'];

export function validateUploadFile(file: File): string | undefined {
  if (!file.size) {
    return 'This file is empty and cannot be uploaded.';
  }

  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    return 'This file exceeds the 10 MB upload limit.';
  }

  const lowerName = file.name.toLowerCase();
  const isSupported = SUPPORTED_UPLOAD_TYPES.some((type) =>
    lowerName.endsWith(type),
  );

  if (!isSupported) {
    return 'Unsupported file type. Use PDF, TXT, MD, or DOCX files only.';
  }

  return undefined;
}

export async function uploadFiles(files: File[]): Promise<UploadFileResult[]> {
  return files.map((file) => {
    const validationResult = validateUploadFile(file);

    if (validationResult) {
      return {
        id: `${file.name}-${file.size}-${Date.now()}-rejected`,
        name: file.name,
        size: file.size,
        status: 'rejected',
        message: validationResult,
      };
    }

    return {
      id: `${file.name}-${file.size}-${Date.now()}`,
      name: file.name,
      size: file.size,
      status: 'uploaded',
      message:
        'Storage backend not configured yet. This upload contract is ready for a future backend integration.',
    };
  });
}
