// src/components/EquipmentForm.tsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { saveEquipment, checkEquipmentExists } from '../services/equipmentService';
import { uploadImage } from '../services/storageService';
import ImageCropper, { ImageCropperRef } from './ImageCropper';
import LoadingOverlay from './LoadingOverlay';
import { FaCheck, FaTimes } from 'react-icons/fa';

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
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 1rem;
`;

const NameInputWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const NameInput = styled(Input)`
  margin-bottom: 0;
  flex-grow: 1;
`;

const ValidationIcon = styled.span`
  display: flex;
  align-items: center;
  margin-left: 0.5rem;
`;

interface Equipment {
  name: string;
  description: string;
  imageUrl: string;
}

const EquipmentForm: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment>({ name: '', description: '', imageUrl: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNameValid, setIsNameValid] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<ImageCropperRef>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEquipment({ ...equipment, [name]: value });
    setErrors({ ...errors, [name]: '' });

    if (name === 'name') {
      setIsNameValid(null);
    }
  };

  const validateName = useCallback(async (name: string) => {
    if (name.trim() === '') {
      setIsNameValid(null);
      return;
    }

    const exists = await checkEquipmentExists(name);
    setIsNameValid(!exists);
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      validateName(equipment.name);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [equipment.name, validateName]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleCrop = (croppedImageBlob: Blob) => {
    setErrors({ ...errors, image: '' });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!equipment.name.trim()) newErrors.name = 'Name is required';
    if (!equipment.description.trim()) newErrors.description = 'Description is required';
    if (!imageFile) newErrors.image = 'Image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && isNameValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        let croppedImageBlob: Blob | null = null;
        if (cropperRef.current) {
          croppedImageBlob = await cropperRef.current.cropImage();
        }
        
        let imageUrl = '';
        if (croppedImageBlob) {
          imageUrl = await uploadImage(croppedImageBlob, `equipment/${Date.now()}.png`);
        }
        await saveEquipment({ ...equipment, imageUrl });
        alert('Equipment saved successfully');
        setEquipment({ name: '', description: '', imageUrl: '' });
        setImageFile(null);
        setIsNameValid(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (error) {
        console.error('Error saving equipment:', error);
        alert(`Failed to save equipment: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <h2>Add New Equipment</h2>
      <NameInputWrapper>
        <NameInput
          type="text"
          name="name"
          placeholder="Equipment Name"
          value={equipment.name}
          onChange={handleInputChange}
          required
        />
        <ValidationIcon>
          {isNameValid === true && <FaCheck color="green" size={20} />}
          {isNameValid === false && <FaTimes color="red" size={20} />}
        </ValidationIcon>
      </NameInputWrapper>
      {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
      <TextArea
        name="description"
        placeholder="Description"
        value={equipment.description}
        onChange={handleInputChange}
        required
      />
      {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
      <Input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
        required
      />
      {errors.image && <ErrorMessage>{errors.image}</ErrorMessage>}
      {imageFile && (
        <ImageCropper
          imageFile={imageFile}
          onCrop={handleCrop}
          ref={cropperRef}
        />
      )}
      <Button type="submit" disabled={isLoading || isNameValid === false}>Save Equipment</Button>
      {isLoading && <LoadingOverlay />}
    </FormContainer>
  );
};

export default EquipmentForm;