// src/components/EquipmentList.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { getEquipment, deleteEquipment, Equipment } from '../services/equipmentService';
import LoadingOverlay from './LoadingOverlay';
import { FaEdit, FaTrash } from 'react-icons/fa';

const EquipmentListContainer = styled.div`
  background-color: ${props => props.theme.colors.background};
  padding: 2rem;
  border-radius: 8px;
  max-width: 800px;
  margin: 2rem auto;
`;

const EquipmentItem = styled.div`
  background-color: ${props => props.theme.colors.card};
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
`;

const EquipmentImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 1rem;
`;

const EquipmentInfo = styled.div`
  flex-grow: 1;
`;

const EquipmentName = styled.h3`
  margin: 0 0 0.5rem 0;
`;

const EquipmentDescription = styled.p`
  margin: 0;
  color: ${props => props.theme.colors.textSecondary};
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

const AddEquipmentButton = styled(Link)`
  display: inline-block;
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  margin-top: 1rem;

  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 1rem;
`;

const EquipmentList: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedEquipment = await getEquipment();
      setEquipment(fetchedEquipment);
    } catch (err) {
      console.error('Error fetching equipment:', err);
      setError('Failed to load equipment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      setIsLoading(true);
      try {
        await deleteEquipment(id);
        setEquipment(equipment.filter(item => item.id !== id));
      } catch (err) {
        console.error('Error deleting equipment:', err);
        setError('Failed to delete equipment. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/edit-equipment/${id}`);
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <EquipmentListContainer>
      <h2>Equipment</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {equipment.map(item => (
        <EquipmentItem key={item.id}>
          <EquipmentImage src={item.imageUrl} alt={item.name} />
          <EquipmentInfo>
            <EquipmentName>{item.name}</EquipmentName>
            <EquipmentDescription>{item.description}</EquipmentDescription>
          </EquipmentInfo>
          <ButtonGroup>
            <IconButton onClick={() => item.id && handleEdit(item.id)}>
              <FaEdit />
            </IconButton>
            <IconButton onClick={() => item.id && handleDelete(item.id)}>
              <FaTrash />
            </IconButton>
          </ButtonGroup>
        </EquipmentItem>
      ))}
      <AddEquipmentButton to="/add-equipment">Add New Equipment</AddEquipmentButton>
    </EquipmentListContainer>
  );
};

export default EquipmentList;