import React, { useState } from 'react';
import {
  EarthquakeSwitcherBar,
  EarthquakeViewMode,
  Language,
} from './EarthquakeSwitcherBar';
import {
  StructuralConfiguratorView,
  StructuralProjectItem,
} from './StructuralConfiguratorView';
import { SeismicCommandCenterView } from './SeismicCommandCenterView';
import { RebarDetailingView } from './RebarDetailingView';
import { SeismicInput, SeismicAnalysisResult } from './is1893Calculator';

const INITIAL_PROJECTS: StructuralProjectItem[] = [
  {
    id: 'pr-1',
    code: '#STR-1024',
    title: 'G+8 Apex Lifeline Healthcare Facility',
    city: 'Delhi NCR',
    zone: 'Zone IV',
    soil: 'Type II (Medium Stiff)',
    system: 'SMRF Frame (R=5.0)',
    status: 'IS 13920 COMPLIANT',
    baseShearVb: 809,
    timePeriodTa: 0.87,
    ah: 0.0562,
    details: 'Critical lifeline hospital structure with 135° seismic hoops in plastic hinge zones.',
  },
  {
    id: 'pr-2',
    code: '#STR-1019',
    title: 'G+4 Residential Block with Stilt Parking',
    city: 'Ahmedabad',
    zone: 'Zone III',
    soil: 'Type III (Soft Alluvium)',
    system: 'OMRF Frame (R=3.0)',
    status: 'NEEDS RETROFIT',
    baseShearVb: 540,
    timePeriodTa: 0.58,
    ah: 0.048,
    details: 'Soft-storey irregularity detected at ground level. RC shear walls recommended.',
  },
  {
    id: 'pr-3',
    code: '#STR-1015',
    title: 'G+12 Commercial Core Tower',
    city: 'Guwahati',
    zone: 'Zone V',
    soil: 'Type II (Stiff Silt)',
    system: 'Dual System with RC Shear Walls (R=5.0)',
    status: 'VERIFIED',
    baseShearVb: 1324,
    timePeriodTa: 1.18,
    ah: 0.0613,
    details: 'Dual system lateral force resisting core verified for Zone V severe seismic demands.',
  },
];

export const EarthquakeApp: React.FC = () => {
  const [viewMode, setViewMode] = useState<EarthquakeViewMode>('configurator');
  const [language, setLanguage] = useState<Language>('en');
  const [projects, setProjects] = useState<StructuralProjectItem[]>(INITIAL_PROJECTS);

  const handleAddProject = (data: {
    title: string;
    city: string;
    input: SeismicInput;
    result: SeismicAnalysisResult;
  }) => {
    const codeNum = 1025 + projects.length;
    const newCode = `#STR-${codeNum}`;

    const newProject: StructuralProjectItem = {
      id: `pr-${Date.now()}`,
      code: newCode,
      title: data.title,
      city: data.city,
      zone: `Zone ${data.input.seismicZone}`,
      soil: `Type ${data.input.soilType} Soil`,
      system: `${data.input.structureType} (R=${data.result.responseReductionR})`,
      status: 'IS 13920 COMPLIANT',
      baseShearVb: data.result.designBaseShearVb,
      timePeriodTa: data.result.timePeriodTa,
      ah: data.result.seismicCoefficientAh,
      details: data.result.ductilityRecommendation,
    };

    setProjects((prev) => [newProject, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f4ee]">
      {/* Top Demo Bar for Hackathon judges & view switching */}
      <EarthquakeSwitcherBar
        currentView={viewMode}
        onViewChange={setViewMode}
        language={language}
        onLanguageChange={setLanguage}
      />

      {/* View 1: Design Configurator Portal */}
      {viewMode === 'configurator' && (
        <StructuralConfiguratorView
          projects={projects}
          onAddProject={handleAddProject}
          language={language}
          onLanguageChange={setLanguage}
          onNavigateToDetailing={() => setViewMode('detailing')}
        />
      )}

      {/* View 2: Regional Seismic Intelligence Desk */}
      {viewMode === 'intelligence' && (
        <SeismicCommandCenterView
          language={language}
          onLanguageChange={setLanguage}
          onNavigateToDetailing={() => setViewMode('detailing')}
        />
      )}

      {/* View 3: Rebar & Ductility Desk */}
      {viewMode === 'detailing' && (
        <RebarDetailingView
          language={language}
          onLanguageChange={setLanguage}
        />
      )}
    </div>
  );
};
