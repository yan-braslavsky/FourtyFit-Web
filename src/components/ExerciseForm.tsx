// src/components/ExerciseForm.tsx
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { saveExercise, updateExercise, getExercise, Exercise } from '../services/exerciseService';
import { getEquipment, Equipment } from '../services/equipmentService';
import { uploadImage } from '../services/storageService';
import ImageCropper from './ImageCropper';
import { FaArrowLeft } from 'react-icons/fa';

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
  margin-right: 1rem;
`;

const BackButton = styled(Button)`
  background-color: ${props => props.theme.colors.secondary};
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 1rem;
`;

const ImagePreview = styled.img`
  width: 100%;
  max-width: 200px;
  height: auto;
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<any>(null);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setExercise({ ...exercise, [name]: value });
  };

  const handleEquipmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setExercise({ ...exercise, equipmentIds: selectedOptions });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      let imageUrl = exercise.imageUrl;

      if (imageFile && cropperRef.current) {
        const croppedImageBlob = await cropperRef.current.cropImage();
        imageUrl = await uploadImage(croppedImageBlob, `exercises/${Date.now()}.png`);
      }

      const exerciseData = { ...exercise, imageUrl };

      if (id) {
        // Update existing exercise
        setExercise(exerciseData);
        updateExercise(exerciseData).catch(error => {
          console.error('Error updating exercise:', error);
          setError('Failed to update exercise. Please try again.');
          setExercise(exercise);
        });
      } else {
        // Create new exercise
        const newExercise = await saveExercise(exerciseData);
        setExercise(newExercise);
      }

      navigate('/exercises');
    } catch (error) {
      console.error('Error saving exercise:', error);
      setError('Failed to save exercise. Please try again.');
    }
  };

  const handleBack = () => {
    navigate('/exercises');
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <BackButton type="button" onClick={handleBack}>
        <FaArrowLeft /> Back to List
      </BackButton>
      <h2>{id ? 'Edit Exercise' : 'Create Exercise'}</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Input
        type="text"
        name="name"
        placeholder="Exercise Name"
        value={exercise.name}
        onChange={handleInputChange}
        required
      />
      <TextArea
        name="description"
        placeholder="Description"
        value={exercise.description}
        onChange={handleInputChange}
        required
      />
      <Select
        multiple
        name="equipmentIds"
        value={exercise.equipmentIds}
        onChange={handleEquipmentChange}
      >
        {equipment.map(item => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </Select>
      {exercise.imageUrl && (
        <ImagePreview src={exercise.imageUrl} alt="Current exercise image" />
      )}
      <Input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
      />
      {imageFile && (
        <ImageCropper
          imageFile={imageFile}
          onCrop={() => {}}
          ref={cropperRef}
        />
      )}
      <Button type="submit">Save Exercise</Button>
    </FormContainer>
  );
};

export default ExerciseForm;