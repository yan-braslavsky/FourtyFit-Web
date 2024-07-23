// src/components/Header.tsx
import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { FaListUl, FaDumbbell, FaRunning } from 'react-icons/fa';
import { GiGymBag } from 'react-icons/gi';

const HeaderContainer = styled.header`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textLight};
  padding: 2rem 0;
  text-align: center;
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 2.5rem;
`;

const NavContainer = styled.nav`
  background-color: ${props => props.theme.colors.secondary};
  padding: 1rem 0;
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
`;

const NavList = styled.ul`
  display: flex;
  justify-content: center;
  list-style-type: none;
  margin: 0;
  padding: 0;
  max-width: 1200px;
  margin: 0 auto;
`;

const NavItem = styled.li`
  margin: 0 1rem;
`;

interface NavLinkProps {
  isActive: boolean;
}

const NavLink = styled(Link)<NavLinkProps>`
  color: ${props => props.theme.colors.textLight};
  text-decoration: none;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  background-color: ${props => props.isActive ? props.theme.colors.accent : 'transparent'};

  &:hover {
    background-color: ${props => props.theme.colors.accent};
  }

  svg {
    margin-right: 0.5rem;
  }
`;

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <HeaderContainer>
        <HeaderTitle>FourtyFit</HeaderTitle>
      </HeaderContainer>
      <NavContainer>
        <NavList>
          <NavItem>
            <NavLink to="/workouts" isActive={location.pathname === '/workouts'}><FaListUl /> Workouts</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/create-workout" isActive={location.pathname === '/create-workout'}><FaDumbbell /> Create Workout</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/equipment" isActive={location.pathname === '/equipment'}><GiGymBag /> Add Equipment</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/exercises" isActive={location.pathname === '/exercises'}><FaRunning /> Add Exercise</NavLink>
          </NavItem>
        </NavList>
      </NavContainer>
    </>
  );
};

export default Header;