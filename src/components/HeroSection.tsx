// src/components/HeroSection.tsx
import React from 'react';
import styled from 'styled-components';

const HeroContainer = styled.div`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  padding: 4rem 2rem;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
`;

const HeroSection: React.FC = () => {
  return (
    <HeroContainer>
      <HeroTitle>FourtyFit</HeroTitle>
      <HeroSubtitle>Create and manage your custom workouts</HeroSubtitle>
    </HeroContainer>
  );
};

export default HeroSection;