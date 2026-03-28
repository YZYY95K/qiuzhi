import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import InterviewPractice from './pages/InterviewPractice';
import JobMatcher from './pages/JobMatcher';
import JobAssistant from './pages/JobAssistant';
import Layout from './components/Layout';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
      <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
        <Route index element={<Dashboard />} />
        <Route path="resume-analyzer" element={<ResumeAnalyzer />} />
        <Route path="interview" element={<InterviewPractice />} />
        <Route path="job-matcher" element={<JobMatcher />} />
        <Route path="assistant" element={<JobAssistant />} />
      </Route>
    </Routes>
  );
}

export default App;
