// src/components/Header.tsx
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
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

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.textLight};
  text-decoration: none;
  font-size: 1.2rem;
  display: flex;
  align-items: center;

  &:hover {
    text-decoration: underline;
  }

  svg {
    margin-right: 0.5rem;
  }
`;

const Header: React.FC = () => {
  return (
    <>
      <HeaderContainer>
        <HeaderTitle>FourtyFit</HeaderTitle>
      </HeaderContainer>
      <NavContainer>
        <NavList>
          <NavItem>
            <NavLink to="/"><FaListUl /> Workouts</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/create-workout"><FaDumbbell /> Create Workout</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/equipment"><GiGymBag /> Add Equipment</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/exercises"><FaRunning /> Add Exercise</NavLink>
          </NavItem>
        </NavList>
      </NavContainer>
    </>
  );
};

export default Header;