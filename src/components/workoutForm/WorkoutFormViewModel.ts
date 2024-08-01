import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getWorkout, saveWorkout, checkWorkoutExists, Workout, ExerciseGroup, WorkoutExercise } from "../../services/workoutService";
import { getExercises, Exercise } from "../../services/exerciseService";
import { getMuscleGroups, MuscleGroup } from "../../services/muscleGroupService";
import { getEquipment, Equipment } from "../../services/equipmentService";

enum FormStage {
  TITLE,
  DETAILS,
  GROUP,
  REVIEW
}

export const useWorkoutFormViewModel = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<Workout>({ 
    name: "", 
    imageUrl: "",
    muscleGroups: [],
    equipment: [],
    exerciseGroups: [] 
  });
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [currentGroup, setCurrentGroup] = useState<ExerciseGroup>({ exercises: [], sets: 1 });
  const [formStage, setFormStage] = useState<FormStage>(FormStage.TITLE);
  const [titleError, setTitleError] = useState<string>("");
  const [editingGroupIndex, setEditingGroupIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        setEquipmentList(fetchedEquipment);

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

  const handleTitleChange = async (newTitle: string) => {
    setWorkout({ ...workout, name: newTitle });
    
    if (newTitle.trim() !== "") {
      const exists = await checkWorkoutExists(newTitle);
      if (exists && newTitle !== workout.name) {
        setTitleError("A workout with this title already exists");
      } else {
        setTitleError("");
      }
    } else {
      setTitleError("");
    }
  };

  const handleAddExercise = () => {
    setCurrentGroup(prevGroup => ({
      ...prevGroup,
      exercises: [
        ...prevGroup.exercises,
        { exerciseId: "", reps: 0, weight: 0 }
      ]
    }));
  };

  const handleExerciseChange = (index: number, field: keyof WorkoutExercise, value: string | number) => {
    setCurrentGroup(prevGroup => ({
      ...prevGroup,
      exercises: prevGroup.exercises.map((exercise, i) =>
        i === index ? { ...exercise, [field]: value } : exercise
      )
    }));
  };

  const handleMuscleGroupChange = (selectedGroups: string[]) => {
    setWorkout(prev => ({ ...prev, muscleGroups: selectedGroups }));
  };

  const handleEquipmentChange = (selectedEquipment: string[]) => {
    setWorkout(prev => ({ ...prev, equipment: selectedEquipment }));
  };

  const handleAddGroup = () => {
    if (editingGroupIndex !== null) {
      setWorkout(prevWorkout => ({
        ...prevWorkout,
        exerciseGroups: prevWorkout.exerciseGroups.map((group, index) =>
          index === editingGroupIndex ? currentGroup : group
        )
      }));
      setEditingGroupIndex(null);
    } else {
      setWorkout(prevWorkout => ({
        ...prevWorkout,
        exerciseGroups: [...prevWorkout.exerciseGroups, currentGroup]
      }));
    }
    setCurrentGroup({ exercises: [], sets: 1 });
    setFormStage(FormStage.REVIEW);
  };

  const handleEditGroup = (index: number) => {
    setCurrentGroup(workout.exerciseGroups[index]);
    setEditingGroupIndex(index);
    setFormStage(FormStage.GROUP);
  };

  const handleDeleteGroup = (index: number) => {
    setWorkout(prevWorkout => ({
      ...prevWorkout,
      exerciseGroups: prevWorkout.exerciseGroups.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    setError(null);

    try {
      const savedWorkout = await saveWorkout(workout);
      setWorkout(savedWorkout);
      navigate("/workouts");
    } catch (error) {
      console.error("Error saving workout:", error);
      setError("Failed to save workout. Please try again.");
    }
  };

  return {
    workout,
    exercises,
    muscleGroups,
    equipmentList,
    currentGroup,
    formStage,
    titleError,
    editingGroupIndex,
    error,
    handleTitleChange,
    handleAddExercise,
    handleExerciseChange,
    handleMuscleGroupChange,
    handleEquipmentChange,
    handleAddGroup,
    handleEditGroup,
    handleDeleteGroup,
    handleSubmit,
    setFormStage,
    setCurrentGroup,
    setWorkout,
    FormStage
  };
};