import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import UserPhotoGallery from './pages/UserPhotoGallery';  

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Gallery" element={<UserPhotoGallery />} />
      
    </Routes>
  </Router>
);

export default App;