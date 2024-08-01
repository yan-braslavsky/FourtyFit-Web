import React from "react";
import { SingleValue, MultiValue } from "react-select";
import { useWorkoutFormViewModel } from "./WorkoutFormViewModel";
import { FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa";
import {
  FormContainer,
  Input,
  Label,
  Button,
  BackButton,
  ExerciseGroupContainer,
  GroupList,
  GroupListItem,
  ErrorMessage,
  StyledSelect
} from "./WorkoutFormStyles";

interface OptionType {
  value: string;
  label: string;
}

const WorkoutForm: React.FC = () => {
  const {
    workout,
    exercises,
    muscleGroups,
    equipmentList,
    currentGroup,
    formStage,
    titleError,
    editingGroupIndex,
    error,
    handleTitleChange,
    handleAddExercise,
    handleExerciseChange,
    handleMuscleGroupChange,
    handleEquipmentChange,
    handleAddGroup,
    handleEditGroup,
    handleDeleteGroup,
    handleSubmit,
    setFormStage,
    setCurrentGroup,
    setWorkout,
    FormStage
  } = useWorkoutFormViewModel();

  const renderTitleStage = () => (
    <>
      <Label htmlFor="workoutTitle">Title</Label>
      <Input
        id="workoutTitle"
        type="text"
        placeholder="Workout Title"
        value={workout.name}
        onChange={(e) => handleTitleChange(e.target.value)}
        required
      />
      {titleError && <ErrorMessage>{titleError}</ErrorMessage>}
      <Button type="button" onClick={() => setFormStage(FormStage.DETAILS)} disabled={!workout.name || !!titleError}>
        Next
      </Button>
    </>
  );

  const renderDetailsStage = () => (
    <>
      <Label htmlFor="workoutImage">Image URL</Label>
      <Input
        id="workoutImage"
        type="text"
        placeholder="Image URL"
        value={workout.imageUrl}
        onChange={(e) => setWorkout(prev => ({ ...prev, imageUrl: e.target.value }))}
      />
      <Label htmlFor="muscleGroups">Muscle Groups</Label>
      <StyledSelect
        id="muscleGroups"
        options={muscleGroups.map(group => ({ value: group.id, label: group.name }))}
        value={workout.muscleGroups?.map(id => ({ value: id, label: muscleGroups.find(g => g.id === id)?.name || id }))}
        onChange={(selected: MultiValue<OptionType>) => handleMuscleGroupChange(selected.map(option => option.value))}
        isMulti
      />
      <Label htmlFor="equipment">Equipment</Label>
      <StyledSelect
        id="equipment"
        options={equipmentList.map(item => ({ value: item.id, label: item.name }))}
        value={workout.equipment?.map(id => ({ value: id, label: equipmentList.find(e => e.id === id)?.name || id }))}
        onChange={(selected: MultiValue<OptionType>) => handleEquipmentChange(selected.map(option => option.value))}
        isMulti
      />
      <Button type="button" onClick={() => setFormStage(FormStage.GROUP)}>
        Next
      </Button>
    </>
  );

  const renderGroupStage = () => (
    <>
      <BackButton type="button" onClick={() => setFormStage(FormStage.REVIEW)}>
        <FaArrowLeft /> Back
      </BackButton>
      <h3>Exercise Group {editingGroupIndex !== null ? editingGroupIndex + 1 : workout.exerciseGroups.length + 1}</h3>
      
      <Label htmlFor="groupSets">Number of Sets</Label>
      <StyledSelect
        id="groupSets"
        value={{ value: currentGroup.sets.toString(), label: currentGroup.sets.toString() }}
        onChange={(selected: SingleValue<OptionType>) => setCurrentGroup({ ...currentGroup, sets: parseInt(selected?.value || "1") })}
        options={[1, 2, 3, 4, 5].map(num => ({ value: num.toString(), label: num.toString() }))}
      />

      {currentGroup.exercises.map((exercise, index) => (
        <ExerciseGroupContainer key={index}>
          <Label htmlFor={`exercise-${index}`}>Exercise</Label>
          <StyledSelect
            id={`exercise-${index}`}
            value={{ value: exercise.exerciseId, label: exercises.find(e => e.id === exercise.exerciseId)?.name || "" }}
            onChange={(selected: SingleValue<OptionType>) => handleExerciseChange(index, "exerciseId", selected?.value || "")}
            options={exercises.map(ex => ({ value: ex.id, label: ex.name }))}
          />

          <Label htmlFor={`weight-${index}`}>Weight (kg)</Label>
          <Input
            id={`weight-${index}`}
            type="number"
            value={exercise.weight}
            onChange={(e) => handleExerciseChange(index, "weight", parseFloat(e.target.value))}
            min="0"
            step="0.1"
            required
          />

          <Label htmlFor={`reps-${index}`}>Reps</Label>
          <Input
            id={`reps-${index}`}
            type="number"
            value={exercise.reps}
            onChange={(e) => handleExerciseChange(index, "reps", parseInt(e.target.value))}
            min="0"
            required
          />
        </ExerciseGroupContainer>
      ))}

      <Button type="button" onClick={handleAddExercise}>
        Add Another Exercise to Group
      </Button>

      <Button type="button" onClick={handleAddGroup}>
        {editingGroupIndex !== null ? "Update Group" : "Add Group to Workout"}
      </Button>
    </>
  );

  const renderReviewStage = () => (
    <>
      <BackButton type="button" onClick={() => setFormStage(FormStage.TITLE)}>
        <FaArrowLeft /> Back to Title
      </BackButton>
      <h3>Review Workout</h3>
      <GroupList>
        {workout.exerciseGroups.map((group, groupIndex) => (
          <GroupListItem key={groupIndex}>
            <span>Group {groupIndex + 1} - {group.sets} sets, {group.exercises.length} exercises</span>
            <div>
              <Button onClick={() => handleEditGroup(groupIndex)}><FaEdit /></Button>
              <Button onClick={() => handleDeleteGroup(groupIndex)}><FaTrash /></Button>
            </div>
          </GroupListItem>
        ))}
      </GroupList>
      <Button type="button" onClick={() => {
        setCurrentGroup({ exercises: [], sets: 1 });
        setFormStage(FormStage.GROUP);
      }}>
        Add Another Group
      </Button>
      <Button type="submit">Save Workout</Button>
    </>
  );

  return (
    <FormContainer onSubmit={(e) => {
      e.preventDefault();
      handleSubmit();
    }}>
      <h2>{workout.id ? "Edit Workout" : "Create Workout"}</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {formStage === FormStage.TITLE && renderTitleStage()}
      {formStage === FormStage.DETAILS && renderDetailsStage()}
      {formStage === FormStage.GROUP && renderGroupStage()}
      {formStage === FormStage.REVIEW && renderReviewStage()}
    </FormContainer>
  );
};

export default WorkoutForm;