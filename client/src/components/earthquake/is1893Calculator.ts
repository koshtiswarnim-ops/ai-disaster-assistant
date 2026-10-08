// IS 1893:2016 (Part 1) Structural & Seismic Calculations Engine

export interface SeismicInput {
  city: string;
  seismicZone: 'II' | 'III' | 'IV' | 'V';
  soilType: 'I' | 'II' | 'III'; // I: Rock, II: Medium, III: Soft
  buildingHeightMeters: number; // h in meters
  floorsCount: number; // G+N
  structureType: 'SMRF' | 'OMRF' | 'SHEAR_WALL';
  importanceCategory: 'RESIDENTIAL' | 'COMMERCIAL_LARGE' | 'LIFELINE'; // 1.0, 1.2, 1.5
  totalSeismicWeightKN?: number; // W in kN
}

export interface SeismicAnalysisResult {
  zoneFactorZ: number;
  importanceFactorI: number;
  responseReductionR: number;
  timePeriodTa: number; // in seconds
  spectralAccelerationSa_g: number;
  seismicCoefficientAh: number;
  totalSeismicWeightW: number; // in kN
  designBaseShearVb: number; // in kN
  soilDescription: string;
  ductilityRecommendation: string;
  rebarGuidelines: {
    minBeamSteel: string;
    maxBeamSteel: string;
    confinementSpacing: string;
    lapSpliceRule: string;
    strongColumnWeakBeam: string;
  };
}

export const CITIES_SEISMIC_DB: Record<string, { zone: 'II' | 'III' | 'IV' | 'V'; lat: number; lng: number; defaultSoil: 'I' | 'II' | 'III' }> = {
  'Delhi NCR': { zone: 'IV', lat: 28.6139, lng: 77.2090, defaultSoil: 'II' },
  'Mumbai': { zone: 'III', lat: 19.0760, lng: 72.8777, defaultSoil: 'II' },
  'Kolkata': { zone: 'III', lat: 22.5726, lng: 88.3639, defaultSoil: 'III' },
  'Chennai': { zone: 'III', lat: 13.0827, lng: 80.2707, defaultSoil: 'II' },
  'Bengaluru': { zone: 'II', lat: 12.9716, lng: 77.5946, defaultSoil: 'I' },
  'Hyderabad': { zone: 'II', lat: 17.3850, lng: 78.4867, defaultSoil: 'I' },
  'Guwahati': { zone: 'V', lat: 26.1445, lng: 91.7362, defaultSoil: 'II' },
  'Srinagar': { zone: 'V', lat: 34.0837, lng: 74.7973, defaultSoil: 'II' },
  'Bhuj (Kutch)': { zone: 'V', lat: 23.2420, lng: 69.6669, defaultSoil: 'II' },
  'Patna': { zone: 'IV', lat: 25.5941, lng: 85.1376, defaultSoil: 'III' },
  'Ahmedabad': { zone: 'III', lat: 23.0225, lng: 72.5714, defaultSoil: 'II' },
  'Shimla': { zone: 'IV', lat: 31.1048, lng: 77.1734, defaultSoil: 'I' },
};

