import axios from 'axios';

type UploadFileToStorageParams = {
  file: File;
  onProgress: (sizeInBytes: number) => void;
};

type UploadFileToStorageOptions = {
  signal?: AbortSignal;
};

export async function uploadFileToStorage(
  { file, onProgress }: UploadFileToStorageParams,
  opts?: UploadFileToStorageOptions
) {
  const data = new FormData();

  data.append('file', file);

  const response = await axios.post<{ url: string }>('http://localhost:3000/uploads', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    signal: opts?.signal,
    onUploadProgress(progressEvent) {
      onProgress(progressEvent.loaded);
    },
  });

  return { url: response.data.url };
}
