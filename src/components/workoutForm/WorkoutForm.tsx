import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWorkoutFormViewModel } from "./WorkoutFormViewModel";
import ImageCropper from "../../components/ImageCropper";
import { FaArrowLeft, FaPlus, FaMinus, FaTimes, FaEdit, FaSearch } from "react-icons/fa";
import styled from "styled-components";
import * as S from "./WorkoutFormStyles";

const CropperWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const WorkoutForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [isEditingImage, setIsEditingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<any>(null);

  const {
    workout,
    exercises,
    error,
    imageFile,
    setImageFile,
    handleInputChange,
    toggleExercise,
    handleSubmit,
    addExerciseGroup,
    removeExerciseGroup,
    updateExerciseGroup,
    filterExercises,
  } = useWorkoutFormViewModel(id, cropperRef);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit(e);
    if (success) {
      navigate("/workouts");
    }
  };

  const handleDiscard = () => {
    navigate("/workouts");
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

  return (
    <S.FormContainer onSubmit={onSubmit}>
      <S.TopBar>
        <S.DiscardButton type="button" onClick={handleDiscard}>
          <FaArrowLeft /> Discard
        </S.DiscardButton>
        <S.SaveButton type="submit">Save Workout</S.SaveButton>
      </S.TopBar>

      <h2>{id ? "Edit Workout" : "Create Workout"}</h2>

      <S.FormSection>
        <S.Label>Workout Title</S.Label>
        <S.Input
          type="text"
          name="name"
          value={workout.name}
          onChange={handleInputChange}
          placeholder="Enter workout title"
          required
        />
      </S.FormSection>

      <S.FormSection>
        <S.Label>Workout Image</S.Label>
        <S.ImageContainer>
          {isEditingImage && imageFile ? (
            <CropperWrapper>
              <ImageCropper
                imageFile={imageFile}
                onCrop={() => {}}
                ref={cropperRef}
                aspectRatio={16 / 9}
              />
            </CropperWrapper>
          ) : (
            <>
              <S.ImagePreview src={workout.imageUrl || "/placeholder-image.jpg"} alt={workout.name} />
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
          style={{ display: "none" }}
        />
      </S.FormSection>

      <S.FormSection>
        <S.Label>Exercise Groups</S.Label>
        {workout.exerciseGroups.map((group, groupIndex) => (
          <S.ExerciseGroup key={groupIndex}>
            <S.ExerciseGroupHeader>
              <S.Label>Group {groupIndex + 1}</S.Label>
              <S.RemoveButton onClick={() => removeExerciseGroup(groupIndex)}>
                <FaTimes />
              </S.RemoveButton>
            </S.ExerciseGroupHeader>
            <S.Label>Number of Sets</S.Label>
            <S.Select
              value={group.sets}
              onChange={(e) => updateExerciseGroup(groupIndex, "sets", parseInt(e.target.value))}
            >
              {[2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </S.Select>
            <S.SearchBar>
              <FaSearch />
              <S.SearchInput
                type="text"
                placeholder="Search exercises..."
                onChange={(e) => filterExercises(e.target.value)}
              />
            </S.SearchBar>
            <S.SelectedExercises>
              {group.exercises.map((exercise, exerciseIndex) => (
                <S.ExerciseItem
                  key={exercise.exerciseId}
                  onClick={() => toggleExercise(groupIndex, exercise.exerciseId)}
                >
                  <S.ExerciseInfo>
                    <S.ExerciseTitle>{exercises.find(e => e.id === exercise.exerciseId)?.name}</S.ExerciseTitle>
                  </S.ExerciseInfo>
                  <S.IconButton>
                    <FaMinus />
                  </S.IconButton>
                </S.ExerciseItem>
              ))}
            </S.SelectedExercises>
            <S.ExerciseList>
              {exercises.filter(e => !group.exercises.some(ge => ge.exerciseId === e.id)).map((exercise) => (
                <S.ExerciseItem
                  key={exercise.id}
                  onClick={() => toggleExercise(groupIndex, exercise.id!)}
                >
                  <S.ExerciseImage src={exercise.imageUrl} alt={exercise.name} />
                  <S.ExerciseInfo>
                    <S.ExerciseTitle>{exercise.name}</S.ExerciseTitle>
                    <S.ExerciseDescription>{exercise.description}</S.ExerciseDescription>
                    <S.BadgeContainer>
                      {exercise.equipmentIds.map((equipId) => (
                        <S.Badge key={equipId} color="primary">{equipId}</S.Badge>
                      ))}
                      {exercise.muscleGroupIds.map((muscleId) => (
                        <S.Badge key={muscleId} color="secondary">{muscleId}</S.Badge>
                      ))}
                    </S.BadgeContainer>
                  </S.ExerciseInfo>
                  <S.IconButton>
                    <FaPlus />
                  </S.IconButton>
                </S.ExerciseItem>
              ))}
            </S.ExerciseList>
          </S.ExerciseGroup>
        ))}
        <S.AddButton onClick={addExerciseGroup}>
          <FaPlus /> Add Exercise Group
        </S.AddButton>
      </S.FormSection>

      {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
    </S.FormContainer>
  );
};

export default WorkoutForm;