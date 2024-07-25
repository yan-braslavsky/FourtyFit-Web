// src/services/equipmentService.ts
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '../firebase/config';

export interface Equipment {
  id?: string;
  name: string;
  description: string;
  imageUrl: string;
}

export const getEquipment = async (): Promise<Equipment[]> => {
  const equipmentCol = collection(db, 'equipment');
  const equipmentSnapshot = await getDocs(equipmentCol);
  return equipmentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Equipment));
};

export const checkEquipmentExists = async (name: string): Promise<boolean> => {
  const equipmentCol = collection(db, 'equipment');
  const q = query(equipmentCol, where('name', '==', name), limit(1));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

export const saveEquipment = async (equipment: Equipment): Promise<void> => {
  const response = await fetch('https://us-central1-fourtyfit-44a5b.cloudfunctions.net/addEquipment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(equipment),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to save equipment');
  }
};

export const deleteEquipment = async (id: string): Promise<void> => {
  const response = await fetch('https://us-central1-fourtyfit-44a5b.cloudfunctions.net/removeEquipment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete equipment');
  }
};
