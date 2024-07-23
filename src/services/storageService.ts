// src/services/storageService.ts
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

export const uploadImage = async (file: Blob, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const metadata = {
      contentType: 'image/png',
    };
    const snapshot = await uploadBytes(storageRef, file, metadata);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};