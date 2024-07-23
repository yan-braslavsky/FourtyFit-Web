// src/components/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Corrected import order
import { ThemeProvider } from 'styled-components';
import Header from './components/Header';
import EquipmentForm from './components/EquipmentForm';
import ExerciseForm from './components/ExerciseForm';
import WorkoutForm from './components/WorkoutForm';
import WorkoutList from './components/WorkoutList';
import { theme } from './styles/theme';
import styled from 'styled-components';
import { Navigate } from 'react-router-dom';
import Footer from './components/Footer';

const AppContainer = styled.div`
  background-color: ${props => props.theme.colors.background};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const ContentContainer = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  flex-grow: 1;
`;

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppContainer>
          <Header />
          <ContentContainer>
            <Routes>
              <Route path="/" element={<Navigate replace to="/workouts" />} />
              <Route path="/workouts" element={<WorkoutList />} />
              <Route path="/create-workout" element={<WorkoutForm />} />
              <Route path="/edit-workout/:id" element={<WorkoutForm />} />
              <Route path="/equipment" element={<EquipmentForm />} />
              <Route path="/exercises" element={<ExerciseForm />} />
            </Routes>
          </ContentContainer>
          <Footer />
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
};

export default App;