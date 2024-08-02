import { useState, useEffect } from "react";
import { getWorkouts, deleteWorkout, Workout, DetailedWorkout } from "../../services/workoutService";
import { getMuscleGroups, MuscleGroup } from "../../services/muscleGroupService";
import { getEquipment, Equipment } from "../../services/equipmentService";
import { getExercises, Exercise } from "../../services/exerciseService";

export const useWorkoutsViewModel = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const [fetchedWorkouts, fetchedMuscleGroups, fetchedEquipment, fetchedExercises] = await Promise.all([
        getWorkouts(),
        getMuscleGroups(),
        getEquipment(),
        getExercises()
      ]);
      
      setWorkouts(fetchedWorkouts);
      setMuscleGroups(fetchedMuscleGroups);
      setEquipmentList(fetchedEquipment);
      setExercises(fetchedExercises);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching workouts:", err);
      setError("Failed to load workouts. Please try again.");
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this workout?")) {
      try {
        await deleteWorkout(id);
        setWorkouts(workouts.filter(workout => workout.id !== id));
      } catch (err) {
        console.error("Error deleting workout:", err);
        setError("Failed to delete workout. Please try again.");
      }
    }
  };

  const getFullExercise = (exerciseId: string): Exercise | undefined => {
    return exercises.find(exercise => exercise.id === exerciseId);
  };

  return { workouts, muscleGroups, equipmentList, loading, error, handleDelete, getFullExercise };
};