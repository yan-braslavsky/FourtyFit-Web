import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWorkoutFormViewModel } from "./WorkoutFormViewModel";
import ImageCropper from "../../components/ImageCropper";
import { FaArrowLeft, FaPlus, FaMinus, FaChevronDown, FaChevronUp, FaEdit, FaSearch } from "react-icons/fa";
import * as S from "./WorkoutFormStyles";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

const WorkoutForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<any>(null);
  const [groupSearchTerms, setGroupSearchTerms] = useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<boolean[]>([]);

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
    updateWorkoutImage,
    getMuscleGroupName,
    getEquipmentName,
    reorderExerciseGroups,
  } = useWorkoutFormViewModel(id, cropperRef);

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    console.log("WorkoutForm mounted", { id });
    return () => {
      console.log("WorkoutForm unmounted", { id });
    };
  }, [id]);

  useEffect(() => {
    console.log("Workout updated", { workout });
    const isValid = workout.name.trim() !== "" &&
                    (isImageUploaded || !!workout.imageUrl) &&
                    workout.exerciseGroups.length > 0 &&
                    workout.exerciseGroups.every(group => group.exercises.length > 0);
    setIsFormValid(isValid);
    setExpandedGroups(new Array(workout.exerciseGroups.length).fill(false));
  }, [workout, isImageUploaded]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      const success = await handleSubmit(e);
      if (success) {
        navigate("/workouts");
      }
    }
  };

  const handleDiscard = useCallback(() => {
    navigate("/workouts");
  }, [navigate]);

  const handleImageEdit = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    fileInputRef.current?.click();
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setIsEditingImage(true);
      setIsImageUploaded(true);
    }
  }, [setImageFile]);

  const handleGroupSearch = useCallback((groupIndex: number, searchTerm: string) => {
    setGroupSearchTerms(prev => {
      const newTerms = [...prev];
      newTerms[groupIndex] = searchTerm;
      return newTerms;
    });
  }, []);

  const getFilteredExercisesForGroup = useCallback((groupIndex: number) => {
    const searchTerm = groupSearchTerms[groupIndex] || "";
    return exercises.filter(exercise => 
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [exercises, groupSearchTerms]);

  const toggleGroupExpansion = useCallback((index: number) => {
    setExpandedGroups(prev => {
      const newExpandedGroups = [...prev];
      newExpandedGroups[index] = !newExpandedGroups[index];
      return newExpandedGroups;
    });
  }, []);

  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) {
      return;
    }
    reorderExerciseGroups(result.source.index, result.destination.index);
  }, [reorderExerciseGroups]);

  return (
    <S.FormContainer onSubmit={onSubmit}>
      <S.TopBar>
        <S.DiscardButton type="button" onClick={handleDiscard}>
          <FaArrowLeft /> Discard
        </S.DiscardButton>
        <S.CreateButton type="submit" disabled={!isFormValid}>
          {id ? "Save" : "Create"} Workout
        </S.CreateButton>
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
            <ImageCropper
              imageFile={imageFile}
              onCrop={(croppedImage) => {
                updateWorkoutImage(URL.createObjectURL(croppedImage));
                setIsEditingImage(false);
                setIsImageUploaded(true);
              }}
              ref={cropperRef}
              aspectRatio={16 / 9}
            />
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
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="exercise-groups">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {workout.exerciseGroups.map((group, groupIndex) => (
                  <Draggable key={`group-${groupIndex}`} draggableId={`group-${groupIndex}`} index={groupIndex}>
                    {(provided) => (
                      <S.ExerciseGroup
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <S.ExerciseGroupHeader>
                          <S.Label>Group {groupIndex + 1}</S.Label>
                          <S.ExpandButton onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleGroupExpansion(groupIndex);
                          }}>
                            {expandedGroups[groupIndex] ? <FaChevronUp /> : <FaChevronDown />}
                          </S.ExpandButton>
                        </S.ExerciseGroupHeader>
                        {expandedGroups[groupIndex] && (
                          <>
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
                                onChange={(e) => handleGroupSearch(groupIndex, e.target.value)}
                              />
                            </S.SearchBar>
                            <S.SelectedExercises>
                              {group.exercises.map((exercise) => (
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
                              {getFilteredExercisesForGroup(groupIndex).filter(e => !group.exercises.some(ge => ge.exerciseId === e.id)).map((exercise) => (
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
                                        <S.Badge key={equipId} color="primary">{getEquipmentName(equipId)}</S.Badge>
                                      ))}
                                      {exercise.muscleGroupIds.map((muscleId) => (
                                        <S.Badge key={muscleId} color="secondary">{getMuscleGroupName(muscleId)}</S.Badge>
                                      ))}
                                    </S.BadgeContainer>
                                  </S.ExerciseInfo>
                                  <S.IconButton>
                                    <FaPlus />
                                  </S.IconButton>
                                </S.ExerciseItem>
                              ))}
                            </S.ExerciseList>
                            <S.DeleteGroupButton onClick={() => removeExerciseGroup(groupIndex)}>
                              DELETE
                            </S.DeleteGroupButton>
                          </>
                        )}
                      </S.ExerciseGroup>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <S.AddButton onClick={addExerciseGroup}>
          <FaPlus /> Add Exercise Group
        </S.AddButton>
      </S.FormSection>

      {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
    </S.FormContainer>
  );
};

export default React.memo(WorkoutForm);