import { useState, useEffect, MutableRefObject, useCallback, useMemo } from "react";
import { Workout, getWorkout, saveWorkout, checkWorkoutExists } from "../../services/workoutService";
import { Exercise, getExercises } from "../../services/exerciseService";
import { uploadImage } from "../../services/storageService";
import { MuscleGroup, getMuscleGroups } from "../../services/muscleGroupService";
import { Equipment, getEquipment } from "../../services/equipmentService";

export const useWorkoutFormViewModel = (id?: string, cropperRef?: MutableRefObject<any>) => {
  const [workout, setWorkout] = useState<Workout>({
    name: "",
    imageUrl: "",
    exerciseGroups: []
  });
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<boolean[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedExercises, fetchedMuscleGroups, fetchedEquipment] = await Promise.all([
          getExercises(),
          getMuscleGroups(),
          getEquipment()
        ]);
        setExercises(fetchedExercises);
        setMuscleGroups(fetchedMuscleGroups);
        setEquipment(fetchedEquipment);

        if (id) {
          const fetchedWorkout = await getWorkout(id);
          setWorkout(fetchedWorkout);
          // Initialize all groups as collapsed
          setExpandedGroups(new Array(fetchedWorkout.exerciseGroups.length).fill(false));
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      }
    };
    fetchData();
  }, [id]);

  const isFormValid = useMemo(() => {
    const hasValidName = workout.name.trim() !== "";
    const hasValidImage = workout.imageUrl !== "" || imageFile !== null;
    const hasValidGroups = workout.exerciseGroups.length > 0 &&
      workout.exerciseGroups.every(group => group.exercises.length > 0);


    return hasValidName && hasValidImage && hasValidGroups;
  }, [workout, imageFile]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setWorkout(prev => ({ ...prev, [name]: value }));
    console.log("WorkoutFormViewModel: Input changed", { name, value });
  }, []);

  const toggleExercise = useCallback((groupIndex: number, exerciseId: string) => {
    console.log("WorkoutFormViewModel: Toggling exercise", { groupIndex, exerciseId });
    setWorkout(prev => {
      const newExerciseGroups = [...prev.exerciseGroups];
      const group = newExerciseGroups[groupIndex];
      const existingExercise = group.exercises.find(e => e.exerciseId === exerciseId);
      if (existingExercise) {
        group.exercises = group.exercises.filter(e => e.exerciseId !== exerciseId);
      } else {
        group.exercises.push({ exerciseId, reps: 0, weight: 0 });
      }
      console.log("WorkoutFormViewModel: Updated exercise groups", newExerciseGroups);
      return { ...prev, exerciseGroups: newExerciseGroups };
    });
  }, []);

  const addExerciseGroup = useCallback(() => {
    setWorkout(prev => ({
      ...prev,
      exerciseGroups: [...prev.exerciseGroups, { exercises: [], sets: 2 }]
    }));
    setExpandedGroups(prev => [...prev, true]); // New group is expanded by default
  }, []);

  const removeExerciseGroup = useCallback((index: number) => {
    console.log("WorkoutFormViewModel: Removing exercise group", { index });
    setWorkout(prev => ({
      ...prev,
      exerciseGroups: prev.exerciseGroups.filter((_, i) => i !== index)
    }));
    setExpandedGroups(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateExerciseGroup = useCallback((index: number, field: string, value: number) => {
    console.log("WorkoutFormViewModel: Updating exercise group", { index, field, value });
    setWorkout(prev => {
      const newExerciseGroups = [...prev.exerciseGroups];
      newExerciseGroups[index] = { ...newExerciseGroups[index], [field]: value };
      return { ...prev, exerciseGroups: newExerciseGroups };
    });
  }, []);

  const reorderExerciseGroups = useCallback((startIndex: number, endIndex: number) => {
    console.log("WorkoutFormViewModel: Reordering exercise groups", { startIndex, endIndex });
    setWorkout(prevWorkout => {
      const result = Array.from(prevWorkout.exerciseGroups);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);

      return {
        ...prevWorkout,
        exerciseGroups: result
      };
    });
    setExpandedGroups(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);

  const updateWorkoutImage = useCallback((imageUrl: string) => {
    console.log("WorkoutFormViewModel: Updating workout image", { imageUrl });
    setWorkout(prev => ({ ...prev, imageUrl }));
  }, []);

  const getMuscleGroupName = useCallback((id: string) => {
    return muscleGroups.find(mg => mg.id === id)?.name || id;
  }, [muscleGroups]);

  const getEquipmentName = useCallback((id: string) => {
    return equipment.find(eq => eq.id === id)?.name || id;
  }, [equipment]);

  const toggleGroupExpansion = useCallback((index: number) => {
    setExpandedGroups(prev => {
      const newExpandedGroups = [...prev];
      newExpandedGroups[index] = !newExpandedGroups[index];
      return newExpandedGroups;
    });
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("WorkoutFormViewModel: Submitting workout", { workout });
    setError(null);

    if (!workout.name.trim() || workout.exerciseGroups.length === 0 ||
      !workout.exerciseGroups.every(group => group.exercises.length > 0)) {
      setError("Please fill in all required fields and add at least one exercise to each group.");
      return false;
    }

    try {
      let imageUrl = workout.imageUrl;

      if (imageFile && cropperRef?.current) {
        console.log("WorkoutFormViewModel: Cropping and uploading image");
        const croppedImageBlob = await cropperRef.current.cropImage();
        imageUrl = await uploadImage(croppedImageBlob, `workouts/${Date.now()}.png`);
      }

      if (!imageUrl) {
        setError("Please upload an image for the workout.");
        return false;
      }

      const workoutData: Workout = {
        ...workout,
        imageUrl,
      };

      const exists = await checkWorkoutExists(workoutData.name);
      if (exists && (!id || workoutData.name !== workout.name)) {
        setError("A workout with this name already exists.");
        return false;
      }

      console.log("WorkoutFormViewModel: Saving workout", { workoutData });
      await saveWorkout(workoutData);
      console.log("WorkoutFormViewModel: Workout saved successfully");
      return true;
    } catch (error) {
      console.error("WorkoutFormViewModel: Error saving workout:", error);
      setError("Failed to save workout. Please try again.");
      return false;
    }
  }, [workout, imageFile, cropperRef, id]);

  return {
    workout,
    exercises,
    error,
    imageFile,
    setImageFile,
    handleInputChange,
    toggleExercise,
    handleSubmit,
    addExerciseGroup,
    removeExerciseGroup,
    updateExerciseGroup,
    reorderExerciseGroups,
    updateWorkoutImage,
    getMuscleGroupName,
    getEquipmentName,
    expandedGroups,
    toggleGroupExpansion,
    isFormValid,
  };
};