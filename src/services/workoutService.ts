// src/services/workoutService.ts
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc, query, where, limit } from 'firebase/firestore';
import { db } from '../firebase/config';

export interface Workout {
  id?: string;
  name: string;
  exerciseGroups: ExerciseGroup[];
}

export interface ExerciseGroup {
  exercises: WorkoutExercise[];
  sets: number;
}

export interface WorkoutExercise {
  exerciseId: string;
  reps: number;
  weight: number;
}

export const getWorkouts = async (): Promise<Workout[]> => {
  const workoutsCol = collection(db, 'workouts');
  const workoutSnapshot = await getDocs(workoutsCol);
  return workoutSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Workout));
};

export const getWorkout = async (id: string): Promise<Workout> => {
  const workoutDoc = doc(db, 'workouts', id);
  const workoutSnapshot = await getDoc(workoutDoc);
  if (!workoutSnapshot.exists()) {
    throw new Error('Workout not found');
  }
  return { id: workoutSnapshot.id, ...workoutSnapshot.data() } as Workout;
};

export const saveWorkout = async (workout: Workout): Promise<void> => {
  if (workout.id) {
    await setDoc(doc(db, 'workouts', workout.id), workout);
  } else {
    const newWorkoutRef = doc(collection(db, 'workouts'));
    await setDoc(newWorkoutRef, workout);
  }
};

export const checkWorkoutExists = async (name: string): Promise<boolean> => {
  const workoutsCol = collection(db, 'workouts');
  const q = query(workoutsCol, where('name', '==', name), limit(1));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

export const deleteWorkout = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'workouts', id));
};