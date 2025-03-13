import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Landing from './components/Landing/Landing';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import Dashboard from './components/Dashboard/Dashboard';
import Itinerary from './components/Itinerary/Itinerary';
import Destination from './components/Destination/Destination';
import './App.css'

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/itinerary/:itineraryId" element={<Itinerary />} />
        <Route path="/destination/:destinationId" element={<Destination />} />
      </Routes>
    </Router>
  )
}

export default App
