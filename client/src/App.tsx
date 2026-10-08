import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DisasterProvider } from './context/DisasterContext';
import { NotificationToast } from './components/layout/NotificationToast';
import { EarthquakeApp } from './components/earthquake/EarthquakeApp';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <DisasterProvider>
          <div className="min-h-screen bg-[#f7f4ee] text-stone-900 font-sans antialiased selection:bg-stone-900 selection:text-white">
            <Routes>
              {/* Primary Earthquake Resistant Design Configurator (IS 1893:2016) */}
              <Route path="/" element={<EarthquakeApp />} />
              <Route path="/configurator" element={<EarthquakeApp />} />
              <Route path="/seismic" element={<EarthquakeApp />} />
              <Route path="/rebar" element={<EarthquakeApp />} />
              <Route path="/audit" element={<EarthquakeApp />} />
              <Route path="/command-center" element={<EarthquakeApp />} />

              {/* Any other link redirects straight to EarthquakeApp */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <NotificationToast />
          </div>
        </DisasterProvider>
      </AuthProvider>
    </Router>
  );
}
