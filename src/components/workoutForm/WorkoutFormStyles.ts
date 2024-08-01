import styled from "styled-components";
import Select, { Props } from "react-select";

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

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
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

export const ExerciseGroupContainer = styled.div`
  border: 1px solid ${props => props.theme.colors.primary};
  padding: 1rem;
  margin-bottom: 1rem;
`;

export const GroupList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

export const GroupListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`;

export const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 1rem;
`;

export const StyledSelect = styled(Select).attrs({
  classNamePrefix: "react-select"
})<Props<any, boolean>>`
  margin-bottom: 1rem;
  
  .react-select__control {
    border-color: ${props => props.theme.colors.primary};
  }

  .react-select__option--is-selected {
    background-color: ${props => props.theme.colors.primary};
  }

  .react-select__option--is-focused {
    background-color: ${props => props.theme.colors.secondary};
  }
`;