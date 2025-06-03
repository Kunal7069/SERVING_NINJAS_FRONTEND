import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import TiffinServices from './components/TiffinServices';
import DoctorServices from './components/DoctorServices';
import LandingPage from './components/LandingPage';
import DoctorPanel from './components/DoctorPanel';
import EducatorPanel from './components/EducatorPanel';
function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/tiffin" element={<TiffinServices />} />
        <Route path="/doctor" element={<DoctorServices />} />
        <Route path="/doctorpanel" element={<DoctorPanel />} />
        <Route path="/educatorpanel" element={<EducatorPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
