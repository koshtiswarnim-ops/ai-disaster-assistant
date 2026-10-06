// DisasterOS Realistic Operational Seed Data
export const seedDisasters = [
  {
    id: "dis-001",
    title: "Storm Zephyr & Coastal Flash Flooding",
    type: "flood",
    severity: "critical",
    status: "active",
    epicenter_lat: 37.7749,
    epicenter_lng: -122.4194,
    radius_km: 35.0,
    declared_at: new Date(Date.now() - 6 * 3600000).toISOString(),
    description: "Category 3 atmospheric river storm with severe storm surges, overflowing riverbanks, and localized landslides.",
    affected_population: 145000,
    weather_summary: "Heavy rainfall (42mm/hr), Wind gusts 68 km/h, Rising floodwaters"
  },
  {
    id: "dis-002",
    title: "Seismic Tremor & Structural Distress Zone",
    type: "earthquake",
    severity: "medium",
    status: "monitoring",
    epicenter_lat: 37.8044,
    epicenter_lng: -122.2712,
    radius_km: 18.0,
    declared_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    description: "Magnitude 4.8 seismic tremor with minor aftershocks affecting older commercial buildings and hillside roads.",
    affected_population: 62000,
    weather_summary: "Overcast, Mild winds"
  }
];

export const seedZones = [
  {
    id: "zone-a",
    disaster_id: "dis-001",
    name: "Zone A - Marina & Waterfront Basin",
    risk_level: "extreme",
    estimated_population: 34000,
    is_evacuation_ordered: true,
    coordinates: [
      [37.795, -122.435],
      [37.808, -122.410],
      [37.798, -122.390],
      [37.780, -122.420]
    ]
  },
  {
    id: "zone-b",
    disaster_id: "dis-001",
    name: "Zone B - Valley Industrial & Rail Corridor",
    risk_level: "high",
    estimated_population: 28000,
    is_evacuation_ordered: true,
    coordinates: [
      [37.760, -122.415],
      [37.770, -122.390],
      [37.745, -122.385],
      [37.740, -122.410]
    ]
  },
  {
    id: "zone-c",
    disaster_id: "dis-001",
    name: "Zone C - Highland Residential Slope",
    risk_level: "medium",
    estimated_population: 45000,
    is_evacuation_ordered: false,
    coordinates: [
      [37.755, -122.450],
      [37.775, -122.440],
      [37.765, -122.425],
      [37.745, -122.435]
    ]
  }
];

