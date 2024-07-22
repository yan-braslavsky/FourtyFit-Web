// src/components/Header.tsx
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HeaderContainer = styled.header`
  background-color: ${props => props.theme.colors.primary};
  padding: 1rem;
`;

const HeaderTitle = styled.h1`
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const HeaderLink = styled(Link)`
  color: ${props => props.theme.colors.text};
  margin-right: 1rem;
  text-decoration: none;
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <HeaderTitle>FourtyFit</HeaderTitle>
      <nav>
        <HeaderLink to="/">Workouts</HeaderLink>
        <HeaderLink to="/create">Create Workout</HeaderLink>
      </nav>
    </HeaderContainer>
  );
};

export default Header;