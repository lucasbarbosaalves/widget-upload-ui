import axios from 'axios';

type UploadFileToStorageParams = {
  file: File;
};
export async function uploadFileToStorage({ file }: UploadFileToStorageParams) {
  const data = new FormData();

  data.append('file', file);

  const response = await axios.post('http://localhost:3000/uploads', data, {
    headers: {
      'Content-Type': 'multipar/form-data',
    },
  });

  return { url: response.data.url };
}