export const seedIncidents = [
  {
    id: "inc-101",
    tracking_code: "SOS-8491",
    type: "flood",
    title: "Family Trapped in Flooded Basement with Elderly Grandparent",
    description: "Basement apartment flooded up to 4.5 feet and rising fast. Water entering through sewer backup. 82-year-old on oxygen support and two small children.",
    latitude: 37.7925,
    longitude: -122.4180,
    address: "842 Pine Street, Apt 1B",
    status: "prioritized",
    severity: "critical",
    priority_score: 96,
    affected_count: 5,
    injured_count: 1,
    trapped_count: 5,
    has_children_elderly: true,
    medical_urgency: true,
    created_at: new Date(Date.now() - 25 * 60000).toISOString(),
    ai_classification: {
      category: "Water Rescue & Medical Evacuation",
      confidence: 0.98,
      recommended_response: ["High-clearance boat", "Paramedic ALS team", "Oxygen resupply"],
      rationale: "Elderly dependent on power/oxygen + rising water levels inside enclosed dwelling."
    }
  },
  {
    id: "inc-102",
    tracking_code: "SOS-8492",
    type: "medical",
    title: "Senior Care Facility Auxiliary Power Interrupted",
    description: "Backup diesel generator tripped after floodwater reached electrical panel. 12 bed-ridden patients requiring continuous telemetry and suction.",
    latitude: 37.7850,
    longitude: -122.4290,
    address: "1205 Sutter Blvd",
    status: "assigned",
    severity: "critical",
    priority_score: 94,
    affected_count: 12,
    injured_count: 0,
    trapped_count: 12,
    has_children_elderly: true,
    medical_urgency: true,
    created_at: new Date(Date.now() - 40 * 60000).toISOString(),
    ai_classification: {
      category: "Critical Medical Infrastructure",
      confidence: 0.97,
      recommended_response: ["Emergency Mobile Generator 50kW", "Medical transport team"],
      rationale: "Life-support power vulnerability in clinical setting."
    }
  },
  {
    id: "inc-103",
    tracking_code: "SOS-8493",
    type: "structural_collapse",
    title: "Partial Roof Collapse on Commercial Loading Dock",
    description: "Heavy rainfall overloaded flat drainage roof; partial collapse caught 4 logistics workers. 2 extricated, 2 trapped under light steel joists.",
    latitude: 37.7530,
    longitude: -122.3950,
    address: "450 Industrial Way, Gate 3",
    status: "in_progress",
    severity: "critical",
    priority_score: 91,
    affected_count: 4,
    injured_count: 2,
    trapped_count: 2,
    has_children_elderly: false,
    medical_urgency: true,
    created_at: new Date(Date.now() - 55 * 60000).toISOString(),
    ai_classification: {
      category: "USAR Structural Extraction",
      confidence: 0.95,
      recommended_response: ["USAR Team Bravo", "Heavy hydraulic cutting gear", "Trauma ambulance"],
      rationale: "Physical entrapment under structural debris with reported bleeding."
    }
  },
  {
    id: "inc-104",
    tracking_code: "SOS-8494",
    type: "flood",
    title: "Bus Stranded in Rapidly Flowing Canal Underpass",
    description: "Public transit bus stalled in 3.5 ft deep flash flood beneath railway bridge. Water is moving at 15 knots. 18 passengers on seats.",
    latitude: 37.7680,
    longitude: -122.4120,
    address: "Mission & 14th Street Underpass",
    status: "verified",
    severity: "critical",
    priority_score: 93,
    affected_count: 18,
    injured_count: 0,
    trapped_count: 18,
    has_children_elderly: true,
    medical_urgency: false,
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
    ai_classification: {
      category: "Rapid Swiftwater Extraction",
      confidence: 0.99,
      recommended_response: ["Swiftwater Rescue Team Alpha", "Rigid Inflatable Boat", "Tether lines"],
      rationale: "Dynamic water flow creates imminent capsize hazard for immobilized transport vehicle."
    }
  },
  {
    id: "inc-105",
    tracking_code: "SOS-8495",
    type: "fire",
    title: "Electrical Transformer Arcing with Chemical Smoke",
    description: "Substation feeder submerged, arcing against security fencing. Toxic smoke drifting toward preschool and three apartment complexes.",
    latitude: 37.7610,
    longitude: -122.4380,
    address: "520 Castro Street",
    status: "submitted",
    severity: "high",
    priority_score: 84,
    affected_count: 45,
    injured_count: 0,
    trapped_count: 0,
    has_children_elderly: true,
    medical_urgency: false,
    created_at: new Date(Date.now() - 10 * 60000).toISOString(),
    ai_classification: {
      category: "Hazmat & Utility Containment",
      confidence: 0.91,
      recommended_response: ["Hazmat Unit", "Power Grid Isolation Request", "Immediate Downwind Shelter-in-Place Alert"],
      rationale: "Toxic inhalation hazard near high-density vulnerable population."
    }
  },
  {
    id: "inc-106",
    tracking_code: "SOS-8496",
    type: "water_food",
    title: "Drinking Water Supply Contaminated by Main Breach",
    description: "Water main rupture mixed with storm runoff. 350 residents in community tower without potable water, formula for infants unavailable.",
    latitude: 37.7810,
    longitude: -122.4040,
    address: "201 Folsom St, Tower B",
    status: "verified",
    severity: "medium",
    priority_score: 68,
    affected_count: 350,
    injured_count: 0,
    trapped_count: 0,
    has_children_elderly: true,
    medical_urgency: false,
    created_at: new Date(Date.now() - 90 * 60000).toISOString(),
    ai_classification: {
      category: "Bulk Potable Water Logistics",
      confidence: 0.93,
      recommended_response: ["Warehouse Central: 500L bottled water palettes", "Infant nutritional supplies"],
      rationale: "High affected count but zero immediate trauma danger."
    }
  },
  {
    id: "inc-107",
    tracking_code: "SOS-8497",
    type: "medical",
    title: "Dialysis Patient Cut Off by Blocked Access Road",
    description: "Private road covered in 2-foot mud accumulation. Patient overdue for renal treatment by 24 hours, experiencing respiratory edema.",
    latitude: 37.7420,
    longitude: -122.4480,
    address: "88 Twin Peaks Crest",
    status: "prioritized",
    severity: "high",
    priority_score: 87,
    affected_count: 1,
    injured_count: 1,
    trapped_count: 1,
    has_children_elderly: true,
    medical_urgency: true,
    created_at: new Date(Date.now() - 30 * 60000).toISOString(),
    ai_classification: {
      category: "All-Terrain Medical Transport",
      confidence: 0.96,
      recommended_response: ["4x4 Medical Ambulance", "Nearest Hospital: St. Jude Trauma Center"],
      rationale: "Acute physiological decompensation due to chronic therapy disruption."
    }
  },
  {
    id: "inc-108",
    tracking_code: "SOS-8498",
    type: "flood",
    title: "Underground Parking Flooding with 3 Persons Checking Vehicles",
    description: "Rapid water ingress down car ramp. Persons attempted to retrieve vehicles and water is now waist-deep at stair exit doors.",
    latitude: 37.7880,
    longitude: -122.4010,
    address: "55 4th Street",
    status: "in_progress",
    severity: "high",
    priority_score: 85,
    affected_count: 3,
    injured_count: 0,
    trapped_count: 3,
    has_children_elderly: false,
    medical_urgency: false,
    created_at: new Date(Date.now() - 48 * 60000).toISOString(),
    ai_classification: {
      category: "Subterranean Water Extraction",
      confidence: 0.94,
      recommended_response: ["Team Delta Dive / Submersible Pump", "Heavy dewatering apparatus"],
      rationale: "Rapid subterranean water rise creates hydrostatic entrapment hazard."
    }
  },
  {
    id: "inc-109",
    tracking_code: "SOS-8499",
    type: "structural_collapse",
    title: "Retaining Wall Bulging Above Two Residential Cottages",
    description: "Stone masonry retaining wall visibly leaning 25 degrees following saturated soil pressure. Cracking sounds reported.",
    latitude: 37.7580,
    longitude: -122.4310,
    address: "142 Corbett Avenue",
    status: "verified",
    severity: "medium",
    priority_score: 72,
    affected_count: 6,
    injured_count: 0,
    trapped_count: 0,
    has_children_elderly: false,
    medical_urgency: false,
    created_at: new Date(Date.now() - 75 * 60000).toISOString(),
    ai_classification: {
      category: "Pre-Emptive Evacuation",
      confidence: 0.89,
      recommended_response: ["Red-tag building notice", "Transfer to Shelter #2 (Lincoln Community)"],
      rationale: "Structural compromise without active injury; immediate relocation required."
    }
  },
  {
    id: "inc-110",
    tracking_code: "SOS-8500",
    type: "flood",
    title: "Stormwater Drain Clogged Causing Street Inundation",
    description: "Large debris blocking municipal culvert. Water pooling across 4 lanes of traffic.",
    latitude: 37.7710,
    longitude: -122.4220,
    address: "Gough & Market St",
    status: "resolved",
    severity: "low",
    priority_score: 35,
    affected_count: 0,
    injured_count: 0,
    trapped_count: 0,
    has_children_elderly: false,
    medical_urgency: false,
    created_at: new Date(Date.now() - 180 * 60000).toISOString(),
    ai_classification: {
      category: "Municipal Clearance",
      confidence: 0.95,
      recommended_response: ["Public Works Backhoe Unit"],
      rationale: "Obstruction cleared and water drained safely into collector basin."
    }
  },
  {
    id: "inc-111",
    tracking_code: "SOS-8501",
    type: "medical",
    title: "Hypothermia Symptoms Reported at Makeshift Evacuation Spot",
    description: "Group of 14 people gathered under gas station canopy in wet clothing. Two showing uncontrolled shivering and confusion.",
    latitude: 37.7815,
    longitude: -122.4110,
    address: "8th & Harrison St",
    status: "prioritized",
    severity: "high",
    priority_score: 83,
    affected_count: 14,
    injured_count: 2,
    trapped_count: 0,
    has_children_elderly: true,
    medical_urgency: true,
    created_at: new Date(Date.now() - 20 * 60000).toISOString(),
    ai_classification: {
      category: "Field Triage & Shelter Transfer",
      confidence: 0.92,
      recommended_response: ["Warm transport bus", "Thermal blankets (30 units)", "EMT Triage"],
      rationale: "Active hypothermic progression in damp conditions."
    }
  },
  {
    id: "inc-112",
    tracking_code: "SOS-8502",
    type: "water_food",
    title: "Community Kitchen Food Depot Saturated",
    description: "Relief food distribution center has lost 40% of dry storage due to roof leak. Urgently requesting dry grain and soup replacement.",
    latitude: 37.7650,
    longitude: -122.4050,
    address: "Potrero Ave Community Center",
    status: "verified",
    severity: "medium",
    priority_score: 62,
    affected_count: 120,
    injured_count: 0,
    trapped_count: 0,
    has_children_elderly: true,
    medical_urgency: false,
    created_at: new Date(Date.now() - 110 * 60000).toISOString(),
    ai_classification: {
      category: "NGO Logistics Replenishment",
      confidence: 0.88,
      recommended_response: ["Dispatch 200 Ration Packs from Warehouse Alpha"],
      rationale: "Community sustenance chain replenishment."
    }
  }
];

