import { useState, useEffect } from "react";
import { getWorkouts, deleteWorkout, Workout } from "../../services/workoutService";

export const useWorkoutsViewModel = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const fetchedWorkouts = await getWorkouts();
      setWorkouts(fetchedWorkouts);
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

  return { workouts, loading, error, handleDelete };
};