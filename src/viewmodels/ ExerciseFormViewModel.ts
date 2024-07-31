import { useState, useEffect, MutableRefObject } from "react";
import { Exercise } from "../services/exerciseService";
import { Equipment } from "../services/equipmentService";
import { MuscleGroup } from "../services/muscleGroupService";
import { getExercise, saveExercise, updateExercise } from "../services/exerciseService";
import { getEquipment } from "../services/equipmentService";
import { getMuscleGroups } from "../services/muscleGroupService";
import { uploadImage } from "../services/storageService";

export const useExerciseFormViewModel = (id?: string, cropperRef?: MutableRefObject<any>) => {
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

  const toggleEquipment = (equipmentId: string) => {
    setExercise(prev => {
      const newEquipmentIds = prev.equipmentIds.includes(equipmentId)
        ? prev.equipmentIds.filter(id => id !== equipmentId)
        : [...prev.equipmentIds, equipmentId];
      return { ...prev, equipmentIds: newEquipmentIds };
    });
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

      if (imageFile && cropperRef?.current) {
        const croppedImageBlob = await cropperRef.current.cropImage();
        imageUrl = await uploadImage(croppedImageBlob, `exercises/${Date.now()}.png`);
      }

      const exerciseData: Exercise = {
        ...exercise,
        imageUrl,
      };

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
    toggleEquipment,
    toggleMuscleGroup,
    handleSubmit,
  };
};