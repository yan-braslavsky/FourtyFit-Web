import React, { useEffect } from "react";
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
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import { Workout } from "../../services/workoutService";

const Workouts: React.FC = () => {
  const { workouts, muscleGroups, equipmentList, loading, error, handleDelete, getFullExercise } = useWorkoutsViewModel();
  const navigate = useNavigate();

  if (loading) {
    return <WorkoutListContainer>Loading workouts...</WorkoutListContainer>;
  }

  if (error) {
    return <WorkoutListContainer>{error}</WorkoutListContainer>;
  }

  const getUniqueBadges = (workout: Workout, type: 'muscleGroups' | 'equipment'): string[] => {
    const allIds = workout.exerciseGroups.flatMap(group => 
      group.exercises.flatMap(exercise => {
        const fullExercise = getFullExercise(exercise.exerciseId);
        return type === 'muscleGroups' ? fullExercise?.muscleGroupIds || [] : fullExercise?.equipmentIds || [];
      })
    );
    return Array.from(new Set(allIds));
  };

  const WorkoutsList = () => (
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
          <WorkoutItem key={workout.id} onClick={() => navigate(`edit/${workout.id}`)}>
            <WorkoutImage src={workout.imageUrl || "/placeholder-workout-image.jpg"} alt={workout.name} />
            <WorkoutInfo>
              <WorkoutName>{workout.name}</WorkoutName>
              <BadgeSection>
                <h4>Muscle Groups:</h4>
                <BadgeContainer>
                  {getUniqueBadges(workout, 'muscleGroups').map(groupId => {
                    const group = muscleGroups.find(mg => mg.id === groupId);
                    return group && <Badge key={groupId} color="primary">{group.name}</Badge>;
                  })}
                </BadgeContainer>
              </BadgeSection>
              <BadgeSection>
                <h4>Equipment:</h4>
                <BadgeContainer>
                  {getUniqueBadges(workout, 'equipment').map(equipId => {
                    const equip = equipmentList.find(eq => eq.id === equipId);
                    return equip && <Badge key={equipId} color="secondary">{equip.name}</Badge>;
                  })}
                </BadgeContainer>
              </BadgeSection>
              <ExerciseGroupInfo>Exercise groups: {workout.exerciseGroups.length}</ExerciseGroupInfo>
            </WorkoutInfo>
            <ButtonGroup>
              <IconButton onClick={(e) => {
                e.stopPropagation();
                navigate(`edit/${workout.id}`);
              }}>
                <FaEdit />
              </IconButton>
              <IconButton onClick={(e) => {
                e.stopPropagation();
                workout.id && handleDelete(workout.id);
              }}><FaTrash /></IconButton>
            </ButtonGroup>
          </WorkoutItem>
        ))
      )}
    </WorkoutListContainer>
  );

  return (
    <Routes>
      <Route path="/" element={<WorkoutsList />} />
      <Route path="create" element={<WorkoutForm />} />
      <Route path="edit/:id" element={<WorkoutForm />} />
    </Routes>
  );
};

export default Workouts;