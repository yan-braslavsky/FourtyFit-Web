// src/components/WorkoutList.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { getWorkouts, Workout } from '../services/workoutService';

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
`;

const WorkoutLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

const NoWorkoutsMessage = styled.p`
  text-align: center;
  font-style: italic;
  color: ${props => props.theme.colors.textSecondary};
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
    fetchWorkouts();
  }, []);

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
        <div>
          <NoWorkoutsMessage>No workouts saved yet. Create your first workout!</NoWorkoutsMessage>
          <CreateWorkoutButton to="/create-workout">Create Workout</CreateWorkoutButton>
        </div>
      ) : (
        workouts.map(workout => (
          <WorkoutItem key={workout.id}>
            <h3>{workout.name}</h3>
            <p>Number of exercise groups: {workout.exerciseGroups.length}</p>
            <WorkoutLink to={`/edit-workout/${workout.id}`}>Edit Workout</WorkoutLink>
          </WorkoutItem>
        ))
      )}
      {workouts.length > 0 && (
        <CreateWorkoutButton to="/create-workout">Create New Workout</CreateWorkoutButton>
      )}
    </WorkoutListContainer>
  );
};

export default WorkoutList;