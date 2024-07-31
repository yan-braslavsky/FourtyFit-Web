import React, { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {useExerciseFormViewModel} from "../viewmodels/ ExerciseFormViewModel";
import ImageCropper from "./ImageCropper";
import { FaArrowLeft, FaChevronDown, FaChevronRight } from "react-icons/fa";
import * as S from "../styles/ExerciseFormStyles";

export const ExerciseForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const {
    exercise,
    equipment,
    muscleGroups,
    expandedGroups,
    selectedMuscleGroups,
    error,
    imageFile,
    setImageFile,
    handleInputChange,
    handleEquipmentChange,
    toggleMuscleGroup,
    selectMuscleGroup,
    removeMuscleGroup,
    handleSubmit,
  } = useExerciseFormViewModel(id);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<any>(null);

  const onSubmit = async (e: React.FormEvent) => {
    const success = await handleSubmit(e);
    if (success) {
      navigate("/exercises");
    }
  };

  const handleBack = () => {
    navigate("/exercises");
  };

  return (
    <S.FormContainer onSubmit={onSubmit}>
      <S.BackButton type="button" onClick={handleBack}>
        <FaArrowLeft /> Back to List
      </S.BackButton>
      <h2>{id ? "Edit Exercise" : "Create Exercise"}</h2>
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
      <S.Select
        multiple
        name="equipmentIds"
        value={exercise.equipmentIds}
        onChange={handleEquipmentChange}
      >
        {equipment.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </S.Select>
      <S.MuscleGroupSelector>
        <h3>Select Muscle Groups</h3>
        {muscleGroups.map((muscleGroup) => (
          <div key={muscleGroup.id}>
            <S.MuscleGroupItem
              onClick={() => toggleMuscleGroup(muscleGroup.id!)}
              $selected={selectedMuscleGroups.some((mg) => mg.id === muscleGroup.id)}
            >
              {expandedGroups.includes(muscleGroup.id!) ? (
                <FaChevronDown />
              ) : (
                <FaChevronRight />
              )}
              <S.MuscleGroupImage src={muscleGroup.imageUrl} alt={muscleGroup.name} />
              {muscleGroup.name}
            </S.MuscleGroupItem>
            {expandedGroups.includes(muscleGroup.id!) && (
              <S.MuscleList>
                {muscleGroup.muscles.map((muscle) => (
                  <S.MuscleItem
                    key={muscle.name}
                    onClick={() => selectMuscleGroup(muscleGroup)}
                  >
                    <S.MuscleGroupImage src={muscle.imageUrl} alt={muscle.name} />
                    {muscle.name}
                  </S.MuscleItem>
                ))}
              </S.MuscleList>
            )}
          </div>
        ))}
      </S.MuscleGroupSelector>
      <S.SelectedMuscleGroups>
        {selectedMuscleGroups.map((muscleGroup) => (
          <S.MuscleGroupBadge key={muscleGroup.id}>
            {muscleGroup.name}
            <S.RemoveBadgeButton onClick={() => removeMuscleGroup(muscleGroup.id!)}>
              &times;
            </S.RemoveBadgeButton>
          </S.MuscleGroupBadge>
        ))}
      </S.SelectedMuscleGroups>
      {exercise.imageUrl && (
        <S.ImagePreview src={exercise.imageUrl} alt="Current exercise image" />
      )}
      <S.Input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
          }
        }}
        ref={fileInputRef}
      />
      {imageFile && (
        <ImageCropper
          imageFile={imageFile}
          onCrop={() => {}}
          ref={cropperRef}
        />
      )}
      <S.Button type="submit">Save Exercise</S.Button>
    </S.FormContainer>
  );
};

export default ExerciseForm;