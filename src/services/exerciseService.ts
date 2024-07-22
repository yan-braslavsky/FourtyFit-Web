// src/services/exerciseService.ts
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export interface Exercise {
  id?: string;
  name: string;
  description: string;
  imageUrl: string;
  equipmentIds: string[];
}

export const getExercises = async (): Promise<Exercise[]> => {
  const exercisesCol = collection(db, 'exercises');
  const exerciseSnapshot = await getDocs(exercisesCol);
  return exerciseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exercise));
};

export const getExercise = async (id: string): Promise<Exercise> => {
  const exerciseDoc = doc(db, 'exercises', id);
  const exerciseSnapshot = await getDoc(exerciseDoc);
  if (!exerciseSnapshot.exists()) {
    throw new Error('Exercise not found');
  }
  return { id: exerciseSnapshot.id, ...exerciseSnapshot.data() } as Exercise;
};

export const saveExercise = async (exercise: Exercise): Promise<void> => {
  if (exercise.id) {
    await setDoc(doc(db, 'exercises', exercise.id), exercise);
  } else {
    const newExerciseRef = doc(collection(db, 'exercises'));
    await setDoc(newExerciseRef, exercise);
  }
};