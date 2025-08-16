import React from 'react';
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage';
import ScoreChecker from './pages/ScoreChecker';
import ResumeMaker from './pages/ResumeMaker';
import JobSearch from './pages/JobSearch';
import ScrollToHash from './utils/ScrollToHash';
import { ThemeProvider } from './context/ThemeContext';


function App() {

  return (
    <ThemeProvider>
      <BrowserRouter>
    <ScrollToHash />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/score-check" element={<ScoreChecker />} />
        <Route path="/resume-maker" element={<ResumeMaker />} />
        <Route path="/job-search" element={<JobSearch />} />
        <Route path="/login" element={<LandingPage />} />
        <Route path="/signup" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  )
    
}

export default App
