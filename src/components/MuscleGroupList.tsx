// src/components/MuscleGroupList.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { getMuscleGroups, deleteMuscleGroup, MuscleGroup } from "../services/muscleGroupService";
import LoadingOverlay from "./LoadingOverlay";
import { FaEdit, FaTrash, FaSync } from "react-icons/fa";

const MuscleGroupListContainer = styled.div`
  background-color: ${props => props.theme.colors.background};
  padding: 2rem;
  border-radius: 8px;
  max-width: 800px;
  margin: 2rem auto;
`;

const MuscleGroupItem = styled.div`
  background-color: ${props => props.theme.colors.card};
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
`;

const MuscleGroupImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 1rem;
`;

const MuscleGroupInfo = styled.div`
  flex-grow: 1;
`;

const MuscleGroupName = styled.h3`
  margin: 0 0 0.5rem 0;
`;

const MuscleGroupDescription = styled.p`
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

const AddMuscleGroupButton = styled(Link)`
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

const ResetButton = styled.button`
  background-color: ${props => props.theme.colors.warning};
  color: ${props => props.theme.colors.text};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  &:hover {
    background-color: ${props => props.theme.colors.warningHover};
  }

  svg {
    margin-right: 0.5rem;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 1rem;
`;

const MuscleGroupList: React.FC = () => {
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMuscleGroups();
  }, []);

  const fetchMuscleGroups = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedMuscleGroups = await getMuscleGroups();
      setMuscleGroups(fetchedMuscleGroups);
    } catch (err) {
      console.error("Error fetching muscle groups:", err);
      setError("Failed to load muscle groups. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this muscle group?")) {
      setIsLoading(true);
      try {
        await deleteMuscleGroup(id);
        setMuscleGroups(muscleGroups.filter(group => group.id !== id));
      } catch (err) {
        console.error("Error deleting muscle group:", err);
        setError("Failed to delete muscle group. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/edit-muscle-group/${id}`);
  };

  const handleReset = async () => {
    if (window.confirm("Are you sure you want to reset all muscle groups? This action cannot be undone.")) {
      setIsLoading(true);
      try {
        const response = await fetch("https://us-central1-fourtyfit-44a5b.cloudfunctions.net/resetMuscleGroups", {
          method: "POST",
        });
        
        if (!response.ok) {
          throw new Error("Failed to reset muscle groups");
        }
        
        const result = await response.json();
        console.log(result.message);
        
        await fetchMuscleGroups(); // Refresh the list after reset
      } catch (err) {
        console.error("Error resetting muscle groups:", err);
        setError("Failed to reset muscle groups. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <MuscleGroupListContainer>
      <h2>Muscle Groups</h2>
      <AddMuscleGroupButton to="/add-muscle-group">Add New Muscle Group</AddMuscleGroupButton>
      <ResetButton onClick={handleReset}>
        <FaSync /> Reset Muscle Groups
      </ResetButton>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {muscleGroups.map(group => (
        <MuscleGroupItem key={group.id}>
          <MuscleGroupImage src={group.imageUrl || 'placeholder-image-url.jpg'} alt={group.name} />
          <MuscleGroupInfo>
            <MuscleGroupName>{group.name}</MuscleGroupName>
            <MuscleGroupDescription>
              {group.muscles && group.muscles.length > 0 
                ? group.muscles.map(muscle => muscle.name).join(", ")
                : "No muscles defined"}
            </MuscleGroupDescription>
          </MuscleGroupInfo>
          <ButtonGroup>
            <IconButton onClick={() => group.id && handleEdit(group.id)}>
              <FaEdit />
            </IconButton>
            <IconButton onClick={() => group.id && handleDelete(group.id)}>
              <FaTrash />
            </IconButton>
          </ButtonGroup>
        </MuscleGroupItem>
      ))}

    </MuscleGroupListContainer>
  );
};

export default MuscleGroupList;