export const seedWarehouses = [
  {
    id: "wh-01",
    name: "Central Metropolitan Logistics Depot",
    code: "WH-CENTRAL",
    latitude: 37.7550,
    longitude: -122.4080,
    address: "1000 Cesar Chavez St, Bay 4",
    contact_person: "Capt. Marcus Vance",
    phone: "+1-415-555-0190",
    status: "operational"
  },
  {
    id: "wh-02",
    name: "North Shore Forward Emergency Cache",
    code: "WH-NORTH",
    latitude: 37.8010,
    longitude: -122.4250,
    address: "2 Marina Green Blvd",
    contact_person: "Elena Rostova",
    phone: "+1-415-555-0192",
    status: "operational"
  },
  {
    id: "wh-03",
    name: "Bayside Medical & Pharmaceutical Reserve",
    code: "WH-MED-BAY",
    latitude: 37.7700,
    longitude: -122.3880,
    address: "650 Mission Rock St",
    contact_person: "Dr. Arvind Patel",
    phone: "+1-415-555-0195",
    status: "operational"
  }
];

export const seedInventory = [
  { id: "inv-01", warehouse_id: "wh-01", category: "water", item_name: "Clean Potable Water (10L Jugs)", unit: "jugs", quantity_available: 2400, quantity_reserved: 350, minimum_threshold: 500, status: "healthy" },
  { id: "inv-02", warehouse_id: "wh-01", category: "food", item_name: "Ready-To-Eat Emergency Meal Kits (MRE)", unit: "kits", quantity_available: 1850, quantity_reserved: 200, minimum_threshold: 400, status: "healthy" },
  { id: "inv-03", warehouse_id: "wh-01", category: "rescue_gear", item_name: "Submersible Dewatering Trash Pumps (3-inch)", unit: "units", quantity_available: 18, quantity_reserved: 6, minimum_threshold: 10, status: "healthy" },
  { id: "inv-04", warehouse_id: "wh-01", category: "shelter_kits", item_name: "Fleece Thermal Hypothermia Blankets", unit: "pieces", quantity_available: 1200, quantity_reserved: 150, minimum_threshold: 300, status: "healthy" },
  { id: "inv-05", warehouse_id: "wh-02", category: "rescue_gear", item_name: "Inflatable Zodiac Swiftwater Boats", unit: "boats", quantity_available: 4, quantity_reserved: 3, minimum_threshold: 5, status: "low" },
  { id: "inv-06", warehouse_id: "wh-02", category: "fuel", item_name: "Treated Diesel Emergency Fuel (50 gal drum)", unit: "drums", quantity_available: 8, quantity_reserved: 4, minimum_threshold: 15, status: "critical" },
  { id: "inv-07", warehouse_id: "wh-03", category: "medical", item_name: "Trauma Surgical Packs & Bandages", unit: "packs", quantity_available: 480, quantity_reserved: 60, minimum_threshold: 100, status: "healthy" },
  { id: "inv-08", warehouse_id: "wh-03", category: "medical", item_name: "Portable Emergency Oxygen Cylinders (E-Type)", unit: "tanks", quantity_available: 65, quantity_reserved: 15, minimum_threshold: 30, status: "healthy" },
  { id: "inv-09", warehouse_id: "wh-03", category: "medical", item_name: "Pediatric Emergency Nutrition Packs", unit: "boxes", quantity_available: 90, quantity_reserved: 20, minimum_threshold: 40, status: "healthy" }
];

