import styled from "styled-components";

export const WorkoutListContainer = styled.div`
  background-color: ${props => props.theme.colors.background};
  padding: 2rem;
  border-radius: 8px;
  max-width: 800px;
  margin: 2rem auto;
`;

export const WorkoutItem = styled.div`
  background-color: ${props => props.theme.colors.card};
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const WorkoutInfo = styled.div`
  flex-grow: 1;
`;

export const WorkoutName = styled.h3`
  margin: 0 0 0.5rem 0;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const IconButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.primary};

  &:hover {
    color: ${props => props.theme.colors.secondary};
  }
`;

export const CreateWorkoutButton = styled.button`
  display: inline-flex;
  align-items: center;
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  margin-top: 1rem;
  border: none;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }

  svg {
    margin-right: 0.5rem;
  }
`;