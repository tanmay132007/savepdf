
import { create } from 'zustand';
import { uploadFile, pollJobStatus } from '../lib/api';

export type UploadStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'failed';

interface UploadState {
  files: File[];
  status: UploadStatus;
  progress: number;
  jobId: string | null;
  downloadUrl: string | null;
  error: string | null;
  summary: string | null;
  setFiles: (files: File[]) => void;
  startUpload: (files: File[], tool: string, options: object) => Promise<void>;
  reset: () => void;
}

export const useUploadStore = create<UploadState>((set, get) => ({
  files: [],
  status: 'idle',
  progress: 0,
  jobId: null,
  downloadUrl: null,
  error: null,
  summary: null,

  setFiles: (files) => set({ files }),

  startUpload: async (files, tool, options) => {
    set({ status: 'uploading', progress: 10, error: null, files });
    
    try {
      const { jobId } = await uploadFile(files, tool, options);
      set({ jobId, status: 'processing', progress: 30 });

      const interval = setInterval(async () => {
        const currentJobId = get().jobId;
        if (!currentJobId) {
          clearInterval(interval);
          return;
        }

        try {
          const response = await pollJobStatus(currentJobId);
          
          if (response.status === 'completed') {
            set({ 
              status: 'completed', 
              progress: 100, 
              downloadUrl: response.downloadUrl || null,
              summary: response.summary || null 
            });
            clearInterval(interval);
          } else if (response.status === 'failed') {
            set({ status: 'failed', error: response.error || 'Processing failed' });
            clearInterval(interval);
          } else if (response.status === 'pending') {
            set({ progress: 30 });
          } else if (response.status === 'processing') {
            set({ progress: 60 });
          }
        } catch (err) {
          set({ status: 'failed', error: 'Polling error' });
          clearInterval(interval);
        }
      }, 2000);

    } catch (err: any) {
      set({ status: 'failed', error: err.message || 'Upload failed' });
    }
  },

  reset: () => set({
    files: [],
    status: 'idle',
    progress: 0,
    jobId: null,
    downloadUrl: null,
    error: null,
    summary: null,
  }),
}));

// Wrapper hook if needed, or just export the store
export function useUpload() {
  const store = useUploadStore();
  return store;
}
