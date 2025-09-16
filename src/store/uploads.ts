import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { enableMapSet } from 'immer';
import { uploadFileToStorage } from '../http/upload-file-to-storage';
import { CanceledError } from 'axios';
import { useShallow } from 'zustand/shallow';

export type Upload = {
  name: string;
  file: File;
  status: 'progress' | 'success' | 'error' | 'canceled';
  abortController: AbortController;
  originalSizeInBytes: number;
  uploadSizeInBytes: number;
};

type UploadState = {
  uploads: Map<string, Upload>;
  addUploads: (files: File[]) => void;
  cancelUpload: (uploadId: string) => void;
};

enableMapSet();

export const useUploads = create<UploadState, [['zustand/immer', never]]>(
  immer((set, get) => {
    function updateUpload(uploadId: string, data: Partial<Upload>) {
      const upload = get().uploads.get(uploadId);

      if (!upload) return;

      set((state) => {
        state.uploads.set(uploadId, { ...upload, ...data });
      });
    }

    async function processUpload(uploadId: string) {
      const upload = get().uploads.get(uploadId);

      if (!upload) return;
      try {
        await uploadFileToStorage(
          {
            file: upload.file,
            onProgress(sizeInBytes) {
              updateUpload(uploadId, {
                uploadSizeInBytes: sizeInBytes,
              });
            },
          },
          { signal: upload.abortController.signal }
        );

        updateUpload(uploadId, {
          status: 'success',
        });
      } catch (error) {
        if (error instanceof CanceledError) {
          updateUpload(uploadId, {
            status: 'canceled',
          });
          return;
        }

        updateUpload(uploadId, {
          status: 'error',
        });
      }
    }

    async function cancelUpload(uploadId: string) {
      const upload = get().uploads.get(uploadId);

      if (!upload) return;

      upload.abortController.abort();
    }

    function addUploads(files: File[]) {
      for (const file of files) {
        const uploadId = crypto.randomUUID();
        const abortController = new AbortController();

        const upload: Upload = {
          name: file.name,
          file,
          abortController,
          status: 'progress',
          originalSizeInBytes: file.size,
          uploadSizeInBytes: 0,
        };

        set((actualState) => {
          actualState.uploads.set(uploadId, upload);
        });

        processUpload(uploadId);
      }
    }
    return {
      uploads: new Map(),
      addUploads,
      cancelUpload,
    };
  })
);

export const usePendingUpload = () => {
  return useUploads(
    useShallow((store) => {
      const pendingUploads = Array.from(store.uploads.values()).some((upload) => upload.status === 'progress');

      if (!pendingUploads) {
        return { pendingUploads, globalPercentage: 100 };
      }

      const { total, uploaded } = Array.from(store.uploads.values()).reduce(
        (acc, upload) => {
          acc.total += upload.originalSizeInBytes;
          acc.uploaded += upload.uploadSizeInBytes;

          return acc;
        },
        { total: 0, uploaded: 0 }
      );

      const globalPercentage = Math.min(Math.round(uploaded * 100) / total, 100);

      return {
        pendingUploads,
        globalPercentage,
      };
    })
  );
};
