// src/components/WorkoutList.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { getWorkouts, Workout, deleteWorkout } from '../services/workoutService';
import { FaEdit, FaTrash } from 'react-icons/fa';

const WorkoutListContainer = styled.div`
  background-color: ${props => props.theme.colors.background};
  padding: 2rem;
  border-radius: 8px;
  max-width: 800px;
  margin: 2rem auto;
`;

const WorkoutItem = styled.div`
  background-color: ${props => props.theme.colors.card};
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const WorkoutInfo = styled.div`
  flex-grow: 1;
`;

const WorkoutName = styled.h3`
  margin: 0 0 0.5rem 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.primary};

  &:hover {
    color: ${props => props.theme.colors.secondary};
  }
`;

const CreateWorkoutButton = styled(Link)`
  display: inline-block;
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  margin-top: 1rem;

  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
`;

const WorkoutList: React.FC = () => {
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
      console.error('Error fetching workouts:', err);
      setError('Failed to load workouts. Please try again.');
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await deleteWorkout(id);
        setWorkouts(workouts.filter(workout => workout.id !== id));
      } catch (err) {
        console.error('Error deleting workout:', err);
        setError('Failed to delete workout. Please try again.');
      }
    }
  };

  if (loading) {
    return <WorkoutListContainer>Loading workouts...</WorkoutListContainer>;
  }

  if (error) {
    return <WorkoutListContainer>{error}</WorkoutListContainer>;
  }

  return (
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
              <Link to={`/edit-workout/${workout.id}`}>
                <IconButton><FaEdit /></IconButton>
              </Link>
              <IconButton onClick={() => workout.id && handleDelete(workout.id)}>
                <FaTrash />
              </IconButton>
            </ButtonGroup>
          </WorkoutItem>
        ))
      )}
      <CreateWorkoutButton to="/create-workout">Create New Workout</CreateWorkoutButton>
    </WorkoutListContainer>
  );
};

export default WorkoutList;