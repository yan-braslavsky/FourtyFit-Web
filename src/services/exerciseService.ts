import { collection, getDocs, doc, getDoc, setDoc, updateDoc, query, where, limit } from 'firebase/firestore';
import { db } from '../firebase/config';

export interface Exercise {
  id?: string;
  name: string;
  description: string;
  imageUrl: string;
  equipmentIds: string[];
  muscleGroupIds: string[];
}

export const getExercises = async (): Promise<Exercise[]> => {
  const exercisesCol = collection(db, "exercises");
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
  const newExerciseRef = doc(collection(db, 'exercises'));
  const newExercise = { ...exercise, id: newExerciseRef.id };
  await setDoc(newExerciseRef, newExercise);
  console.log("Saved exercise:", newExercise);
  return newExercise;
};

export const updateExercise = async (exercise: Exercise): Promise<Exercise> => {
  if (!exercise.id) {
    throw new Error('Exercise ID is required for updating');
  }
  const exerciseRef = doc(db, 'exercises', exercise.id);
  const { id, ...updateData } = exercise;
  await updateDoc(exerciseRef, updateData);
  console.log("Updated exercise:", exercise);
  return exercise;
};

export const deleteExercise = async (id: string): Promise<void> => {
  await setDoc(doc(db, 'exercises', id), { deleted: true }, { merge: true });
};

export const checkExerciseExists = async (name: string): Promise<boolean> => {
  const exercisesCol = collection(db, "exercises");
  const q = query(exercisesCol, where("name", "==", name), limit(1));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};