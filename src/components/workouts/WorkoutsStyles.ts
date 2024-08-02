import styled from "styled-components";

export const WorkoutListContainer = styled.div`
  background-color: ${props => props.theme.colors.background};
  padding: 2rem;
  border-radius: 12px;
  max-width: 900px;
  margin: 2rem auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid ${props => props.theme.colors.primary};
`;

export const WorkoutItem = styled.div`
  background-color: ${props => props.theme.colors.card};
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  border-radius: 10px;
  display: flex;
  align-items: flex-start;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;  // Add this line to change the cursor on hover

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

export const WorkoutImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
  margin-right: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const WorkoutInfo = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

export const WorkoutName = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.4rem;
  color: ${props => props.theme.colors.text};
`;

export const BadgeSection = styled.div`
  margin-bottom: 0.5rem;

  h4 {
    margin: 0 0 0.25rem 0;
    font-size: 1rem;
    color: ${props => props.theme.colors.textSecondary};
  }
`;

export const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

export const Badge = styled.span<{ color: "primary" | "secondary" }>`
  background-color: ${props => props.color === "primary" ? props.theme.colors.primary : props.theme.colors.secondary};
  color: ${props => props.theme.colors.background};
  padding: 0.2rem 0.5rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
`;

export const ExerciseGroupInfo = styled.p`
  margin: 0.5rem 0 0 0;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-self: flex-start;
`;

export const IconButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.primary};
  transition: color 0.3s ease;

  &:hover {
    color: ${props => props.theme.colors.secondary};
  }
`;

export const AddWorkoutButton = styled.button`
  display: inline-flex;
  align-items: center;
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.background};
  padding: 0.7rem 1.2rem;
  border-radius: 25px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }

  svg {
    margin-right: 0.5rem;
    font-size: 1.2rem;
  }
`;