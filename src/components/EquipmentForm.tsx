// src/components/EquipmentForm.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { saveEquipment } from '../services/equipmentService';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveEquipment(equipment);
      alert('Equipment saved successfully');
      setEquipment({ name: '', description: '', imageUrl: '' });
    } catch (error) {
      console.error('Error saving equipment:', error);
      alert('Failed to save equipment');
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <h2>Add New Equipment</h2>
      <Input
        type="text"
        placeholder="Equipment Name"
        value={equipment.name}
        onChange={e => setEquipment({ ...equipment, name: e.target.value })}
        required
      />
      <TextArea
        placeholder="Description"
        value={equipment.description}
        onChange={e => setEquipment({ ...equipment, description: e.target.value })}
        required
      />
      <Input
        type="url"
        placeholder="Image URL"
        value={equipment.imageUrl}
        onChange={e => setEquipment({ ...equipment, imageUrl: e.target.value })}
        required
      />
      <Button type="submit">Save Equipment</Button>
    </FormContainer>
  );
};

export default EquipmentForm;