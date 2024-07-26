// src/components/EquipmentForm.tsx
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { saveEquipment, getEquipmentById, updateEquipment, Equipment } from '../services/equipmentService';
import { uploadImage } from '../services/storageService';
import ImageCropper, { ImageCropperRef } from './ImageCropper';
import LoadingOverlay from './LoadingOverlay';
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

const EquipmentForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState<Equipment>({ name: '', description: '', imageUrl: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<ImageCropperRef>(null);

  useEffect(() => {
    if (id) {
      fetchEquipment(id);
    }
  }, [id]);

  const fetchEquipment = async (equipmentId: string) => {
    setIsLoading(true);
    try {
      const fetchedEquipment = await getEquipmentById(equipmentId);
      setEquipment(fetchedEquipment);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      setErrors({ fetch: 'Failed to fetch equipment data' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEquipment({ ...equipment, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!equipment.name.trim()) newErrors.name = 'Name is required';
    if (!equipment.description.trim()) newErrors.description = 'Description is required';
    if (!imageFile && !equipment.imageUrl) newErrors.image = 'Image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setErrors({});
      try {
        let imageUrl = equipment.imageUrl;
        if (imageFile && cropperRef.current) {
          const croppedImageBlob = await cropperRef.current.cropImage();
          imageUrl = await uploadImage(croppedImageBlob, `equipment/${Date.now()}.png`);
        }

        const equipmentData = { ...equipment, imageUrl };

        if (id) {
          await updateEquipment(equipmentData);
        } else {
          await saveEquipment(equipmentData);
        }

        alert('Equipment saved successfully');
        navigate('/equipment');
      } catch (error) {
        console.error('Error saving equipment:', error);
        setErrors({ submit: 'Failed to save equipment. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    navigate('/equipment');
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <FormContainer onSubmit={handleSubmit}>
      <BackButton type="button" onClick={handleBack}>
        <FaArrowLeft /> Back to List
      </BackButton>
      <h2>{id ? 'Edit Equipment' : 'Add New Equipment'}</h2>
      <Input
        type="text"
        name="name"
        placeholder="Equipment Name"
        value={equipment.name}
        onChange={handleInputChange}
        required
      />
      {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
      <TextArea
        name="description"
        placeholder="Description"
        value={equipment.description}
        onChange={handleInputChange}
        required
      />
      {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
      {equipment.imageUrl && (
        <ImagePreview src={equipment.imageUrl} alt="Current equipment image" />
      )}
      <Input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
      />
      {errors.image && <ErrorMessage>{errors.image}</ErrorMessage>}
      {imageFile && (
        <ImageCropper
          imageFile={imageFile}
          onCrop={() => { }}
          ref={cropperRef}
        />
      )}
      {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Equipment'}
      </Button>
    </FormContainer>
  );
};

export default EquipmentForm;