// src/components/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Corrected import order
import { ThemeProvider } from 'styled-components';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import EquipmentForm from './components/EquipmentForm';
import ExerciseForm from './components/ExerciseForm';
import WorkoutForm from './components/WorkoutForm';
import WorkoutList from './components/WorkoutList';
import {theme} from './styles/theme';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Header />
        <HeroSection />
        <Routes>
          <Route path="/" element={<WorkoutList />} />
          <Route path="/create-workout" element={<WorkoutForm />} />
          <Route path="/edit-workout/:id" element={<WorkoutForm />} />
          <Route path="/equipment" element={<EquipmentForm />} />
          <Route path="/exercises" element={<ExerciseForm />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;