export const seedRescueTeams = [
  {
    id: "team-01",
    team_code: "SWIFT-ALPHA",
    name: "Swiftwater Rescue Taskforce Alpha",
    lead_name: "Capt. Sarah Jenkins",
    phone: "+1-415-555-7001",
    current_lat: 37.7780,
    current_lng: -122.4150,
    status: "dispatched",
    skills: ["water_rescue", "boat_handling", "rapid_evac", "paramedic"],
    capacity: 8,
    active_mission: "mis-201"
  },
  {
    id: "team-02",
    team_code: "USAR-BRAVO",
    name: "Urban Search & Rescue Unit Bravo",
    lead_name: "Cmdr. David Chen",
    phone: "+1-415-555-7002",
    current_lat: 37.7580,
    current_lng: -122.4010,
    status: "on_scene",
    skills: ["structural_collapse", "heavy_extrication", "confined_space", "k9"],
    capacity: 10,
    active_mission: "mis-202"
  },
  {
    id: "team-03",
    team_code: "MED-CHARLIE",
    name: "Advanced Life Support Tactical Medic Charlie",
    lead_name: "Lt. Maria Rodriguez, RN",
    phone: "+1-415-555-7003",
    current_lat: 37.7850,
    current_lng: -122.4320,
    status: "available",
    skills: ["medical_evac", "pediatric_triage", "advanced_cardiac", "hypothermia_care"],
    capacity: 6,
    active_mission: null
  },
  {
    id: "team-04",
    team_code: "LOG-DELTA",
    name: "Heavy Transit & Evac Convoy Delta",
    lead_name: "Sgt. Tom Bradley",
    phone: "+1-415-555-7004",
    current_lat: 37.7620,
    current_lng: -122.4210,
    status: "available",
    skills: ["high_water_transit", "bulk_dispatch", "barrier_clearing"],
    capacity: 12,
    active_mission: null
  }
];

