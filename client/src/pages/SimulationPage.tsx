import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { HeaderBand } from '../components/layout/HeaderBand';
import { api } from '../services/api';
import { Sliders, Play, Square, Sparkles, AlertTriangle, ArrowRight, ShieldCheck, Activity, Layers, CheckCircle2 } from 'lucide-react';

export const SimulationPage: React.FC = () => {
  const { startSimulationCascade, refreshData } = useDisaster();

  // What-If State
  const [selectedScenario, setSelectedScenario] = useState<string>('hospital_down');
  const [whatIfResult, setWhatIfResult] = useState<any>(null);
  const [loadingWhatIf, setLoadingWhatIf] = useState<boolean>(false);

  // Live Flood Simulation State
  const [isSimRunning, setIsSimRunning] = useState<boolean>(false);
  const [simStep, setSimStep] = useState<number>(0);
  const [simLog, setSimLog] = useState<string[]>([]);

  const handleRunWhatIf = async () => {
    setLoadingWhatIf(true);
    try {
      const res = await api.getWhatIf(selectedScenario);
      setWhatIfResult(res);
    } catch (e: any) {
      alert(`Simulation error: ${e.message}`);
    } finally {
      setLoadingWhatIf(false);
    }
  };

  const handleStartCascade = async () => {
    setIsSimRunning(true);
    setSimStep(1);
    setSimLog(['[00:00] Initializing Atmospheric River Category 3 Flood Cascade...']);
    
    try {
      await startSimulationCascade();
      
      // Step simulator for UI telemetry
      const logSteps = [
        '[00:04] Atmospheric storm surge inundates Waterfront Basin; Evacuation order triggered.',
        '[00:09] Cluster of 3 high-water Citizen SOS signals registered and prioritized.',
        '[00:13] Cesar Chavez arterial flooded (4ft standing water); Emergency route diverted.',
        '[00:18] AI recommends dynamic reallocation of Swiftwater Taskforce Alpha.',
        '[00:22] Central Warehouse dispatches 150 water jugs and 50 trauma packs.',
        '[00:27] Field rescue completed; 4 trapped seniors transferred to Civic Center Safe Haven.'
      ];

      logSteps.forEach((msg, idx) => {
        setTimeout(() => {
          setSimStep(idx + 1);
          setSimLog((prev) => [msg, ...prev]);
          if (idx === logSteps.length - 1) {
            setIsSimRunning(false);
          }
        }, (idx + 1) * 4500);
      });

    } catch (e: any) {
      alert(`Simulation cascade error: ${e.message}`);
      setIsSimRunning(false);
    }
  };

  const handleStopCascade = async () => {
    try {
      await api.stopSimulation();
      setIsSimRunning(false);
      setSimLog(prev => ['[STOPPED] Simulation cascade terminated by operator.', ...prev]);
    } catch (e: any) {
      console.warn(e);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col pb-12">
      <HeaderBand
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Twin Intelligence' },
          { label: 'Digital Twin Simulation' }
        ]}
        title="DisasterOS Digital Twin & What-If Simulation Engine"
        description="Test emergency response strategies and evaluate cascading multi-agency impacts before executing real-world dispatches."
        statusText="Simulation Sandboxed (No Live Production State Mutation)"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full mt-6 space-y-6">

        {/* Section 1: Catastrophic Event Cascade Runner */}
        <div className="bg-slate-900 text-slate-100 rounded border border-slate-800 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-slate-700 bg-slate-800 text-slate-300 text-[10.5px] font-mono uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3 text-slate-400" />
                Scenario Stress Test Simulator
              </div>
              <h2 className="text-lg font-bold tracking-tight text-white font-sans">
                Category 3 Atmospheric River Flood Cascade
              </h2>
              <p className="text-xs text-slate-400 max-w-2xl mt-0.5 font-normal">
                Executes a 6-phase cascading telemetry stream to evaluate multi-agency system response, autonomous rerouting, and dynamic capacity reallocation in real time.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!isSimRunning ? (
                <button
                  onClick={handleStartCascade}
                  className="px-4 py-2 rounded bg-white hover:bg-slate-100 text-slate-900 font-medium text-xs flex items-center gap-2 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-900 text-slate-900" />
                  <span>Execute Cascade Simulation</span>
                </button>
              ) : (
                <button
                  onClick={handleStopCascade}
                  className="px-4 py-2 rounded bg-rose-700 hover:bg-rose-600 text-white font-medium text-xs flex items-center gap-2 transition-colors"
                >
                  <Square className="w-3.5 h-3.5 fill-white" />
                  <span>Halt Cascade</span>
                </button>
              )}
            </div>
          </div>

          {/* Stepper indicator */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2">
            {[
              "1. Flood Surge",
              "2. SOS Ingress",
              "3. Road Blocked",
              "4. AI Reallocation",
              "5. Depot Dispatch",
              "6. Evacuee Sheltered"
            ].map((label, idx) => {
              const active = isSimRunning && simStep >= idx + 1;
              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded border text-center font-mono text-[11px] transition-colors ${
                    active
                      ? 'border-white bg-white/10 text-white font-semibold'
                      : 'border-slate-800 bg-slate-950 text-slate-500'
                  }`}
                >
                  <span className="block">{label}</span>
                </div>
              );
            })}
          </div>

          {/* Live telemetry terminal log */}
          {simLog.length > 0 && (
            <div className="mt-4 p-3 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 max-h-36 overflow-y-auto space-y-1">
              {simLog.map((log, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-slate-500">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: What-If Sandbox Scenario Analysis */}
        <div className="bg-white border border-slate-200 p-6 rounded">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                What-If Sandbox Scenario Analysis
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400 uppercase">Production Isolated</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            {[
              {
                id: 'hospital_down',
                title: 'Hospital Offline / ICU Blackout',
                desc: 'Simulate complete closure of Metropolitan General Trauma Center.'
              },
              {
                id: 'main_arterial_blocked',
                title: 'Highway 101 Submerged',
                desc: 'Simulate loss of main transit corridor connecting supply depot and waterfront.'
              },
              {
                id: 'storm_intensification',
                title: '+50mm/hr Rain Spike',
                desc: 'Simulate severe atmospheric surge with 8 emergent flood incidents and 350 evacuees.'
              }
            ].map(sc => (
              <div
                key={sc.id}
                onClick={() => setSelectedScenario(sc.id)}
                className={`p-4 rounded border cursor-pointer transition-colors ${
                  selectedScenario === sc.id
                    ? 'border-slate-900 ring-1 ring-slate-900 bg-slate-50/60'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <h4 className="font-semibold text-xs text-slate-900">{sc.title}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{sc.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              Evaluates multi-agency ripple effects across beds, shelters, and travel times.
            </span>
            <button
              onClick={handleRunWhatIf}
              disabled={loadingWhatIf}
              className="px-4 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-400" />
              <span>{loadingWhatIf ? 'Computing Ripple Effects...' : 'Run What-If Analysis'}</span>
            </button>
          </div>

          {/* What-If Output Panel */}
          {whatIfResult && (
            <div className="mt-6 p-5 rounded border border-slate-200 bg-slate-50 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs font-mono font-semibold text-slate-900 uppercase tracking-wider">
                  Scenario Impact Assessment: {whatIfResult.scenario}
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {new Date(whatIfResult.timestamp).toLocaleTimeString()}
                </span>
              </div>

              {/* Baseline vs Simulated state */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-white rounded border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase">Free Standard Beds</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-slate-400 line-through">{whatIfResult.baseline.availableBeds}</span>
                    <span className="text-base font-bold text-rose-700">{whatIfResult.simulatedState.availableBeds}</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase">Free ICU Beds</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-slate-400 line-through">{whatIfResult.baseline.availableIcu}</span>
                    <span className="text-base font-bold text-rose-700">{whatIfResult.simulatedState.availableIcu}</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase">Free Shelter Capacity</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-slate-400 line-through">{whatIfResult.baseline.openShelterCapacity}</span>
                    <span className="text-base font-bold text-slate-900">{whatIfResult.simulatedState.openShelterCapacity}</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase">Active Incidents</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-slate-400 line-through">{whatIfResult.baseline.activeIncidents}</span>
                    <span className="text-base font-bold text-slate-900">{whatIfResult.simulatedState.activeIncidents}</span>
                  </div>
                </div>
              </div>

              {/* Impact Narrative */}
              <div className="p-4 rounded border border-slate-200 bg-white space-y-1.5">
                <h4 className="text-[11px] font-mono font-medium text-slate-500 uppercase tracking-wider">
                  Multi-Factor Impact Analysis
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  {whatIfResult.impactSummary}
                </p>
              </div>

              {/* Recommended Mitigation Protocol */}
              <div className="p-4 rounded border border-slate-200 bg-white space-y-2">
                <span className="text-[11px] font-mono font-medium text-slate-500 uppercase tracking-wider block">
                  AI Recommended Strategic Mitigations:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-800 font-mono">
                  {whatIfResult.recommendedMitigation.map((m: string, i: number) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
