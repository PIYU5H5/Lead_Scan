import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { CALLS as DEFAULT_CALLS } from '../data/callData';
import {
  saveAudioBlob,
  getAudioBlob,
  deleteAudioBlob,
  loadSavedCustomCalls,
  saveCustomCallsList,
  clearCustomCalls,
} from '../utils/audioStorage';

const CallsContext = createContext(null);

export function CallsProvider({ children }) {
  const [calls, setCalls] = useState(DEFAULT_CALLS);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Restore custom calls from localStorage & reconnect IndexedDB audio blobs
  useEffect(() => {
    async function restore() {
      const saved = loadSavedCustomCalls();
      if (!saved || saved.length === 0) {
        setIsLoaded(true);
        return;
      }

      // Re-hydrate audio blobs from IndexedDB into memory ObjectURLs
      const hydrated = await Promise.all(
        saved.map(async (c) => {
          try {
            const blob = await getAudioBlob(c.id);
            if (blob) {
              const url = URL.createObjectURL(blob);
              return { ...c, audioFile: url, audioBlob: blob };
            }
          } catch (err) {
            console.warn('[CallsContext] Audio rehydration failed for', c.id, err);
          }
          return c;
        })
      );

      // Merge: custom calls first, then default calls
      setCalls([...hydrated, ...DEFAULT_CALLS]);
      setIsLoaded(true);
    }

    restore();
  }, []);

  const openUploadModal = useCallback(() => setIsUploadModalOpen(true), []);
  const closeUploadModal = useCallback(() => setIsUploadModalOpen(false), []);

  // Add new ingested call
  const addCall = useCallback(async (newCall, audioBlob) => {
    let playableUrl = null;
    if (audioBlob) {
      await saveAudioBlob(newCall.id, audioBlob);
      playableUrl = URL.createObjectURL(audioBlob);
    } else {
      // If no file provided, fall back to sample audio for player playback
      playableUrl = '/audio_files/call_recording_nishant.mp3';
    }

    const readyCall = {
      ...newCall,
      audioFile: playableUrl,
      audioBlob: audioBlob || null,
      isCustom: true,
    };

    setCalls((prev) => {
      const updated = [readyCall, ...prev];
      saveCustomCallsList(updated);
      return updated;
    });

    return readyCall;
  }, []);

  // Delete call (only custom user-added calls)
  const deleteCall = useCallback(async (id) => {
    await deleteAudioBlob(id);
    setCalls((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      saveCustomCallsList(updated);
      return updated;
    });
  }, []);

  // Reset to original 3 demo calls
  const resetToDefault = useCallback(() => {
    clearCustomCalls();
    setCalls(DEFAULT_CALLS);
  }, []);

  const getCallById = useCallback(
    (id) => calls.find((c) => c.id === id),
    [calls]
  );

  const value = useMemo(
    () => ({
      calls,
      isLoaded,
      getCallById,
      addCall,
      deleteCall,
      resetToDefault,
      isUploadModalOpen,
      openUploadModal,
      closeUploadModal,
    }),
    [calls, isLoaded, getCallById, addCall, deleteCall, resetToDefault, isUploadModalOpen, openUploadModal, closeUploadModal]
  );

  return <CallsContext.Provider value={value}>{children}</CallsContext.Provider>;
}

export function useCalls() {
  const ctx = useContext(CallsContext);
  if (!ctx) {
    throw new Error('useCalls must be used within a CallsProvider');
  }
  return ctx;
}
