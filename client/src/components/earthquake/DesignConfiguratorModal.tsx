import React, { useState } from 'react';
import { X, Building2, MapPin, Calculator, CheckCircle2, ShieldCheck, Info } from 'lucide-react';
import { Language } from './EarthquakeSwitcherBar';
import {
  CITIES_SEISMIC_DB,
  calculateIS1893,
  SeismicInput,
  SeismicAnalysisResult,
} from './is1893Calculator';

interface DesignConfiguratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: {
    title: string;
    city: string;
    input: SeismicInput;
    result: SeismicAnalysisResult;
  }) => void;
  language: Language;
}

export const DesignConfiguratorModal: React.FC<DesignConfiguratorModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  language,
}) => {
  const [title, setTitle] = useState('G+8 Apex Healthcare Facility');
  const [city, setCity] = useState('Delhi NCR');
  const [soilType, setSoilType] = useState<'I' | 'II' | 'III'>('II');
  const [floors, setFloors] = useState(8);
  const [structureType, setStructureType] = useState<'SMRF' | 'OMRF' | 'SHEAR_WALL'>('SMRF');
  const [importance, setImportance] = useState<'RESIDENTIAL' | 'COMMERCIAL_LARGE' | 'LIFELINE'>('LIFELINE');
  const [analysisResult, setAnalysisResult] = useState<SeismicAnalysisResult | null>(null);

  if (!isOpen) return null;

  const currentCityData = CITIES_SEISMIC_DB[city] || { zone: 'IV', defaultSoil: 'II' };

  const handleCompute = (e: React.FormEvent) => {
    e.preventDefault();
    const input: SeismicInput = {
      city,
      seismicZone: currentCityData.zone,
      soilType,
      floorsCount: floors,
      buildingHeightMeters: floors * 3.3,
      structureType,
      importanceCategory: importance,
    };

    const res = calculateIS1893(input);
    setAnalysisResult(res);
  };

  const handleSaveProject = () => {
    if (!analysisResult) return;
    const input: SeismicInput = {
      city,
      seismicZone: currentCityData.zone,
      soilType,
      floorsCount: floors,
      buildingHeightMeters: floors * 3.3,
      structureType,
      importanceCategory: importance,
    };
    onSubmit({
      title,
      city,
      input,
      result: analysisResult,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-scale-in">
      <div className="bg-[#fbf9f4] border border-stone-200 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white">
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-stone-500">
              IS 1893:2016 (PART 1) • SEISMIC DESIGN ENGINE
            </span>
            <h2 className="text-xl font-black text-stone-900 tracking-tight">
              {language === 'hi' ? 'भूकंप प्रतिरोधी संरचना कॉन्फ़िगर करें' : 'Configure Earthquake Resistant Structure'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          {!analysisResult ? (
            <form onSubmit={handleCompute} className="space-y-4">
              {/* Project Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Project Name / Structure Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>

              {/* Location & Auto-detected Zone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Location / City
                  </label>
                  <select
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      const d = CITIES_SEISMIC_DB[e.target.value];
                      if (d) setSoilType(d.defaultSoil);
                    }}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2.5 text-xs text-stone-900 font-semibold focus:outline-none focus:border-stone-900"
                  >
                    {Object.keys(CITIES_SEISMIC_DB).map((c) => (
                      <option key={c} value={c}>
                        {c} (Zone {CITIES_SEISMIC_DB[c].zone})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Seismic Zone (Auto-assigned per IS 1893)
                  </label>
                  <div className="bg-stone-100 border border-stone-200 rounded-xl px-3 py-2 text-xs flex items-center justify-between">
                    <span className="font-bold text-stone-900">Zone {currentCityData.zone}</span>
                    <span className="font-mono text-stone-600 font-semibold">
                      Z = {currentCityData.zone === 'V' ? '0.36' : currentCityData.zone === 'IV' ? '0.24' : currentCityData.zone === 'III' ? '0.16' : '0.10'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Soil Profile Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Geotechnical Soil Profile
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSoilType('I')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      soilType === 'I'
                        ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <span className="block font-bold text-xs">Type I: Rock</span>
                    <span className="text-[10px] opacity-80 font-mono">N &gt; 30, Hard</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSoilType('II')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      soilType === 'II'
                        ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <span className="block font-bold text-xs">Type II: Medium</span>
                    <span className="text-[10px] opacity-80 font-mono">10 &le; N &le; 30, Stiff</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSoilType('III')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      soilType === 'III'
                        ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <span className="block font-bold text-xs">Type III: Soft</span>
                    <span className="text-[10px] opacity-80 font-mono">N &lt; 10, Soft Clay</span>
                  </button>
                </div>
              </div>

              {/* Number of Storeys & Height */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Storeys: G + {floors} Floors
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="25"
                    value={floors}
                    onChange={(e) => setFloors(Number(e.target.value))}
                    className="w-full accent-stone-900 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-500 font-mono mt-0.5">
                    <span>G+2 (Low)</span>
                    <span>G+8 (Mid)</span>
                    <span>G+25 (High)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Structural Height (h)
                  </label>
                  <div className="bg-stone-100 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-stone-800">
                    {(floors * 3.3).toFixed(1)} meters
                  </div>
                </div>
              </div>

              {/* Structural Framing System (R factor) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Structural System (Response Reduction Factor R)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setStructureType('SMRF')}
                    className={`p-2 rounded-xl border text-xs font-bold text-left ${
                      structureType === 'SMRF'
                        ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-xs'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <span>SMRF (R=5.0)</span>
                    <span className="block text-[10px] font-normal opacity-85">IS 13920 Ductile Frame</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStructureType('SHEAR_WALL')}
                    className={`p-2 rounded-xl border text-xs font-bold text-left ${
                      structureType === 'SHEAR_WALL'
                        ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-xs'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <span>RC Shear Walls (R=5.0)</span>
                    <span className="block text-[10px] font-normal opacity-85">Dual Core Lateral System</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStructureType('OMRF')}
                    className={`p-2 rounded-xl border text-xs font-bold text-left ${
                      structureType === 'OMRF'
                        ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-xs'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <span>OMRF (R=3.0)</span>
                    <span className="block text-[10px] font-normal opacity-85">Zone II/III Normal Frame</span>
                  </button>
                </div>
              </div>

              {/* Importance Factor I */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Building Occupancy Importance (I)
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-stone-200 cursor-pointer">
                    <input
                      type="radio"
                      name="importance"
                      checked={importance === 'RESIDENTIAL'}
                      onChange={() => setImportance('RESIDENTIAL')}
                      className="accent-stone-900"
                    />
                    <span>Normal (I=1.0)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-stone-200 cursor-pointer">
                    <input
                      type="radio"
                      name="importance"
                      checked={importance === 'COMMERCIAL_LARGE'}
                      onChange={() => setImportance('COMMERCIAL_LARGE')}
                      className="accent-stone-900"
                    />
                    <span>Public &gt;200 (I=1.2)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-stone-200 cursor-pointer">
                    <input
                      type="radio"
                      name="importance"
                      checked={importance === 'LIFELINE'}
                      onChange={() => setImportance('LIFELINE')}
                      className="accent-stone-900"
                    />
                    <span className="font-bold text-rose-800">Hospital / Lifeline (I=1.5)</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#262320] hover:bg-stone-800 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
              >
                <Calculator className="w-4 h-4 text-amber-400" />
                <span>Calculate IS 1893 Seismic Parameters & Base Shear</span>
              </button>
            </form>
          ) : (
            /* Results Screen */
            <div className="space-y-4 animate-scale-in">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black text-sm text-emerald-950">
                    IS 1893:2016 Structural Design Solution Generated
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    {title} in <strong>{city}</strong> (Seismic Zone {currentCityData.zone}, {analysisResult.soilDescription})
                  </p>
                </div>
              </div>

              {/* Calculated Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="bg-white p-3 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 font-bold uppercase block">Zone Factor Z</span>
                  <span className="text-xl font-black text-stone-900 font-mono">{analysisResult.zoneFactorZ}</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 font-bold uppercase block">Period Ta</span>
                  <span className="text-xl font-black text-stone-900 font-mono">{analysisResult.timePeriodTa}s</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 font-bold uppercase block">Spectral Acc. Sa/g</span>
                  <span className="text-xl font-black text-stone-900 font-mono">{analysisResult.spectralAccelerationSa_g}</span>
                </div>

                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                  <span className="text-[10px] text-amber-800 font-bold uppercase block">Design Coeff Ah</span>
                  <span className="text-xl font-black text-amber-950 font-mono">{analysisResult.seismicCoefficientAh}</span>
                </div>
              </div>

              {/* Base Shear */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                    Design Lateral Base Shear (Vb = Ah × W)
                  </span>
                  <span className="text-lg font-black font-mono text-rose-700">
                    {analysisResult.designBaseShearVb.toLocaleString()} kN
                  </span>
                </div>
                <p className="text-[11px] text-stone-500">
                  Calculated against total effective seismic dead & live load weight of{' '}
                  <strong>{analysisResult.totalSeismicWeightW.toLocaleString()} kN</strong>.
                </p>
              </div>

              {/* Rebar Detailing Recommendations */}
              <div className="bg-[#faf8f3] p-4 rounded-2xl border border-stone-300/80 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>IS 13920 Preliminary Ductile Rebar Guidelines</span>
                </div>
                <div className="text-xs text-stone-700 space-y-1.5 font-medium leading-relaxed">
                  <p>• <strong>Confinement Links:</strong> {analysisResult.rebarGuidelines.confinementSpacing}</p>
                  <p>• <strong>Strong-Column Weak-Beam:</strong> {analysisResult.rebarGuidelines.strongColumnWeakBeam}</p>
                  <p>• <strong>Beam Longitudinal Reinforcement:</strong> {analysisResult.rebarGuidelines.minBeamSteel}</p>
                  <p>• <strong>Lap Splice Restrictions:</strong> {analysisResult.rebarGuidelines.lapSpliceRule}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveProject}
                  className="flex-1 bg-stone-900 hover:bg-stone-800 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Save Project to Active Workspace</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAnalysisResult(null)}
                  className="px-4 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold py-3 rounded-xl text-xs transition-colors"
                >
                  Recalculate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
