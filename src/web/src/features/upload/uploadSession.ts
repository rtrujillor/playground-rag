import { toRaw, watch } from 'vue';
import type { useUploadStore } from './uploadStore';

type UploadStore = ReturnType<typeof useUploadStore>;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('rag-upload-sessions', 1);
    request.onupgradeneeded = () =>
      request.result.createObjectStore('sessions');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function restoreUploadSession(store: UploadStore) {
  try {
    const sessionKey = 'rag-upload-session';
    let sessionId = sessionStorage.getItem(sessionKey);
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem(sessionKey, sessionId);
    }
    const database = await openDatabase();
    const restored = await new Promise<UploadStore['entries'] | undefined>(
      (resolve, reject) => {
        const request = database
          .transaction('sessions')
          .objectStore('sessions')
          .get(sessionId);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      },
    );
    store.entries = (restored ?? []).map((entry) => ({
      ...entry,
      status: entry.status === 'uploading' ? 'failed' : entry.status,
      message:
        entry.status === 'uploading'
          ? 'Upload interrupted. Please try again.'
          : entry.message,
    }));
    watch(
      () => store.entries,
      () => {
        store.persistenceMessage = 'Saving selected files…';
        try {
          const transaction = database.transaction('sessions', 'readwrite');
          // IndexedDB preserves the File bytes; Vue proxies cannot be cloned.
          const snapshot = store.entries.map((entry) => ({
            ...toRaw(entry),
            file: toRaw(entry.file),
          }));
          transaction.objectStore('sessions').put(snapshot, sessionId);
          transaction.oncomplete = () => {
            store.persistenceMessage = '';
          };
          transaction.onabort = () => {
            store.persistenceMessage =
              'Could not save selected files. Keep this page open to avoid losing them.';
          };
        } catch {
          store.persistenceMessage =
            'Could not save selected files. Keep this page open to avoid losing them.';
        }
      },
      { deep: true, flush: 'sync' },
    );
  } catch {
    store.persistenceMessage =
      'Session storage is unavailable. Selected files will not survive a refresh.';
  }
}
