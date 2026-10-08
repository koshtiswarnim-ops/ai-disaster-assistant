import React from 'react';
import { Layers, Activity, FileSpreadsheet, Compass } from 'lucide-react';

export type EarthquakeViewMode = 'configurator' | 'intelligence' | 'detailing';
export type Language = 'en' | 'hi';

interface EarthquakeSwitcherBarProps {
  currentView: EarthquakeViewMode;
  onViewChange: (view: EarthquakeViewMode) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const EarthquakeSwitcherBar: React.FC<EarthquakeSwitcherBarProps> = ({
  currentView,
  onViewChange,
  language,
  onLanguageChange,
}) => {
  return (
    <header className="bg-[#1c1917] text-stone-200 border-b border-stone-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs z-50 sticky top-0 shadow-md">
      {/* Brand Badge */}
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 font-black flex items-center justify-center text-[11px] shadow-sm">
          EQ
        </span>
        <span className="font-bold tracking-tight text-white text-sm">SeismicConfigurator</span>
        <span className="hidden sm:inline-block text-[11px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded-full border border-stone-700 font-mono">
          IS 1893:2016 • AI Structural Engine
        </span>
      </div>

      {/* View Switcher Pills */}
      <div className="flex items-center bg-stone-900 p-1 rounded-xl border border-stone-800 gap-1">
        <button
          onClick={() => onViewChange('configurator')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
            currentView === 'configurator'
              ? 'bg-stone-100 text-stone-900 shadow-sm'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Design Configurator</span>
          <span className="text-[10px] opacity-75 hidden md:inline">(Er. Ananya)</span>
        </button>

        <button
          onClick={() => onViewChange('intelligence')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
            currentView === 'intelligence'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Regional Seismic Intel</span>
          <span className="text-[10px] opacity-75 hidden md:inline">(IS 1893 Authority)</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5"></span>
        </button>

        <button
          onClick={() => onViewChange('detailing')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
            currentView === 'detailing'
              ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Rebar & Ductility Desk</span>
          <span className="text-[10px] opacity-75 hidden md:inline">(Er. Rajesh)</span>
        </button>
      </div>

      {/* Language Toggle */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-stone-900 border border-stone-800 rounded-lg p-0.5">
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
              language === 'en' ? 'bg-stone-700 text-white' : 'text-stone-400 hover:text-white'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => onLanguageChange('hi')}
            className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
              language === 'hi' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'
            }`}
          >
            हिंदी
          </button>
        </div>
      </div>
    </header>
  );
};
