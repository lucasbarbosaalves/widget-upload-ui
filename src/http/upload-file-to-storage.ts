import axios from 'axios';

type UploadFileToStorageParams = {
  file: File;
};

type UploadFileToStorageOptions = {
  signal?: AbortSignal;
};

export async function uploadFileToStorage({ file }: UploadFileToStorageParams, opts?: UploadFileToStorageOptions) {
  const data = new FormData();

  data.append('file', file);

  const response = await axios.post('http://localhost:3000/uploads', data, {
    headers: {
      'Content-Type': 'multipar/form-data',
    },
    signal: opts?.signal,
  });

  return { url: response.data.url };
}
