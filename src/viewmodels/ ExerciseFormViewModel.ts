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
    muscleGroupIds: [], // Changed from muscleGroups to muscleGroupIds
  });
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<MuscleGroup[]>([]);
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
          setSelectedMuscleGroups(
            fetchedMuscleGroups.filter((mg) => fetchedExercise.muscleGroupIds?.includes(mg.id!))
          );
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
    setExpandedGroups((prev) =>
      prev.includes(muscleGroupId)
        ? prev.filter((id) => id !== muscleGroupId)
        : [...prev, muscleGroupId]
    );
  };

  const selectMuscleGroup = (muscleGroup: MuscleGroup) => {
    if (!selectedMuscleGroups.find((mg) => mg.id === muscleGroup.id)) {
      setSelectedMuscleGroups([...selectedMuscleGroups, muscleGroup]);
      setExercise({
        ...exercise,
        muscleGroupIds: [...(exercise.muscleGroupIds || []), muscleGroup.id!],
      });
    }
  };

  const removeMuscleGroup = (muscleGroupId: string) => {
    setSelectedMuscleGroups(selectedMuscleGroups.filter((mg) => mg.id !== muscleGroupId));
    setExercise({
      ...exercise,
      muscleGroupIds: exercise.muscleGroupIds?.filter((id) => id !== muscleGroupId) || [],
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
    expandedGroups,
    selectedMuscleGroups,
    error,
    imageFile,
    setImageFile,
    handleInputChange,
    handleEquipmentChange,
    toggleMuscleGroup,
    selectMuscleGroup,
    removeMuscleGroup,
    handleSubmit,
  };
};