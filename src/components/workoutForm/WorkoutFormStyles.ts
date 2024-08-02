import styled from "styled-components";

export const FormContainer = styled.form`
  background-color: ${props => props.theme.colors.background};
  padding: 2rem;
  border-radius: 12px;
  max-width: 800px;
  margin: 2rem auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const Button = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
`;

export const DiscardButton = styled(Button)`
  background-color: ${props => props.theme.colors.secondary};
`;

export const SaveButton = styled(Button)`
  margin-left: 1rem;
`;

export const FormSection = styled.div`
  margin-bottom: 2rem;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 4px;
  font-size: 1rem;
`;

export const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%; // 16:9 aspect ratio
  margin-bottom: 1rem;
  border: 2px dashed ${props => props.theme.colors.primary};
  border-radius: 8px;
  overflow: hidden;
`;

export const ImagePreview = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const EditImageButton = styled(Button)`
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
`;

export const ExerciseGroup = styled.div`
  background-color: ${props => props.theme.colors.card};
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

export const ExerciseGroupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const RemoveButton = styled(Button)`
  background-color: ${props => props.theme.colors.warning};
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
`;

export const AddButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  margin-top: 1rem;
  font-weight: bold;
`;

export const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.colors.background};
  border-radius: 20px;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
`;

export const SearchInput = styled.input`
  border: none;
  background: transparent;
  margin-left: 0.5rem;
  flex-grow: 1;
  font-size: 1rem;
  &:focus {
    outline: none;
  }
`;

export const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const Badge = styled.span<{ color: "primary" | "secondary" }>`
  background-color: ${props => props.color === "primary" ? props.theme.colors.primary : props.theme.colors.secondary};
  color: ${props => props.theme.colors.background};
  padding: 0.2rem 0.5rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 4px;
  font-size: 1rem;
  margin-bottom: 1rem;
`;

export const SelectedExercises = styled.div`
  margin-bottom: 1rem;
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 4px;
  padding: 0.5rem;
`;

export const ExerciseList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 4px;
`;

export const ExerciseItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.colors.secondary + '33'};
  }
`;

export const ExerciseImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 1rem;
`;

export const ExerciseInfo = styled.div`
  flex-grow: 1;
`;

export const ExerciseTitle = styled.h4`
  margin: 0;
  font-size: 1rem;
`;

export const ExerciseDescription = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: ${props => props.theme.colors.primary};
  padding: 0.5rem;
`;

export const CreateButton = styled.button<{ disabled: boolean }>`
  background-color: ${props => props.disabled ? props.theme.colors.disabled : props.theme.colors.accent};
  color: ${props => props.theme.colors.text};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 1rem;
  transition: all 0.3s ease;
  opacity: ${props => props.disabled ? 0.6 : 1};
  font-weight: bold;

  &:hover {
    background-color: ${props => props.disabled ? props.theme.colors.disabled : props.theme.colors.accentHover};
  }
`;