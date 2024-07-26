// src/components/ExerciseList.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { getExercises, deleteExercise, Exercise } from '../services/exerciseService';
import { getEquipment, Equipment } from '../services/equipmentService';
import LoadingOverlay from './LoadingOverlay';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const ExerciseListContainer = styled.div`
  background-color: ${props => props.theme.colors.background};
  padding: 2rem;
  border-radius: 8px;
  max-width: 800px;
  margin: 2rem auto;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.colors.card};
  border-radius: 20px;
  padding: 0.5rem 1rem;
  width: 100%;
  max-width: 300px;
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  margin-left: 0.5rem;
  flex-grow: 1;
  font-size: 1rem;
  &:focus {
    outline: none;
  }
`;

const ExerciseItem = styled.div`
  background-color: ${props => props.theme.colors.card};
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
`;

const ExerciseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ExerciseImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 1rem;
`;

const ExerciseDetails = styled.div`
  flex-grow: 1;
`;

const ExerciseName = styled.h3`
  margin: 0 0 0.5rem 0;
`;

const ExerciseDescription = styled.p`
  margin: 0 0 0.5rem 0;
  color: ${props => props.theme.colors.textSecondary};
`;

const EquipmentList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0 0 0.5rem 0;
`;

const EquipmentItem = styled.li`
  display: inline-block;
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  padding: 0.2rem 0.5rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
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

const AddExerciseButton = styled(Link)`
  display: inline-block;
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;

  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 1rem;
`;

const ExerciseList: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchExercisesAndEquipment();
  }, []);

  const fetchExercisesAndEquipment = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedExercises, fetchedEquipment] = await Promise.all([
        getExercises(),
        getEquipment()
      ]);
      setExercises(fetchedExercises);
      setEquipment(fetchedEquipment);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load exercises and equipment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      setIsLoading(true);
      try {
        await deleteExercise(id);
        setExercises(exercises.filter(exercise => exercise.id !== id));
      } catch (err) {
        console.error('Error deleting exercise:', err);
        setError('Failed to delete exercise. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/edit-exercise/${id}`);
  };

  const getEquipmentNames = (equipmentIds: string[]): string[] => {
    return equipmentIds.map(id => {
      const eq = equipment.find(e => e.id === id);
      return eq ? eq.name : 'Unknown Equipment';
    });
  };

  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getEquipmentNames(exercise.equipmentIds).some(name => 
      name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <ExerciseListContainer>
      <TopBar>
        <SearchBar>
          <FaSearch />
          <SearchInput
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>
        <AddExerciseButton to="/add-exercise">Add New Exercise</AddExerciseButton>
      </TopBar>
      
      <h2>Exercises</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {filteredExercises.map(exercise => (
        <ExerciseItem key={exercise.id}>
          <ExerciseHeader>
            <ExerciseImage src={exercise.imageUrl} alt={exercise.name} />
            <ExerciseDetails>
              <ExerciseName>{exercise.name}</ExerciseName>
              <ExerciseDescription>{exercise.description}</ExerciseDescription>
              <EquipmentList>
                {getEquipmentNames(exercise.equipmentIds).map((name, index) => (
                  <EquipmentItem key={index}>{name}</EquipmentItem>
                ))}
              </EquipmentList>
            </ExerciseDetails>
            <ButtonGroup>
              <IconButton onClick={() => exercise.id && handleEdit(exercise.id)}>
                <FaEdit />
              </IconButton>
              <IconButton onClick={() => exercise.id && handleDelete(exercise.id)}>
                <FaTrash />
              </IconButton>
            </ButtonGroup>
          </ExerciseHeader>
        </ExerciseItem>
      ))}
    </ExerciseListContainer>
  );
};

export default ExerciseList;