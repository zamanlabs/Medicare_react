import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './index.scss'; // Use SCSS styles
import Layout from './components/Layout'; // Import the Layout component
import { SymptomProvider } from './context/SymptomContext'; // Import the provider
import { MedicationProvider } from './context/MedicationContext'; // Import MedicationProvider
import { HospitalLocationProvider } from './context/HospitalLocationContext'; // Import HospitalLocationProvider
import { UserProfileProvider } from './context/UserProfileContext'; // Import UserProfileProvider
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
// Import our AI response enhancer
import './scripts/aiResponseEnhancer';

// Import Page components
import Dashboard from './pages/Dashboard'; // Import the Dashboard component
import SymptomTracker from './pages/SymptomTracker'; // Import SymptomTracker
import Medication from './pages/Medication'; // Import Medication
import Telemedicine from './pages/Telemedicine'; // Import Telemedicine
import Contact from './pages/Contact'; // Import Contact
import EmergencyServices from './pages/EmergencyServices'; // Import the merged EmergencyServices component
import Chat from './pages/Chat'; // Import Chat
import Auth from './pages/Auth'; // Import Auth placeholder
import About from './pages/About'; // Import About placeholder
import Profile from './pages/Profile'; // Import Profile placeholder

function App() {
  return (
    <Router>
      <AuthProvider> {/* Wrap everything with AuthProvider */}
        <SymptomProvider>
          <MedicationProvider>
            <HospitalLocationProvider>
              <UserProfileProvider>
                <Routes>
                  {/* Public routes rendered without Layout */}
                  <Route path="/auth" element={<Auth />} />
                  
                  {/* All other routes wrapped in Layout */}
                  <Route element={<Layout />}>
                    <Route path="/about" element={<About />} />
                    
                    {/* Protected routes */}
                    <Route element={<ProtectedRoute />}>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/symptom-tracker" element={<SymptomTracker />} />
                      <Route path="/medication" element={<Medication />} />
                      <Route path="/telemedicine" element={<Telemedicine />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/emergency-services" element={<EmergencyServices />} />
                      <Route path="/chat" element={<Chat />} />
                      <Route path="/profile" element={<Profile />} />
                      
                      {/* Redirect old routes to the new merged page */}
                      <Route path="/emergency" element={<EmergencyServices />} />
                      <Route path="/healthcare-locations" element={<EmergencyServices />} />
                    </Route>
                  </Route>
                  
                  {/* 404 route - catch all unmatched routes */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </UserProfileProvider>
            </HospitalLocationProvider>
          </MedicationProvider>
        </SymptomProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