export function calculateIS1893(input: SeismicInput): SeismicAnalysisResult {
  // 1. Zone Factor (Table 3, IS 1893:2016 Part 1)
  const zoneMap: Record<string, number> = {
    'II': 0.10,
    'III': 0.16,
    'IV': 0.24,
    'V': 0.36
  };
  const Z = zoneMap[input.seismicZone] || 0.24;

  // 2. Importance Factor (Table 8)
  let I = 1.0;
  if (input.importanceCategory === 'LIFELINE') I = 1.5; // Hospitals, schools, fire stations
  else if (input.importanceCategory === 'COMMERCIAL_LARGE') I = 1.2; // Buildings > 200 persons

  // 3. Response Reduction Factor (Table 9)
  let R = 5.0; // SMRF (Special Moment Resisting Frame)
  if (input.structureType === 'OMRF') R = 3.0;
  else if (input.structureType === 'SHEAR_WALL') R = 5.0; // RC structural wall system

  // 4. Fundamental Natural Period Ta (Clause 6.4.2)
  // For bare RC moment frame: Ta = 0.075 * h^0.75
  const h = input.buildingHeightMeters || (input.floorsCount * 3.2);
  const Ta = Number((0.075 * Math.pow(h, 0.75)).toFixed(3));

  // 5. Spectral Acceleration Coefficient Sa/g (Clause 6.4.2)
  let Sa_g = 2.5;
  if (input.soilType === 'I') {
    // Type I: Rock or Hard Soil
    if (Ta <= 0.10) Sa_g = 1 + 15 * Ta;
    else if (Ta <= 0.40) Sa_g = 2.50;
    else Sa_g = Math.min(2.5, 1.00 / Ta);
  } else if (input.soilType === 'II') {
    // Type II: Medium Soil
    if (Ta <= 0.10) Sa_g = 1 + 15 * Ta;
    else if (Ta <= 0.55) Sa_g = 2.50;
    else Sa_g = Math.min(2.5, 1.36 / Ta);
  } else {
    // Type III: Soft Soil
    if (Ta <= 0.10) Sa_g = 1 + 15 * Ta;
    else if (Ta <= 0.67) Sa_g = 2.50;
    else Sa_g = Math.min(2.5, 1.67 / Ta);
  }
  Sa_g = Number(Sa_g.toFixed(3));

  // 6. Design Horizontal Seismic Coefficient Ah (Clause 6.4.2)
  // Ah = (Z / 2) * (I / R) * (Sa / g)
  let Ah = (Z / 2) * (I / R) * Sa_g;
  // Code minimum check: Ah shall not be less than Z/2 * I / R * 0.7 for zone checks
  Ah = Number(Math.max(Ah, 0.02).toFixed(4));

  // 7. Total Seismic Weight & Design Base Shear Vb = Ah * W
  const defaultW = Math.round(input.floorsCount * 1800); // approx 1800 kN per floor
  const W = input.totalSeismicWeightKN || defaultW;
  const Vb = Math.round(Ah * W);

  // Soil details
  const soilDescMap = {
    'I': 'Rock or Hard Strata (N > 30, Vs > 300 m/s)',
    'II': 'Medium / Stiff Soil (10 <= N <= 30, Vs = 150-300 m/s)',
    'III': 'Soft Soil (N < 10, Vs < 150 m/s, High Resonance Risk)'
  };

  // Rebar & Ductile Detailing Provisions (IS 13920:2016)
  const isHighSeismic = input.seismicZone === 'IV' || input.seismicZone === 'V';
  const confinement = isHighSeismic
    ? 'Close-spaced 135° seismic links @ 75mm c/c with 10d extension in plastic hinge zone'
    : 'Standard rectangular ties @ 100mm c/c in critical zone';

  return {
    zoneFactorZ: Z,
    importanceFactorI: I,
    responseReductionR: R,
    timePeriodTa: Ta,
    spectralAccelerationSa_g: Sa_g,
    seismicCoefficientAh: Ah,
    totalSeismicWeightW: W,
    designBaseShearVb: Vb,
    soilDescription: soilDescMap[input.soilType],
    ductilityRecommendation: isHighSeismic
      ? 'MANDATORY IS 13920 DUCTILE DETAILING: SMRF frame with strong-column weak-beam ratio >= 1.4 is compulsory.'
      : 'Standard OMRF ductile detailing permitted per IS 456, SMRF recommended for long spans.',
    rebarGuidelines: {
      minBeamSteel: 'Minimum tension steel ratio: pt,min = 0.24 * sqrt(fck) / fy (~0.28% for Fe500)',
      maxBeamSteel: 'Maximum tension steel: 2.5% to avoid brittle rebar congestion',
      confinementSpacing: confinement,
      lapSpliceRule: 'No lap splices within beam-column joints or within 2d from column face; mechanical couplers recommended',
      strongColumnWeakBeam: 'Sum of column flexural strength >= 1.4 * Sum of beam flexural strength at all beam-column joints'
    }
  };
}
