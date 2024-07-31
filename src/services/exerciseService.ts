// src/services/exerciseService.ts
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

import { db } from '../firebase/config';

export interface Exercise {
  id?: string;
  name: string;
  description: string;
  imageUrl: string;
  equipmentIds: string[];
  muscleGroupIds: string[]; // This should be muscleGroupIds, not muscleGroups
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

export const saveExercise = async (exercise: Exercise): Promise<Exercise> => {
  const response = await fetch('https://us-central1-fourtyfit-44a5b.cloudfunctions.net/addExercise', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(exercise),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to save exercise');
  }

  const result = await response.json();
  return { ...exercise, id: result.id };
};

export const updateExercise = async (exercise: Exercise): Promise<void> => {
  const response = await fetch('https://us-central1-fourtyfit-44a5b.cloudfunctions.net/updateExercise', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(exercise),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update exercise');
  }
};

export const deleteExercise = async (id: string): Promise<void> => {
  const response = await fetch('https://us-central1-fourtyfit-44a5b.cloudfunctions.net/removeExercise', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete exercise');
  }
};