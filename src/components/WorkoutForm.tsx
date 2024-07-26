// src/components/WorkoutForm.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkout, saveWorkout, checkWorkoutExists, Workout, ExerciseGroup, WorkoutExercise } from '../services/workoutService';
import { getExercises, Exercise } from '../services/exerciseService';
import { FaArrowLeft, FaEdit, FaTrash } from 'react-icons/fa';

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

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
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
  margin-bottom: 0.5rem;
`;

const BackButton = styled(Button)`
  background-color: ${props => props.theme.colors.secondary};
`;

const ExerciseGroupContainer = styled.div`
  border: 1px solid ${props => props.theme.colors.primary};
  padding: 1rem;
  margin-bottom: 1rem;
`;

const GroupList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const GroupListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const GroupInfo = styled.span`
  flex-grow: 1;
  margin-right: 1rem; // Add space between text and buttons
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem; // Add space between buttons
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 1rem;
`;

enum FormStage {
  TITLE,
  GROUP,
  REVIEW
}

const WorkoutForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<Workout>({ name: '', exerciseGroups: [] });
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentGroup, setCurrentGroup] = useState<ExerciseGroup>({ exercises: [], sets: 1 });
  const [formStage, setFormStage] = useState<FormStage>(FormStage.TITLE);
  const [titleError, setTitleError] = useState<string>('');
  const [editingGroupIndex, setEditingGroupIndex] = useState<number | null>(null);

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

  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setWorkout({ ...workout, name: newTitle });

    if (newTitle.trim() !== '') {
      const exists = await checkWorkoutExists(newTitle);
      if (exists && newTitle !== workout.name) {
        setTitleError('A workout with this title already exists');
      } else {
        setTitleError('');
      }
    } else {
      setTitleError('');
    }
  };

  const handleAddExercise = () => {
    setCurrentGroup(prevGroup => ({
      ...prevGroup,
      exercises: [
        ...prevGroup.exercises,
        { exerciseId: '', reps: 0, weight: 0 }
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
    if (editingGroupIndex !== null) {
      setWorkout(prevWorkout => ({
        ...prevWorkout,
        exerciseGroups: prevWorkout.exerciseGroups.map((group, index) =>
          index === editingGroupIndex ? currentGroup : group
        )
      }));
      setEditingGroupIndex(null);
    } else {
      setWorkout(prevWorkout => ({
        ...prevWorkout,
        exerciseGroups: [...prevWorkout.exerciseGroups, currentGroup]
      }));
    }
    setCurrentGroup({ exercises: [], sets: 1 });
  };

  const handleEditGroup = (index: number) => {
    setCurrentGroup(workout.exerciseGroups[index]);
    setEditingGroupIndex(index);
    setFormStage(FormStage.GROUP);
  };

  const handleDeleteGroup = (index: number) => {
    setWorkout(prevWorkout => ({
      ...prevWorkout,
      exerciseGroups: prevWorkout.exerciseGroups.filter((_, i) => i !== index)
    }));
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

  const renderTitleStage = () => (
    <>
      <Label htmlFor="workoutTitle">Title</Label>
      <Input
        id="workoutTitle"
        type="text"
        placeholder="Workout Title"
        value={workout.name}
        onChange={handleTitleChange}
        required
      />
      {titleError && <ErrorMessage>{titleError}</ErrorMessage>}
      <Button type="button" onClick={() => setFormStage(FormStage.GROUP)} disabled={!workout.name || !!titleError}>
        Next
      </Button>
    </>
  );

  const renderGroupStage = () => (
    <>
      <BackButton type="button" onClick={() => setFormStage(FormStage.TITLE)}>
        <FaArrowLeft /> Back
      </BackButton>
      <h3>Exercise Group {editingGroupIndex !== null ? editingGroupIndex + 1 : workout.exerciseGroups.length + 1}</h3>

      <Label htmlFor="groupSets">Number of Sets</Label>
      <Select
        id="groupSets"
        value={currentGroup.sets}
        onChange={(e) => setCurrentGroup({ ...currentGroup, sets: parseInt(e.target.value) })}
      >
        {[1, 2, 3, 4, 5].map(num => (
          <option key={num} value={num}>{num}</option>
        ))}
      </Select>

      {currentGroup.exercises.map((exercise, index) => (
        <ExerciseGroupContainer key={index}>
          <Label htmlFor={`exercise-${index}`}>Exercise</Label>
          <Select
            id={`exercise-${index}`}
            value={exercise.exerciseId}
            onChange={(e) => handleExerciseChange(index, 'exerciseId', e.target.value)}
            required
          >
            <option value="">Select an exercise</option>
            {exercises.map(ex => (
              <option key={ex.id} value={ex.id}>{ex.name}</option>
            ))}
          </Select>

          <Label htmlFor={`weight-${index}`}>Weight (kg)</Label>
          <Input
            id={`weight-${index}`}
            type="number"
            value={exercise.weight}
            onChange={(e) => handleExerciseChange(index, 'weight', parseFloat(e.target.value))}
            min="0"
            step="0.1"
            required
          />

          <Label htmlFor={`reps-${index}`}>Reps</Label>
          <Input
            id={`reps-${index}`}
            type="number"
            value={exercise.reps}
            onChange={(e) => handleExerciseChange(index, 'reps', parseInt(e.target.value))}
            min="0"
            required
          />
        </ExerciseGroupContainer>
      ))}

      <Button type="button" onClick={handleAddExercise}>
        Add Another Exercise to Group
      </Button>

      {currentGroup.exercises.length > 0 && (
        <Button type="button" onClick={handleAddGroup}>
          {editingGroupIndex !== null ? 'Update Group' : 'Add Group to Workout'}
        </Button>
      )}

      {workout.exerciseGroups.length > 0 && (
        <>
          <h3>Current Groups</h3>
          <GroupList>
            {workout.exerciseGroups.map((group, index) => (
              <GroupListItem key={index}>
                <GroupInfo>Group {index + 1} - {group.sets} sets, {group.exercises.length} exercises</GroupInfo>
                <ButtonGroup>
                  <Button onClick={() => handleEditGroup(index)}><FaEdit /></Button>
                  <Button onClick={() => handleDeleteGroup(index)}><FaTrash /></Button>
                </ButtonGroup>
              </GroupListItem>
            ))}
          </GroupList>
        </>
      )}

      {workout.exerciseGroups.length > 0 && (
        <Button type="button" onClick={() => setFormStage(FormStage.REVIEW)}>
          Review Workout
        </Button>
      )}
    </>
  );

  const renderReviewStage = () => (
    <>
      <BackButton type="button" onClick={() => setFormStage(FormStage.GROUP)}>
        <FaArrowLeft /> Back
      </BackButton>
      <h3>Review Workout</h3>
      <GroupList>
        {workout.exerciseGroups.map((group, groupIndex) => (
          <GroupListItem key={groupIndex}>
            <GroupInfo>Group {groupIndex + 1} - {group.sets} sets, {group.exercises.length} exercises</GroupInfo>
            <ButtonGroup>
              <Button onClick={() => handleEditGroup(groupIndex)}><FaEdit /></Button>
              <Button onClick={() => handleDeleteGroup(groupIndex)}><FaTrash /></Button>
            </ButtonGroup>
          </GroupListItem>
        ))}
      </GroupList>
      <Button type="button" onClick={() => setFormStage(FormStage.GROUP)}>
        Add Another Group
      </Button>
      <Button type="submit">Save Workout</Button>
    </>
  );

  return (
    <FormContainer onSubmit={handleSubmit}>
      <h2>{id ? 'Edit Workout' : 'Create Workout'}</h2>
      {formStage === FormStage.TITLE && renderTitleStage()}
      {formStage === FormStage.GROUP && renderGroupStage()}
      {formStage === FormStage.REVIEW && renderReviewStage()}
    </FormContainer>
  );
};

export default WorkoutForm;