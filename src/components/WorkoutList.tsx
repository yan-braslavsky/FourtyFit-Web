// src/components/WorkoutList.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { getWorkouts } from '../services/workoutService';
import { Workout } from '../services/workoutService';

const WorkoutListContainer = styled.div`
  background-color: ${props => props.theme.colors.background};
  padding: 1rem;
`;

const WorkoutItem = styled.div`
  background-color: ${props => props.theme.colors.card};
  margin-bottom: 1rem;
  padding: 1rem;
`;

const WorkoutList: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const fetchedWorkouts = await getWorkouts();
      setWorkouts(fetchedWorkouts);
    };
    fetchWorkouts();
  }, []);

  return (
    <WorkoutListContainer>
      <h2>Workouts</h2>
      {workouts.map(workout => (
        <WorkoutItem key={workout.id}>
          <h3>{workout.name}</h3>
          <Link to={`/edit/${workout.id}`}>Edit</Link>
        </WorkoutItem>
      ))}
    </WorkoutListContainer>
  );
};

export default WorkoutList;