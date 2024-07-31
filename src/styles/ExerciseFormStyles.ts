import styled from "styled-components";

export const FormContainer = styled.form`
  background-color: ${props => props.theme.colors.background};
  padding: 2rem;
  border-radius: 8px;
  max-width: 600px;
  margin: 2rem auto;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
`;

export const Button = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
`;

export const BackButton = styled(Button)`
  background-color: ${props => props.theme.colors.secondary};
`;

export const MuscleGroupSelector = styled.div`
  margin-bottom: 1rem;
`;

export const MuscleGroupItem = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;
  background-color: ${(props) => (props.$selected ? props.theme.colors.accent : "transparent")};
`;

export const MuscleGroupImage = styled.img`
  width: 30px;
  height: 30px;
  object-fit: cover;
  margin-right: 0.5rem;
`;

export const MuscleList = styled.div`
  margin-left: 1rem;
`;

export const MuscleItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
`;

export const SelectedMuscleGroups = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

export const MuscleGroupBadge = styled.div`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
`;

export const RemoveBadgeButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  margin-left: 0.5rem;
  cursor: pointer;
`;

export const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 1rem;
`;

export const ImagePreview = styled.img`
  width: 100%;
  max-width: 200px;
  height: auto;
  margin-bottom: 1rem;
`;