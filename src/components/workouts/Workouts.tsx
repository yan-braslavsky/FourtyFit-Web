import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useWorkoutsViewModel } from "./WorkoutsViewModel";
import { 
  WorkoutListContainer, 
  WorkoutItem, 
  WorkoutInfo, 
  WorkoutName, 
  ButtonGroup, 
  IconButton, 
  AddWorkoutButton,
  WorkoutImage,
  BadgeContainer,
  Badge,
  TopBar,
  ExerciseGroupInfo,
  BadgeSection
} from "./WorkoutsStyles";
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
          <TopBar>
            <h2>Workouts</h2>
            <AddWorkoutButton onClick={() => navigate("create")}>
              <FaPlus /> Add Workout
            </AddWorkoutButton>
          </TopBar>
          {workouts.length === 0 ? (
            <p>No workouts saved yet. Create your first workout!</p>
          ) : (
            workouts.map(workout => (
              <WorkoutItem key={workout.id}>
                <WorkoutImage src={workout.imageUrl || "/placeholder-workout-image.jpg"} alt={workout.name} />
                <WorkoutInfo>
                  <WorkoutName>{workout.name}</WorkoutName>
                  <BadgeSection>
                    <h4>Muscle Groups:</h4>
                    <BadgeContainer>
                      {workout.muscleGroups && workout.muscleGroups.map(group => (
                        <Badge key={group} color="primary">{group}</Badge>
                      ))}
                    </BadgeContainer>
                  </BadgeSection>
                  <BadgeSection>
                    <h4>Equipment:</h4>
                    <BadgeContainer>
                      {workout.equipment && workout.equipment.map(item => (
                        <Badge key={item} color="secondary">{item}</Badge>
                      ))}
                    </BadgeContainer>
                  </BadgeSection>
                  <ExerciseGroupInfo>Exercise groups: {workout.exerciseGroups.length}</ExerciseGroupInfo>
                </WorkoutInfo>
                <ButtonGroup>
                  <IconButton onClick={() => navigate(`edit/${workout.id}`)}><FaEdit /></IconButton>
                  <IconButton onClick={() => workout.id && handleDelete(workout.id)}><FaTrash /></IconButton>
                </ButtonGroup>
              </WorkoutItem>
            ))
          )}
        </WorkoutListContainer>
      } />
      <Route path="create" element={<WorkoutForm />} />
      <Route path="edit/:id" element={<WorkoutForm />} />
    </Routes>
  );
};

export default Workouts;