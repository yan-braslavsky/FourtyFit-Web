// src/components/WorkoutForm.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkout, saveWorkout, Workout } from '../services/workoutService';
import { getExercises, Exercise } from '../services/exerciseService';

const FormContainer = styled.form`
  background-color: ${props => props.theme.colors.background};
  padding: 2rem;
  border-radius: 8px;
  max-width: 600px;
  margin: 2rem auto;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  margin-right: 0.5rem;
`;

const ExerciseGroup = styled.div`
  border: 1px solid ${props => props.theme.colors.primary};
  padding: 1rem;
  margin-bottom: 1rem;
`;

interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: number;
  weight: number;
}

interface ExerciseGroupType {
  exercises: WorkoutExercise[];
  sets: number;
}

const WorkoutForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<Workout>({ name: '', exerciseGroups: [] });
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentGroup, setCurrentGroup] = useState<ExerciseGroupType>({ exercises: [], sets: 1 });

  useEffect(() => {
    const fetchData = async () => {
      const fetchedExercises = await getExercises();
      setExercises(fetchedExercises);

      if (id) {
        const fetchedWorkout = await getWorkout(id);
        setWorkout(fetchedWorkout);
      }
    };
    fetchData();
  }, [id]);

  const handleAddExercise = () => {
    setCurrentGroup(prevGroup => ({
      ...prevGroup,
      exercises: [
        ...prevGroup.exercises,
        { exerciseId: '', sets: 1, reps: 0, weight: 0 }
      ]
    }));
  };

  const handleExerciseChange = (index: number, field: keyof WorkoutExercise, value: string | number) => {
    setCurrentGroup(prevGroup => ({
      ...prevGroup,
      exercises: prevGroup.exercises.map((exercise, i) =>
        i === index ? { ...exercise, [field]: value } : exercise
      )
    }));
  };

  const handleAddGroup = () => {
    setWorkout(prevWorkout => ({
      ...prevWorkout,
      exerciseGroups: [...prevWorkout.exerciseGroups, currentGroup]
    }));
    setCurrentGroup({ exercises: [], sets: 1 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveWorkout(workout);
      alert('Workout saved successfully');
      navigate('/');
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('Failed to save workout');
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <h2>{id ? 'Edit Workout' : 'Create Workout'}</h2>
      <Input
        type="text"
        placeholder="Workout Name"
        value={workout.name}
        onChange={e => setWorkout({ ...workout, name: e.target.value })}
        required
      />

      <h3>Current Exercise Group</h3>
      <Input
        type="number"
        placeholder="Number of Sets"
        value={currentGroup.sets}
        onChange={e => setCurrentGroup({ ...currentGroup, sets: parseInt(e.target.value) })}
        min="1"
      />
      {currentGroup.exercises.map((exercise, index) => (
        <ExerciseGroup key={index}>
          <Select
            value={exercise.exerciseId}
            onChange={e => handleExerciseChange(index, 'exerciseId', e.target.value)}
            required
          >
            <option value="">Select an exercise</option>
            {exercises.map(ex => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </Select>
          <Input
            type="number"
            placeholder="Reps"
            value={exercise.reps}
            onChange={e => handleExerciseChange(index, 'reps', parseInt(e.target.value))}
            min="0"
          />
          <Input
            type="number"
            placeholder="Weight (kg)"
            value={exercise.weight}
            onChange={e => handleExerciseChange(index, 'weight', parseFloat(e.target.value))}
            min="0"
            step="0.1"
          />
        </ExerciseGroup>
      ))}
      <Button type="button" onClick={handleAddExercise}>
        Add Exercise to Group
      </Button>
      <Button type="button" onClick={handleAddGroup}>
        Add Group to Workout
      </Button>

      <h3>Workout Exercise Groups</h3>
      {workout.exerciseGroups.map((group, groupIndex) => (
        <ExerciseGroup key={groupIndex}>
          <h4>Group {groupIndex + 1} - {group.sets} sets</h4>
          {group.exercises.map((exercise, exerciseIndex) => {
            const selectedExercise = exercises.find(ex => ex.id === exercise.exerciseId);
            return (
              <div key={exerciseIndex}>
                <p>{selectedExercise?.name}: {exercise.reps} reps, {exercise.weight} kg</p>
              </div>
            );
          })}
        </ExerciseGroup>
      ))}

      <Button type="submit">Save Workout</Button>
    </FormContainer>
  );
};

export default WorkoutForm;