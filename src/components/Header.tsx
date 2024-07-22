// src/components/Header.tsx
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HeaderContainer = styled.header`
  background-color: ${props => props.theme.colors.primary};
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled.h1`
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <HeaderTitle>FourtyFit</HeaderTitle>
      <Nav>
        <NavLink to="/">Workouts</NavLink>
        <NavLink to="/create-workout">Create Workout</NavLink>
        <NavLink to="/equipment">Equipment</NavLink>
        <NavLink to="/exercises">Exercises</NavLink>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;