// ============================================================================
// LeadSync — In-Browser Audio & Call Persistence (IndexedDB + LocalStorage)
// ============================================================================

const DB_NAME = 'LeadSyncDB';
const DB_VERSION = 1;
const STORE_NAME = 'audio_recordings';
const STORAGE_KEY = 'leadsync_custom_calls_v1';

// Open / initialize IndexedDB for binary audio blobs
function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Store an audio Blob / File in IndexedDB
export async function saveAudioBlob(callId, blob) {
  if (!blob) return null;
  try {
    const db = await openDB();
    if (!db) return null;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(blob, callId);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('[AudioStorage] Failed to save blob in IndexedDB:', err);
    return null;
  }
}

// Retrieve audio Blob from IndexedDB
export async function getAudioBlob(callId) {
  try {
    const db = await openDB();
    if (!db) return null;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(callId);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[AudioStorage] Failed to load blob from IndexedDB:', err);
    return null;
  }
}

// Delete audio Blob from IndexedDB
export async function deleteAudioBlob(callId) {
  try {
    const db = await openDB();
    if (!db) return;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(callId);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('[AudioStorage] Failed to delete blob from IndexedDB:', err);
  }
}

// LocalStorage helpers for call metadata
export function loadSavedCustomCalls() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('[AudioStorage] Failed to load custom calls from localStorage:', err);
    return [];
  }
}

export function saveCustomCallsList(calls) {
  try {
    // Only save custom calls (with isCustom flag), stripped of temporary object URLs
    const serializable = calls.map(c => {
      if (!c.isCustom) return null;
      // Keep everything except the blob URL in storage; blob will be restored from IndexedDB
      return {
        ...c,
        audioFile: c.audioFile?.startsWith('blob:') ? null : c.audioFile,
      };
    }).filter(Boolean);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
  } catch (err) {
    console.warn('[AudioStorage] Failed to save custom calls list:', err);
  }
}

export function clearCustomCalls() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
