import React, { useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useExerciseFormViewModel } from "../viewmodels/ ExerciseFormViewModel";
import ImageCropper from "./ImageCropper";
import { FaArrowLeft, FaPlus, FaTimes, FaEdit } from "react-icons/fa";
import styled from "styled-components";
import * as S from "../styles/ExerciseFormStyles";

const CropperWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const ExerciseForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [isEditingImage, setIsEditingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<any>(null);

  const {
    exercise,
    equipment,
    muscleGroups,
    error,
    imageFile,
    setImageFile,
    handleInputChange,
    toggleEquipment,
    toggleMuscleGroup,
    handleSubmit,
  } = useExerciseFormViewModel(id, cropperRef);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit(e);
    if (success) {
      navigate("/exercises");
    }
  };

  const handleDiscard = () => {
    navigate("/exercises");
  };

  const handleImageEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setIsEditingImage(true);
    }
  };

  const selectedMuscleGroups = muscleGroups.filter(mg => exercise.muscleGroupIds.includes(mg.id!));
  const unselectedMuscleGroups = muscleGroups.filter(mg => !exercise.muscleGroupIds.includes(mg.id!));

  const selectedEquipment = equipment.filter(eq => exercise.equipmentIds.includes(eq.id!));
  const unselectedEquipment = equipment.filter(eq => !exercise.equipmentIds.includes(eq.id!));

  return (
    <S.FormContainer onSubmit={onSubmit}>
      <S.TopBar>
        <S.DiscardButton type="button" onClick={handleDiscard}>
          <FaArrowLeft /> Discard
        </S.DiscardButton>
        <S.SaveButton type="submit">Save Exercise</S.SaveButton>
      </S.TopBar>

      <h2>{id ? "Edit Exercise" : "Create Exercise"}</h2>

      <S.ImageContainer>
        {isEditingImage && imageFile ? (
          <CropperWrapper>
            <ImageCropper
              imageFile={imageFile}
              onCrop={() => {}}
              ref={cropperRef}
            />
          </CropperWrapper>
        ) : (
          <>
            <S.ImagePreview src={exercise.imageUrl || '/placeholder-image.jpg'} alt={exercise.name} />
            <S.EditImageButton onClick={handleImageEdit} type="button">
              <FaEdit />
            </S.EditImageButton>
          </>
        )}
      </S.ImageContainer>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />

      {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
      
      <S.Input
        type="text"
        name="name"
        placeholder="Exercise Name"
        value={exercise.name}
        onChange={handleInputChange}
        required
      />

      <S.TextArea
        name="description"
        placeholder="Description"
        value={exercise.description}
        onChange={handleInputChange}
        required
      />

      <S.SelectorContainer>
        <S.SelectorColumn>
          <h3>Select Equipment</h3>
          <S.SelectorList>
            {unselectedEquipment.map((item) => (
              <S.SelectorItem key={item.id}>
                {item.name}
                <S.AddButton onClick={() => toggleEquipment(item.id!)}>
                  <FaPlus />
                </S.AddButton>
              </S.SelectorItem>
            ))}
          </S.SelectorList>
        </S.SelectorColumn>
        <S.SelectorColumn>
          <h3>Select Muscle Groups</h3>
          <S.SelectorList>
            {unselectedMuscleGroups.map((muscleGroup) => (
              <S.SelectorItem key={muscleGroup.id}>
                {muscleGroup.name}
                <S.AddButton onClick={() => toggleMuscleGroup(muscleGroup.id!)}>
                  <FaPlus />
                </S.AddButton>
              </S.SelectorItem>
            ))}
          </S.SelectorList>
        </S.SelectorColumn>
      </S.SelectorContainer>

      <S.SelectedItemsContainer>
        <S.SelectedItems>
          <h4>Selected Equipment:</h4>
          {selectedEquipment.map((item) => (
            <S.SelectedItemBadge key={item.id}>
              {item.name}
              <S.RemoveBadgeButton onClick={() => toggleEquipment(item.id!)}>
                <FaTimes />
              </S.RemoveBadgeButton>
            </S.SelectedItemBadge>
          ))}
        </S.SelectedItems>
        <S.SelectedItems>
          <h4>Selected Muscle Groups:</h4>
          {selectedMuscleGroups.map((muscleGroup) => (
            <S.SelectedItemBadge key={muscleGroup.id}>
              {muscleGroup.name}
              <S.RemoveBadgeButton onClick={() => toggleMuscleGroup(muscleGroup.id!)}>
                <FaTimes />
              </S.RemoveBadgeButton>
            </S.SelectedItemBadge>
          ))}
        </S.SelectedItems>
      </S.SelectedItemsContainer>
    </S.FormContainer>
  );
};

export default ExerciseForm;