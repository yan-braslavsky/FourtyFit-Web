import { useState, useEffect } from "react";
import { getWorkouts, deleteWorkout, DetailedWorkout } from "../../services/workoutService";
import { getMuscleGroups, MuscleGroup } from "../../services/muscleGroupService";
import { getEquipment, Equipment } from "../../services/equipmentService";

export const useWorkoutsViewModel = () => {
  const [workouts, setWorkouts] = useState<DetailedWorkout[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const [fetchedWorkouts, fetchedMuscleGroups, fetchedEquipment] = await Promise.all([
        getWorkouts(),
        getMuscleGroups(),
        getEquipment()
      ]);
      setWorkouts(fetchedWorkouts);
      setMuscleGroups(fetchedMuscleGroups);
      setEquipmentList(fetchedEquipment);
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

  return { workouts, muscleGroups, equipmentList, loading, error, handleDelete };
};