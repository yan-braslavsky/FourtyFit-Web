// src/services/workoutService.ts
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export interface Workout {
  id?: string;
  name: string;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  equipment?: string;
  weight?: number;
}

export interface Set {
  repetitions: number;
}

export const getWorkouts = async (): Promise<Workout[]> => {
  const workoutsCol = collection(db, 'workouts');
  const workoutSnapshot = await getDocs(workoutsCol);
  return workoutSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Workout));
};

export const getWorkout = async (id: string): Promise<Workout> => {
  const workoutDoc = doc(db, 'workouts', id);
  const workoutSnapshot = await getDoc(workoutDoc);
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