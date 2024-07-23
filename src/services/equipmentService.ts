// src/services/equipmentService.ts
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { where, query, limit } from 'firebase/firestore';

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

export const checkEquipmentExists = async (name: string): Promise<boolean> => {
  const equipmentCol = collection(db, 'equipment');
  const q = query(equipmentCol, where('name', '==', name), limit(1));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};