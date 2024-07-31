import { useState, useEffect } from "react";
import { Exercise } from "../services/exerciseService";
import { Equipment } from "../services/equipmentService";
import { MuscleGroup } from "../services/muscleGroupService";
import { getExercise, saveExercise, updateExercise } from "../services/exerciseService";
import { getEquipment } from "../services/equipmentService";
import { getMuscleGroups } from "../services/muscleGroupService";
import { uploadImage } from "../services/storageService";

export const useExerciseFormViewModel = (id?: string) => {
  const [exercise, setExercise] = useState<Exercise>({
    name: "",
    description: "",
    imageUrl: "",
    equipmentIds: [],
    muscleGroupIds: [],
  });
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedEquipment, fetchedMuscleGroups] = await Promise.all([
          getEquipment(),
          getMuscleGroups(),
        ]);
        setEquipment(fetchedEquipment);
        setMuscleGroups(fetchedMuscleGroups);

        if (id) {
          const fetchedExercise = await getExercise(id);
          setExercise(fetchedExercise);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      }
    };
    fetchData();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setExercise({ ...exercise, [name]: value });
  };

  const handleEquipmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setExercise({ ...exercise, equipmentIds: selectedOptions });
  };

  const toggleMuscleGroup = (muscleGroupId: string) => {
    setExercise(prev => {
      const newMuscleGroupIds = prev.muscleGroupIds.includes(muscleGroupId)
        ? prev.muscleGroupIds.filter(id => id !== muscleGroupId)
        : [...prev.muscleGroupIds, muscleGroupId];
      return { ...prev, muscleGroupIds: newMuscleGroupIds };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      let imageUrl = exercise.imageUrl;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile, `exercises/${Date.now()}.png`);
      }

      const exerciseData = { ...exercise, imageUrl };

      if (id) {
        await updateExercise(exerciseData);
      } else {
        await saveExercise(exerciseData);
      }

      return true; // Indicate success
    } catch (error) {
      console.error("Error saving exercise:", error);
      setError("Failed to save exercise. Please try again.");
      return false; // Indicate failure
    }
  };

  return {
    exercise,
    equipment,
    muscleGroups,
    error,
    imageFile,
    setImageFile,
    handleInputChange,
    handleEquipmentChange,
    toggleMuscleGroup,
    handleSubmit,
  };
};