// src/components/MuscleGroupForm.tsx
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { saveMuscleGroup, updateMuscleGroup, getMuscleGroup, MuscleGroup, Muscle } from "../services/muscleGroupService";
import { uploadImage } from "../services/storageService";
import ImageCropper, { ImageCropperRef } from "./ImageCropper";
import LoadingOverlay from "./LoadingOverlay";
import { FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa";
import { v4 as uuidv4 } from 'uuid';

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

const MuscleContainer = styled.div`
  border: 1px solid ${props => props.theme.colors.primary};
  padding: 1rem;
  margin-bottom: 1rem;
`;

interface ExtendedMuscle extends Muscle {
  imageFile?: File;
}

interface ExtendedMuscleGroup extends MuscleGroup {
  muscles: ExtendedMuscle[];
  imageFile?: File;
}

const MuscleGroupForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [muscleGroup, setMuscleGroup] = useState<ExtendedMuscleGroup>({ 
    name: "", 
    muscles: [],
    imageUrl: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const cropperRefs = useRef<(ImageCropperRef | null)[]>([]);

  useEffect(() => {
    if (id) {
      fetchMuscleGroup(id);
    }
  }, [id]);

  const fetchMuscleGroup = async (muscleGroupId: string) => {
    setIsLoading(true);
    try {
      const fetchedMuscleGroup = await getMuscleGroup(muscleGroupId);
      setMuscleGroup(fetchedMuscleGroup as ExtendedMuscleGroup);
    } catch (error) {
      console.error("Error fetching muscle group:", error);
      setError("Failed to fetch muscle group data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMuscleGroup({ ...muscleGroup, [name]: value });
  };

  const handleMuscleChange = (index: number, field: keyof Muscle, value: string) => {
    const updatedMuscles = [...muscleGroup.muscles];
    updatedMuscles[index] = { ...updatedMuscles[index], [field]: value };
    setMuscleGroup({ ...muscleGroup, muscles: updatedMuscles });
  };

  const handleAddMuscle = () => {
    setMuscleGroup({
      ...muscleGroup,
      muscles: [...muscleGroup.muscles, { id: uuidv4(), name: "", imageUrl: "", description: "" }],
    });
  };

  const handleRemoveMuscle = (index: number) => {
    const updatedMuscles = muscleGroup.muscles.filter((_, i) => i !== index);
    setMuscleGroup({ ...muscleGroup, muscles: updatedMuscles });
  };

  const handleImageUpload = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedMuscles = [...muscleGroup.muscles];
        updatedMuscles[index] = { 
          ...updatedMuscles[index], 
          imageUrl: reader.result as string, 
          imageFile: file 
        };
        setMuscleGroup({ ...muscleGroup, muscles: updatedMuscles });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let updatedImageUrl = muscleGroup.imageUrl;
      if (muscleGroup.imageFile) {
        const croppedImageBlob = await cropperRefs.current[0]!.cropImage();
        updatedImageUrl = await uploadImage(croppedImageBlob, `muscleGroups/${Date.now()}_main.png`);
      }

      const updatedMuscles = await Promise.all(
        muscleGroup.muscles.map(async (muscle, index) => {
          if (muscle.imageFile) {
            const croppedImageBlob = await cropperRefs.current[index + 1]!.cropImage();
            const imageUrl = await uploadImage(croppedImageBlob, `muscleGroups/${Date.now()}_${index}.png`);
            return { ...muscle, imageUrl, imageFile: undefined };
          }
          return muscle;
        })
      );

      const updatedMuscleGroup = { 
        ...muscleGroup, 
        muscles: updatedMuscles,
        imageUrl: updatedImageUrl,
        imageFile: undefined
      };

      if (id) {
        await updateMuscleGroup(updatedMuscleGroup);
      } else {
        await saveMuscleGroup(updatedMuscleGroup);
      }

      navigate("/muscle-groups");
    } catch (error) {
      console.error("Error saving muscle group:", error);
      setError("Failed to save muscle group. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <FormContainer onSubmit={handleSubmit}>
      <BackButton type="button" onClick={() => navigate("/muscle-groups")}>
        <FaArrowLeft /> Back to Muscle Groups
      </BackButton>
      <Button type="submit">Save Muscle Group</Button>
      <h2>{id ? "Edit Muscle Group" : "Create Muscle Group"}</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Input
        type="text"
        name="name"
        value={muscleGroup.name}
        onChange={handleInputChange}
        placeholder="Muscle Group Name"
        required
      />
      <h3>Muscle Group Image</h3>
      {muscleGroup.imageUrl && <ImagePreview src={muscleGroup.imageUrl} alt={muscleGroup.name} />}
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setMuscleGroup({
              ...muscleGroup,
              imageFile: e.target.files[0],
              imageUrl: URL.createObjectURL(e.target.files[0])
            });
          }
        }}
      />
      {muscleGroup.imageUrl && (
        <ImageCropper
          imageFile={muscleGroup.imageFile || muscleGroup.imageUrl}
          onCrop={() => {}}
          ref={(el) => (cropperRefs.current[0] = el)}
        />
      )}
      <h3>Muscles</h3>
      {muscleGroup.muscles.map((muscle, index) => (
        <MuscleContainer key={muscle.id}>
          <Input
            type="text"
            value={muscle.name}
            onChange={(e) => handleMuscleChange(index, "name", e.target.value)}
            placeholder="Muscle Name"
            required
          />
          <TextArea
            value={muscle.description}
            onChange={(e) => handleMuscleChange(index, "description", e.target.value)}
            placeholder="Muscle Description"
            required
          />
          {muscle.imageUrl && <ImagePreview src={muscle.imageUrl} alt={muscle.name} />}
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload(index)}
            ref={(el) => (fileInputRefs.current[index] = el)}
          />
          {(muscle.imageUrl || muscle.imageFile) && (
            <ImageCropper
              imageFile={muscle.imageFile || muscle.imageUrl}
              onCrop={() => {}}
              ref={(el) => (cropperRefs.current[index + 1] = el)}
            />
          )}
          <Button type="button" onClick={() => handleRemoveMuscle(index)}>
            <FaTrash /> Remove Muscle
          </Button>
        </MuscleContainer>
      ))}
      <Button type="button" onClick={handleAddMuscle}>
        <FaPlus /> Add Muscle
      </Button>
    </FormContainer>
  );
};

export default MuscleGroupForm;