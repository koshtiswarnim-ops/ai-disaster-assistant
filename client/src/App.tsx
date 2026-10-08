import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DisasterProvider } from './context/DisasterContext';
import { NotificationToast } from './components/layout/NotificationToast';
import { NagarMitraApp } from './components/nagarmitra/NagarMitraApp';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <DisasterProvider>
          <div className="min-h-screen bg-[#f7f4ee] text-stone-900 font-sans antialiased selection:bg-stone-900 selection:text-white">
            <Routes>
              {/* Primary Streamlined NagarMitra Application (Citizen, Civic Command, Field Operations) */}
              <Route path="/" element={<NagarMitraApp />} />
              <Route path="/portal" element={<NagarMitraApp />} />
              <Route path="/citizen" element={<NagarMitraApp />} />
              <Route path="/command-center" element={<NagarMitraApp />} />
              <Route path="/field" element={<NagarMitraApp />} />
              <Route path="/sos" element={<NagarMitraApp />} />
              <Route path="/incidents" element={<NagarMitraApp />} />

              {/* Any other link redirects straight to NagarMitra */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <NotificationToast />
          </div>
        </DisasterProvider>
      </AuthProvider>
    </Router>
  );
}
