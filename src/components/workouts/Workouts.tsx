import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useWorkoutsViewModel } from "./WorkoutsViewModel";
import { WorkoutListContainer, WorkoutItem, WorkoutInfo, WorkoutName, ButtonGroup, IconButton, CreateWorkoutButton } from "./WorkoutsStyles";
import WorkoutForm from "../workoutForm/WorkoutForm";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const Workouts: React.FC = () => {
  const { workouts, loading, error, handleDelete } = useWorkoutsViewModel();
  const navigate = useNavigate();

  if (loading) {
    return <WorkoutListContainer>Loading workouts...</WorkoutListContainer>;
  }

  if (error) {
    return <WorkoutListContainer>{error}</WorkoutListContainer>;
  }

  return (
    <Routes>
      <Route path="/" element={
        <WorkoutListContainer>
          <h2>Workouts</h2>
          {workouts.length === 0 ? (
            <p>No workouts saved yet. Create your first workout!</p>
          ) : (
            workouts.map(workout => (
              <WorkoutItem key={workout.id}>
                <WorkoutInfo>
                  <WorkoutName>{workout.name}</WorkoutName>
                  <p>Number of exercise groups: {workout.exerciseGroups.length}</p>
                </WorkoutInfo>
                <ButtonGroup>
                  <IconButton onClick={() => navigate(`edit/${workout.id}`)}><FaEdit /></IconButton>
                  <IconButton onClick={() => workout.id && handleDelete(workout.id)}><FaTrash /></IconButton>
                </ButtonGroup>
              </WorkoutItem>
            ))
          )}
          <CreateWorkoutButton onClick={() => navigate("create")}>
            <FaPlus /> Create New Workout
          </CreateWorkoutButton>
        </WorkoutListContainer>
      } />
      <Route path="create" element={<WorkoutForm />} />
      <Route path="edit/:id" element={<WorkoutForm />} />
    </Routes>
  );
};

export default Workouts;