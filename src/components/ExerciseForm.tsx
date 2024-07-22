// src/components/ExerciseForm.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { saveExercise, getExercise, Exercise } from '../services/exerciseService';
import { getEquipment, Equipment } from '../services/equipmentService';

const FormContainer = styled.form`
  background-color: ${props => props.theme.colors.background};
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  margin: 2rem auto;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
`;

const TextArea = styled.textarea`
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
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 1rem;
`;

const ExerciseForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState<Exercise>({
    name: '',
    description: '',
    imageUrl: '',
    equipmentIds: [],
  });
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedEquipment = await getEquipment();
        setEquipment(fetchedEquipment);

        if (id) {
          const fetchedExercise = await getExercise(id);
          setExercise(fetchedExercise);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await saveExercise(exercise);
      alert('Exercise saved successfully');
      navigate('/exercises');
    } catch (err) {
      console.error('Error saving exercise:', err);
      setError('Failed to save exercise. Please try again.');
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <h2>{id ? 'Edit Exercise' : 'Create Exercise'}</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Input
        type="text"
        placeholder="Exercise Name"
        value={exercise.name}
        onChange={e => setExercise({ ...exercise, name: e.target.value })}
        required
      />
      <TextArea
        placeholder="Description"
        value={exercise.description}
        onChange={e => setExercise({ ...exercise, description: e.target.value })}
        required
      />
      <Input
        type="url"
        placeholder="Image URL"
        value={exercise.imageUrl}
        onChange={e => setExercise({ ...exercise, imageUrl: e.target.value })}
        required
      />
      <Select
        multiple
        value={exercise.equipmentIds}
        onChange={e => setExercise({ ...exercise, equipmentIds: Array.from(e.target.selectedOptions, option => option.value) })}
      >
        {equipment.map(item => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </Select>
      <Button type="submit">Save Exercise</Button>
    </FormContainer>
  );
};

export default ExerciseForm;