export const seedVehicles = [
  { id: "veh-01", registration_number: "AMB-ALS-04", type: "ambulance", make_model: "Ford F-450 Super Duty ALS", capacity_payload_kg: 800, passenger_capacity: 4, current_lat: 37.7860, current_lng: -122.4280, status: "on_mission", driver_name: "Officer Kelly Miller", fuel_percent: 88, assigned_team_id: "team-03" },
  { id: "veh-02", registration_number: "RESCUE-BOAT-02", type: "rescue_boat", make_model: "Zodiac MilPro SRMN 550", capacity_payload_kg: 1200, passenger_capacity: 8, current_lat: 37.7790, current_lng: -122.4160, status: "en_route", driver_name: "Pilot Aaron Stone", fuel_percent: 75, assigned_team_id: "team-01" },
  { id: "veh-03", registration_number: "TRUCK-4X4-09", type: "high_clearance_truck", make_model: "Freightliner M2 106 6x6", capacity_payload_kg: 5000, passenger_capacity: 18, current_lat: 37.7590, current_lng: -122.4040, status: "on_mission", driver_name: "Rick Daniels", fuel_percent: 92, assigned_team_id: "team-02" },
  { id: "veh-04", registration_number: "DRONE-AERO-01", type: "air_drone", make_model: "DJI Matrice 350 RTK Thermal", capacity_payload_kg: 5, passenger_capacity: 0, current_lat: 37.7749, current_lng: -122.4194, status: "available", driver_name: "Remote Operator Vance", fuel_percent: 94, assigned_team_id: null },
  { id: "veh-05", registration_number: "BUS-EVAC-01", type: "transport_bus", make_model: "Blue Bird 42-Pass All-Weather", capacity_payload_kg: 4000, passenger_capacity: 42, current_lat: 37.7650, current_lng: -122.4180, status: "available", driver_name: "Sonia G.", fuel_percent: 85, assigned_team_id: "team-04" }
];

