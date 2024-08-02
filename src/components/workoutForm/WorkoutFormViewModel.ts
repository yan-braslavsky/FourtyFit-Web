import { useState, useEffect, MutableRefObject } from "react";
import { Workout, getWorkout, saveWorkout, checkWorkoutExists } from "../../services/workoutService";
import { Exercise, getExercises } from "../../services/exerciseService";
import { uploadImage } from "../../services/storageService";

export const useWorkoutFormViewModel = (id?: string, cropperRef?: MutableRefObject<any>) => {
  const [workout, setWorkout] = useState<Workout>({
    name: "",
    imageUrl: "",
    exerciseGroups: []
  });
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedExercises = await getExercises();
        setExercises(fetchedExercises);
        setFilteredExercises(fetchedExercises);

        if (id) {
          const fetchedWorkout = await getWorkout(id);
          setWorkout(fetchedWorkout);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      }
    };
    fetchData();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setWorkout({ ...workout, [name]: value });
  };

  const toggleExercise = (groupIndex: number, exerciseId: string) => {
    setWorkout(prev => {
      const newExerciseGroups = [...prev.exerciseGroups];
      const group = newExerciseGroups[groupIndex];
      const existingExercise = group.exercises.find(e => e.exerciseId === exerciseId);
      if (existingExercise) {
        group.exercises = group.exercises.filter(e => e.exerciseId !== exerciseId);
      } else {
        group.exercises.push({ exerciseId, reps: 0, weight: 0 });
      }
      return { ...prev, exerciseGroups: newExerciseGroups };
    });
  };

  const addExerciseGroup = () => {
    setWorkout(prev => ({
      ...prev,
      exerciseGroups: [...prev.exerciseGroups, { exercises: [], sets: 1 }]
    }));
  };

  const removeExerciseGroup = (index: number) => {
    setWorkout(prev => ({
      ...prev,
      exerciseGroups: prev.exerciseGroups.filter((_, i) => i !== index)
    }));
  };

  const updateExerciseGroup = (index: number, field: string, value: number) => {
    setWorkout(prev => {
      const newExerciseGroups = [...prev.exerciseGroups];
      newExerciseGroups[index] = { ...newExerciseGroups[index], [field]: value };
      return { ...prev, exerciseGroups: newExerciseGroups };
    });
  };

  const filterExercises = (searchTerm: string) => {
    const filtered = exercises.filter(exercise =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredExercises(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      let imageUrl = workout.imageUrl;

      if (imageFile && cropperRef?.current) {
        const croppedImageBlob = await cropperRef.current.cropImage();
        imageUrl = await uploadImage(croppedImageBlob, `workouts/${Date.now()}.png`);
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

      await saveWorkout(workoutData);
      return true;
    } catch (error) {
      console.error("Error saving workout:", error);
      setError("Failed to save workout. Please try again.");
      return false;
    }
  };

  return {
    workout,
    exercises: filteredExercises,
    error,
    imageFile,
    setImageFile,
    handleInputChange,
    toggleExercise,
    handleSubmit,
    addExerciseGroup,
    removeExerciseGroup,
    updateExerciseGroup,
    filterExercises,
  };
};