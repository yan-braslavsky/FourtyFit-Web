import styled from "styled-components";

export const FormContainer = styled.form`
  background-color: ${props => props.theme.colors.background};
  padding: 2rem;
  border-radius: 8px;
  width: 50vw;
  max-width: 1000px;
  margin: 2rem auto;
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const Button = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
`;

export const DiscardButton = styled(Button)`
  background-color: ${props => props.theme.colors.secondary};
`;

export const SaveButton = styled(Button)`
  margin-left: 1rem;
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
  min-height: 150px;
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
`;

export const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%; // 16:9 aspect ratio
  margin-bottom: 1rem;
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  overflow: hidden;
`;

export const ImagePreview = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export const EditImageButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.7);
  border: none;
  border-radius: 50%;
  padding: 0.5rem;
  cursor: pointer;
  z-index: 1;
`;

export const SelectorContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const SelectorColumn = styled.div`
  flex: 1;
`;

export const SelectorList = styled.div`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  padding: 1rem;
  max-height: 300px;
  overflow-y: auto;
`;

export const SelectorItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  &:hover {
    background-color: ${props => props.theme.colors.hover};
  }
`;

export const AddButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.colors.primary};
  font-size: 1.2rem;
`;

export const SelectedItemsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const SelectedItems = styled.div`
  flex: 1;
`;

export const SelectedItemBadge = styled.div`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
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