// src/services/muscleGroupService.ts
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export interface Muscle {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
}

export interface MuscleGroup {
  id?: string;
  name: string;
  muscles: Muscle[];
  imageUrl: string;
}

export const getMuscleGroups = async (): Promise<MuscleGroup[]> => {
  const muscleGroupsCol = collection(db, "muscleGroups");
  const muscleGroupSnapshot = await getDocs(muscleGroupsCol);
  return muscleGroupSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MuscleGroup));
};

export const getMuscleGroup = async (id: string): Promise<MuscleGroup> => {
  const muscleGroupDoc = doc(db, "muscleGroups", id);
  const muscleGroupSnapshot = await getDoc(muscleGroupDoc);
  if (!muscleGroupSnapshot.exists()) {
    throw new Error("Muscle group not found");
  }
  return { id: muscleGroupSnapshot.id, ...muscleGroupSnapshot.data() } as MuscleGroup;
};

export const saveMuscleGroup = async (muscleGroup: MuscleGroup): Promise<void> => {
  const response = await fetch("https://us-central1-fourtyfit-44a5b.cloudfunctions.net/addMuscleGroup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(muscleGroup),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to save muscle group");
  }
};

export const updateMuscleGroup = async (muscleGroup: MuscleGroup): Promise<void> => {
  const response = await fetch("https://us-central1-fourtyfit-44a5b.cloudfunctions.net/updateMuscleGroup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(muscleGroup),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update muscle group");
  }
};

export const deleteMuscleGroup = async (id: string): Promise<void> => {
  const response = await fetch("https://us-central1-fourtyfit-44a5b.cloudfunctions.net/removeMuscleGroup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to delete muscle group");
  }
};