export const seedHospitals = [
  {
    id: "hosp-01",
    name: "Metropolitan General Hospital & Trauma Center",
    latitude: 37.7558,
    longitude: -122.4045,
    address: "1001 Potrero Ave",
    phone: "+1-415-555-2000",
    total_beds: 350,
    available_beds: 24,
    icu_total: 45,
    icu_available: 3,
    trauma_level: 1,
    has_helipad: true,
    generator_operational: true,
    blood_bank_status: "adequate",
    status: "open",
    specialties: ["Level 1 Trauma", "Burn Unit", "Hyperbaric Oxygen"]
  },
  {
    id: "hosp-02",
    name: "St. Jude Coastal Medical Pavilion",
    latitude: 37.7865,
    longitude: -122.4342,
    address: "2100 Webster St",
    phone: "+1-415-555-2020",
    total_beds: 210,
    available_beds: 42,
    icu_total: 25,
    icu_available: 8,
    trauma_level: 2,
    has_helipad: true,
    generator_operational: true,
    blood_bank_status: "adequate",
    status: "open",
    specialties: ["Pediatric Emergency", "Cardiac Care"]
  },
  {
    id: "hosp-03",
    name: "Mission Bay Health Sciences Center",
    latitude: 37.7680,
    longitude: -122.3910,
    address: "1855 4th St",
    phone: "+1-415-555-2040",
    total_beds: 180,
    available_beds: 6,
    icu_total: 30,
    icu_available: 1,
    trauma_level: 1,
    has_helipad: true,
    generator_operational: true,
    blood_bank_status: "low",
    status: "diverted",
    specialties: ["Neurosurgery", "Toxicology"]
  }
];

export const seedShelters = [
  {
    id: "sh-01",
    name: "Civic Center Auditorium Safe Haven",
    latitude: 37.7795,
    longitude: -122.4175,
    address: "99 Grove Street",
    capacity: 750,
    current_occupancy: 412,
    food_supplies_days: 6,
    water_supplies_days: 6,
    medical_staff_present: true,
    pet_friendly: true,
    status: "open"
  },
  {
    id: "sh-02",
    name: "Presidio Community Gymnasium Refuge",
    latitude: 37.7980,
    longitude: -122.4550,
    address: "63 Moraga Ave",
    capacity: 400,
    current_occupancy: 145,
    food_supplies_days: 8,
    water_supplies_days: 8,
    medical_staff_present: true,
    pet_friendly: false,
    status: "open"
  },
  {
    id: "sh-03",
    name: "South Park Armory Shelter",
    latitude: 37.7660,
    longitude: -122.4200,
    address: "1800 Mission St",
    capacity: 500,
    current_occupancy: 480,
    food_supplies_days: 2,
    water_supplies_days: 2,
    medical_staff_present: true,
    pet_friendly: true,
    status: "open"
  }
];

export const seedRoadHazards = [
  {
    id: "road-01",
    road_name: "Lower Mission Underpass at 14th St",
    hazard_type: "flooded",
    latitude: 37.7685,
    longitude: -122.4125,
    is_passable: false,
    severity: "impassable",
    reported_at: new Date(Date.now() - 45 * 60000).toISOString(),
    description: "4 feet standing water; abandoned vehicle blocking storm lane."
  },
  {
    id: "road-02",
    road_name: "Embarcadero Pier 14 Northbound",
    hazard_type: "flooded",
    latitude: 37.7940,
    longitude: -122.3920,
    is_passable: false,
    severity: "impassable",
    reported_at: new Date(Date.now() - 90 * 60000).toISOString(),
    description: "High-tide storm surge overtopping seawall."
  },
  {
    id: "road-03",
    road_name: "Portola Drive Slope Curve",
    hazard_type: "debris",
    latitude: 37.7440,
    longitude: -122.4490,
    is_passable: true,
    severity: "warning",
    reported_at: new Date(Date.now() - 35 * 60000).toISOString(),
    description: "Mud and loose rock debris on right shoulder; reduced to 1 lane."
  }
];

