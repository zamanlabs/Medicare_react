import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.scss'; // Use SCSS styles
import Layout from './components/Layout'; // Import the Layout component
import { SymptomProvider } from './context/SymptomContext'; // Import the provider
import { MedicationProvider } from './context/MedicationContext'; // Import MedicationProvider
import { HospitalLocationProvider } from './context/HospitalLocationContext'; // Import HospitalLocationProvider
import { UserProfileProvider } from './context/UserProfileContext'; // Import UserProfileProvider

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
      <SymptomProvider> {/* Wrap with SymptomProvider */}
        <MedicationProvider> {/* Wrap with MedicationProvider */}
          <HospitalLocationProvider> {/* Wrap with HospitalLocationProvider */}
            <UserProfileProvider> {/* Wrap with UserProfileProvider */}
              <Layout> {/* Wrap the routes with the Layout component */}
                <Routes>
                  {/* Define routes */}
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/symptom-tracker" element={<SymptomTracker />} />
                  <Route path="/medication" element={<Medication />} />
                  <Route path="/telemedicine" element={<Telemedicine />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/emergency-services" element={<EmergencyServices />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/profile" element={<Profile />} />
                  
                  {/* Redirect old routes to the new merged page */}
                  <Route path="/emergency" element={<EmergencyServices />} />
                  <Route path="/healthcare-locations" element={<EmergencyServices />} />
                  {/* Add a fallback/404 route later */}
                </Routes>
              </Layout>
            </UserProfileProvider>
          </HospitalLocationProvider>
        </MedicationProvider>
      </SymptomProvider>
    </Router>
  );
}

export default App;
