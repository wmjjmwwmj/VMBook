import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import JournalListView from './pages/JournalListView/JournalListView';
import UserPhotoGallery from './pages/UserPhotoGallery/UserPhotoGallery';
import JournalView from './pages/JournalView/JournalView';

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/journals" element={<JournalListView/> } />
      <Route path="/gallery" element={<UserPhotoGallery/> } />
      <Route path="/journalview" element={<JournalView/> } />
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  </Router>
);

export default App;