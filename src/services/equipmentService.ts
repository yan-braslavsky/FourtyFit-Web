// src/services/equipmentService.ts
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
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

export const saveEquipment = async (equipment: Equipment): Promise<void> => {
  const newEquipmentRef = doc(collection(db, 'equipment'));
  await setDoc(newEquipmentRef, equipment);
};