// src/services/equipmentService.ts
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { httpsCallable,HttpsCallableResult } from 'firebase/functions';
import { db } from '../firebase/config';
import { functions } from '../firebase/config';

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
  const addEquipmentFunction = httpsCallable(functions, 'addEquipment');
  await addEquipmentFunction(equipment);
};

export const deleteEquipment = async (id: string): Promise<void> => {
  const deleteEquipmentFunction = httpsCallable(functions, 'deleteEquipment');
  try {
    const result: HttpsCallableResult = await deleteEquipmentFunction({ id });
    console.log("Delete equipment result:", result.data);
    if (!result.data || !(result.data as any).success) {
      throw new Error('Failed to delete equipment: Operation did not return success');
    }
  } catch (error) {
    console.error('Error in deleteEquipment:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to delete equipment: ${error.message}`);
    } else {
      throw new Error('Failed to delete equipment: Unknown error');
    }
  }
};