export const seedMissions = [
  {
    id: "mis-201",
    mission_code: "MIS-ALPHA-101",
    incident_id: "inc-101",
    team_id: "team-01",
    vehicle_id: "veh-02",
    target_hospital_id: "hosp-02",
    target_shelter_id: null,
    priority: "critical",
    status: "dispatched",
    objective: "Extract 5 trapped occupants (1 elderly on oxygen) via Zodiac boat and transport to St. Jude Coastal Hospital.",
    assigned_at: new Date(Date.now() - 18 * 60000).toISOString(),
    notes: "Access via Polk St approach; underpass is impassable."
  },
  {
    id: "mis-202",
    mission_code: "MIS-BRAVO-103",
    incident_id: "inc-103",
    team_id: "team-02",
    vehicle_id: "veh-03",
    target_hospital_id: "hosp-01",
    target_shelter_id: null,
    priority: "critical",
    status: "on_scene",
    objective: "Structural shoring and hydraulic rescue of 2 trapped workers beneath collapsed dock roof.",
    assigned_at: new Date(Date.now() - 42 * 60000).toISOString(),
    notes: "USAR gear deployed; structural stability engineer on site."
  }
];

export const seedNgos = [
  {
    id: "ngo-01",
    name: "Red Cross Disaster Health Services",
    contact_person: "Rachel Simmons",
    phone: "+1-415-555-4010",
    email: "disaster.sf@redcross.org",
    specialties: ["shelter_mgmt", "first_aid", "blood_supply", "family_reunification"],
    verified: true,
    available_units: 32
  },
  {
    id: "ngo-02",
    name: "World Central Kitchen Rapid Response",
    contact_person: "Chef Antonio Morales",
    phone: "+1-415-555-4020",
    email: "relief@wck.org",
    specialties: ["hot_meals", "bulk_nutrition", "water_purification"],
    verified: true,
    available_units: 18
  },
  {
    id: "ngo-03",
    name: "Search Dogs Foundation",
    contact_person: "Karen Lewis",
    phone: "+1-415-555-4030",
    email: "deploy@k9search.org",
    specialties: ["k9_search", "wilderness_tracking", "debris_scent"],
    verified: true,
    available_units: 6
  }
];

export const seedVolunteers = [
  { id: "vol-01", full_name: "Dr. Jonathan Hayes", skills: ["trauma_medicine", "emergency_surgery"], phone: "+1-415-555-8010", availability_status: "deployed", assigned_task: "Triage support at Civic Center Shelter" },
  { id: "vol-02", full_name: "Elena Rostova", skills: ["licensed_boat_captain", "swiftwater_certified"], phone: "+1-415-555-8020", availability_status: "available", assigned_task: null },
  { id: "vol-03", full_name: "Samir Mehta", skills: ["heavy_machinery_operator", "diesel_mechanic"], phone: "+1-415-555-8030", availability_status: "available", assigned_task: null },
  { id: "vol-04", full_name: "Clara Benson", skills: ["bilingual_spanish_english", "childcare_specialist"], phone: "+1-415-555-8040", availability_status: "deployed", assigned_task: "Shelter registration & family matching" }
];

export const seedAuditLogs = [
  {
    id: "aud-001",
    user_email: "authority@disasteros.gov",
    user_role: "authority",
    action: "DISASTER_DECLARED",
    entity_type: "disaster",
    entity_id: "dis-001",
    details: "Disaster declared: Storm Zephyr & Coastal Flash Floods (Severity: Critical)",
    timestamp: new Date(Date.now() - 6 * 3600000).toISOString()
  },
  {
    id: "aud-002",
    user_email: "system.ai@disasteros.gov",
    user_role: "system",
    action: "AI_INCIDENT_PRIORITIZED",
    entity_type: "incident",
    entity_id: "inc-101",
    details: "AI calculated Priority Score 96 (Factors: trapped elderly, rising water, oxygen dependency)",
    timestamp: new Date(Date.now() - 24 * 60000).toISOString()
  },
  {
    id: "aud-003",
    user_email: "authority@disasteros.gov",
    user_role: "authority",
    action: "MISSION_DISPATCHED",
    entity_type: "mission",
    entity_id: "mis-201",
    details: "Authority approved AI allocation recommendation: Dispatched Team Alpha + Rescue Boat 02 to Incident #101",
    timestamp: new Date(Date.now() - 18 * 60000).toISOString()
  },
  {
    id: "aud-004",
    user_email: "logistics@disasteros.gov",
    user_role: "logistics",
    action: "ROAD_HAZARD_FLAGGED",
    entity_type: "road_condition",
    entity_id: "road-01",
    details: "Mission St underpass flagged as IMPASSABLE (4ft floodwater). Routing algorithm rerouted all Zone B units.",
    timestamp: new Date(Date.now() - 45 * 60000).toISOString()
  }
];
