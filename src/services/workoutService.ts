import { collection, getDocs, doc, getDoc, query, where,setDoc,deleteDoc,limit } from "firebase/firestore";
import { db } from "../firebase/config";
import { Exercise } from "./exerciseService";
import { MuscleGroup } from "./muscleGroupService";
import { Equipment } from "./equipmentService";


export interface Workout {
  id?: string;
  name: string;
  imageUrl: string;
  muscleGroups: string[];
  equipment: string[];
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

export interface DetailedWorkout extends Workout {
  muscleGroups: string[];
  equipment: string[];
}

export const getWorkouts = async (): Promise<Workout[]> => {
  const workoutsCol = collection(db, 'workouts');
  const workoutSnapshot = await getDocs(workoutsCol);
  const workouts = workoutSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Workout));

  const detailedWorkouts = await Promise.all(workouts.map(async (workout) => {
    const muscleGroups = new Set<string>();
    const equipment = new Set<string>();

    for (const group of workout.exerciseGroups) {
      for (const exercise of group.exercises) {
        const exerciseDoc = await getDoc(doc(db, 'exercises', exercise.exerciseId));
        const exerciseData = exerciseDoc.data() as Exercise;
        
        exerciseData.muscleGroupIds?.forEach(id => muscleGroups.add(id));
        exerciseData.equipmentIds?.forEach(id => equipment.add(id));
      }
    }

    return {
      ...workout,
      muscleGroups: Array.from(muscleGroups),
      equipment: Array.from(equipment),
    };
  }));

  return detailedWorkouts;
};

export const getWorkout = async (id: string): Promise<Workout> => {
  const workoutDoc = doc(db, "workouts", id);
  const workoutSnapshot = await getDoc(workoutDoc);
  if (!workoutSnapshot.exists()) {
    throw new Error("Workout not found");
  }
  return { id: workoutSnapshot.id, ...workoutSnapshot.data() } as Workout;
};

export const saveWorkout = async (workout: Workout): Promise<Workout> => {
  if (workout.id) {
    await setDoc(doc(db, "workouts", workout.id), workout);
    return workout;
  } else {
    const newWorkoutRef = doc(collection(db, "workouts"));
    const newWorkout = { ...workout, id: newWorkoutRef.id };
    await setDoc(newWorkoutRef, newWorkout);
    return newWorkout;
  }
};

export const deleteWorkout = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "workouts", id));
};

export const checkWorkoutExists = async (name: string): Promise<boolean> => {
  const workoutsCol = collection(db, "workouts");
  const q = query(workoutsCol, where("name", "==", name), limit(1));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};