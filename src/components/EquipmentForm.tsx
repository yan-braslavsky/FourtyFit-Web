// src/components/EquipmentForm.tsx
import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { saveEquipment } from '../services/equipmentService';
import { uploadImage } from '../services/storageService';
import ImageCropper from './ImageCropper';

const FormContainer = styled.form`
  background-color: ${props => props.theme.colors.card};
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
  color: ${props => props.theme.colors.textLight};
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  margin-right: 0.5rem;
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 1rem;
`;

interface Equipment {
  name: string;
  description: string;
  imageUrl: string;
}

const EquipmentForm: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment>({
    name: '',
    description: '',
    imageUrl: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleCrop = (croppedImageBlob: Blob) => {
    setCroppedImage(croppedImageBlob);
    setErrors({ ...errors, image: '' });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!equipment.name.trim()) newErrors.name = 'Name is required';
    if (!equipment.description.trim()) newErrors.description = 'Description is required';
    if (!croppedImage) newErrors.image = 'Image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        let imageUrl = '';
        if (croppedImage) {
          imageUrl = await uploadImage(croppedImage, `equipment/${Date.now()}.png`);
        }
        await saveEquipment({ ...equipment, imageUrl });
        alert('Equipment saved successfully');
        setEquipment({ name: '', description: '', imageUrl: '' });
        setCroppedImage(null);
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (error) {
        console.error('Error saving equipment:', error);
        if (error instanceof Error) {
          alert(`Failed to save equipment: ${error.message}`);
        } else {
          alert('Failed to save equipment: Unknown error');
        }
      }
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <h2>Add New Equipment</h2>
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
          onCrop={handleCrop}
        />
      )}
      <Button type="submit">Save Equipment</Button>
    </FormContainer>
  );
};

export default EquipmentForm;