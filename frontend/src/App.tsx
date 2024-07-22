import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import JournalListView from './pages/JournalListView/JournalListView';

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/journals" element={<JournalListView/> } />
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  </Router>
);

export default App;