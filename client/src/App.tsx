import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DisasterProvider } from './context/DisasterContext';
import { Navbar } from './components/layout/Navbar';
import { LiveTickerBar } from './components/layout/LiveTickerBar';
import { RoleWorkspaceBanner } from './components/layout/RoleWorkspaceBanner';
import { NotificationToast } from './components/layout/NotificationToast';

// Pages
import { LandingPage } from './pages/LandingPage';
import { CommandCenterPage } from './pages/CommandCenterPage';
import { LiveMapPage } from './pages/LiveMapPage';
import { CitizenSOSPage } from './pages/CitizenSOSPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { SmartAllocationPage } from './pages/SmartAllocationPage';
import { WarehousesPage } from './pages/WarehousesPage';
import { LogisticsFleetPage } from './pages/LogisticsFleetPage';
import { HospitalsPage } from './pages/HospitalsPage';
import { SheltersPage } from './pages/SheltersPage';
import { RescueTeamsPage } from './pages/RescueTeamsPage';
import { HazardRoutesPage } from './pages/HazardRoutesPage';
import { NgoVolunteersPage } from './pages/NgoVolunteersPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { RiskAnalysisPage } from './pages/RiskAnalysisPage';
import { SimulationPage } from './pages/SimulationPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { AlertsBroadcastPage } from './pages/AlertsBroadcastPage';
import { WorkspaceSettingsPage } from './pages/WorkspaceSettingsPage';
import { LoginPage } from './pages/LoginPage';

// Animated Routes wrapper for smooth page transitions
const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <div key={location.pathname} className="flex-1 flex flex-col animate-page-enter">
      <Routes location={location}>
        {/* Public & Landing */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<LoginPage />} />

        {/* Command & Operations */}
        <Route path="/dashboard" element={<Navigate to="/command-center" replace />} />
        <Route path="/command-center" element={<CommandCenterPage />} />
        <Route path="/map" element={<LiveMapPage />} />
        <Route path="/incidents" element={<IncidentsPage />} />
        <Route path="/incidents/:id" element={<IncidentsPage />} />
        <Route path="/sos" element={<CitizenSOSPage />} />

        {/* Resource Allocation & Depots */}
        <Route path="/resources" element={<SmartAllocationPage />} />
        <Route path="/allocation" element={<SmartAllocationPage />} />
        <Route path="/warehouses" element={<WarehousesPage />} />
        <Route path="/inventory" element={<WarehousesPage />} />

        {/* Fleet & Responders */}
        <Route path="/vehicles" element={<LogisticsFleetPage />} />
        <Route path="/logistics" element={<LogisticsFleetPage />} />
        <Route path="/routes" element={<HazardRoutesPage />} />
        <Route path="/rescue-teams" element={<RescueTeamsPage />} />

        {/* Care & Refuge Facilities */}
        <Route path="/hospitals" element={<HospitalsPage />} />
        <Route path="/shelters" element={<SheltersPage />} />
        <Route path="/evacuation" element={<SheltersPage />} />
        <Route path="/ngos" element={<NgoVolunteersPage />} />
        <Route path="/volunteers" element={<NgoVolunteersPage />} />

        {/* Communications & AI */}
        <Route path="/alerts" element={<AlertsBroadcastPage />} />
        <Route path="/ai-assistant" element={<AIAssistantPage />} />
        <Route path="/risk-analysis" element={<RiskAnalysisPage />} />
        <Route path="/simulation" element={<SimulationPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/audit-logs" element={<AuditLogsPage />} />

        {/* Workspace Settings */}
        <Route path="/settings" element={<WorkspaceSettingsPage />} />
        <Route path="/profile" element={<WorkspaceSettingsPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <DisasterProvider>
          <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans antialiased selection:bg-slate-900 selection:text-white">
            <Navbar />
            <LiveTickerBar />
            <RoleWorkspaceBanner />
            <main className="flex-1 flex flex-col relative overflow-hidden">
              <AnimatedRoutes />
            </main>
            <NotificationToast />
          </div>
        </DisasterProvider>
      </AuthProvider>
    </Router>
  );
}
