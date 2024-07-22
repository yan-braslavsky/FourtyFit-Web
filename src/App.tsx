// src/components/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { theme } from './styles/theme';
import { ThemeProvider } from 'styled-components';
import Header from './components/Header';
import WorkoutList from './components/WorkoutList';
import WorkoutForm from './components/WorkoutForm';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<WorkoutList />} />
          <Route path="/create" element={<WorkoutForm />} />
          <Route path="/edit/:id" element={<WorkoutForm />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;