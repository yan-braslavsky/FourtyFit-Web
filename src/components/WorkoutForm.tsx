// src/components/WorkoutForm.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkout, saveWorkout, Workout } from '../services/workoutService';

const FormContainer = styled.form`
  background-color: ${props => props.theme.colors.background};
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  margin-bottom: 1rem;
  padding: 0.5rem;
  width: 100%;
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: ${props => props.theme.colors.primary};
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 1rem;
`;

const WorkoutForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<Workout>({ name: '', exercises: [] });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchWorkout = async () => {
        try {
          const fetchedWorkout = await getWorkout(id);
          setWorkout(fetchedWorkout);
        } catch (err) {
          console.error("Error fetching workout:", err);
          setError("Failed to load workout. Please try again.");
        }
      };
      fetchWorkout();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await saveWorkout(workout);
      console.log("Workout saved successfully");
      navigate('/'); // Redirect to workout list after successful save
    } catch (err) {
      console.error("Error saving workout:", err);
      setError("Failed to save workout. Please try again.");
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <h2>{id ? 'Edit Workout' : 'Create Workout'}</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Input
        type="text"
        value={workout.name}
        onChange={e => setWorkout({ ...workout, name: e.target.value })}
        placeholder="Workout Name"
        required
      />
      {/* Add exercise form components here */}
      <Button type="submit">Save Workout</Button>
    </FormContainer>
  );
};

export default WorkoutForm;