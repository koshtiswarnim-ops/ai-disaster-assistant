// DisasterOS Digital Twin / What-If Simulation Engine
import { store } from '../database/store.js';
import { eventBus } from './eventBus.js';
import { aiService } from './aiService.js';
import { allocationEngine } from './allocationEngine.js';

export class SimulationEngine {
  constructor() {
    this.activeSimulation = null;
    this.simulationStep = 0;
    this.simulationTimer = null;
  }

  // 1. Isolated What-If Scenario Analysis (Does not mutate live data)
  runWhatIfAnalysis(scenarioType, params = {}) {
    const baseline = {
      activeIncidents: store.incidents.length,
      availableBeds: store.hospitals.reduce((acc, h) => acc + h.available_beds, 0),
      availableIcu: store.hospitals.reduce((acc, h) => acc + h.icu_available, 0),
      openShelterCapacity: store.shelters.reduce((acc, s) => acc + (s.capacity - s.current_occupancy), 0),
      availableTeams: store.rescueTeams.filter(t => t.status === 'available').length
    };

    let simulatedState = { ...baseline };
    let impactSummary = "";
    let recommendedMitigation = [];

    switch (scenarioType) {
      case 'hospital_down': {
        const hospitalName = params.hospitalName || "Metropolitan General Hospital";
        simulatedState.availableBeds -= 24;
        simulatedState.availableIcu -= 3;
        impactSummary = `Simulated total loss of ${hospitalName}. Citywide ICU capacity drops by 25%. Emergency medical routing diverts ~8 incoming ambulances to St. Jude Pavilion.`;
        recommendedMitigation = [
          "Deploy Mobile Field Hospital Alpha to Civic Center Plaza",
          "Issue immediate diversion order for all trauma cases to County Regional Center",
          "Request mutual aid ambulances from neighboring county"
        ];
        break;
      }

      case 'main_arterial_blocked': {
        impactSummary = `Simulated collapse or deep submergence of Main Highway 101 Arterial. Transit time between Warehouses and Waterfront Shelter increases by +28 minutes.`;
        recommendedMitigation = [
          "Open emergency high-water corridor via 19th Avenue",
          "Deploy drone logistics for critical blood and pediatric pharmaceutical delivery",
          "Station amphibious rescue boat shuttle at 16th Street Landing"
        ];
        break;
      }

      case 'storm_intensification': {
        simulatedState.activeIncidents += 8;
        simulatedState.openShelterCapacity -= 350;
        impactSummary = `Simulated 50mm/hr rainfall spike over next 3 hours. Estimated +8 flash flood SOS submissions and 350 additional evacuees seeking shelter.`;
        recommendedMitigation = [
          "Pre-stage Swiftwater Team Charlie at Sunset District Depot",
          "Trigger Level 2 Emergency Alert for low-lying Zone A basements",
          "Replenish Shelter #3 with 500 emergency meal rations from Central Depot"
        ];
        break;
      }

      default: {
        impactSummary = "Custom scenario processed with multi-agency ripple effect assessment.";
        recommendedMitigation = ["Maintain current tactical reserve status."];
      }
    }

    return {
      scenario: scenarioType,
      parameters: params,
      baseline,
      simulatedState,
      impactSummary,
      recommendedMitigation,
      timestamp: new Date().toISOString()
    };
  }

  // 2. Interactive Hackathon Flood Simulation Runner
  startFloodSimulation(onStepUpdate) {
    if (this.activeSimulation) {
      this.stopSimulation();
    }

    this.activeSimulation = {
      id: `sim-${Date.now()}`,
      name: "Atmospheric River Category 3 Flood Cascade",
      status: "running",
      startTime: new Date().toISOString(),
      stepsCompleted: 0
    };

    console.log('[SimulationEngine] Started interactive flood simulation cascade...');

    const simulationSteps = [
      {
        step: 1,
        title: "Flood Surge Zone Expands",
        description: "Zone A waterfront waters rise +0.8m. Evacuation order broadcast across marine district.",
        action: () => {
          eventBus.broadcast('DISASTER_DETECTED', {
            type: 'flood_expansion',
            severity: 'critical',
            zone: 'Zone A - Marina & Waterfront Basin',
            message: 'Water levels rising rapidly along bay perimeter'
          });
        }
      },
      {
        step: 2,
        title: "Cluster of Citizen SOS Requests Ingress",
        description: "3 new urgent distress signals registered from stranded residents.",
        action: () => {
          const simIncident = store.createIncident({
            title: "[SIMULATION] 4 Seniors Trapped on Second Floor with Rising Water",
            type: "flood",
            severity: "critical",
            priority_score: 95,
            latitude: 37.7940,
            longitude: -122.4210,
            address: "1420 Marina Boulevard",
            has_children_elderly: true,
            affected_count: 4,
            trapped_count: 4,
            medical_urgency: true
          });
          eventBus.broadcast('SOS_CREATED', simIncident);
        }
      },
      {
        step: 3,
        title: "Road Infrastructure Hazard Triggered",
        description: "Cesar Chavez off-ramp impassable. Automatic routing updates dispatched.",
        action: () => {
          store.roadHazards.push({
            id: `road-sim-${Date.now()}`,
            road_name: "Cesar Chavez Logistics Connector",
            hazard_type: "flooded",
            latitude: 37.7510,
            longitude: -122.4020,
            is_passable: false,
            severity: "impassable",
            reported_at: new Date().toISOString()
          });
          eventBus.broadcast('ROAD_BLOCKED', { road: "Cesar Chavez Connector", reason: "Flood Inundation" });
        }
      },
      {
        step: 4,
        title: "AI Dynamic Reallocation Recommended",
        description: "AI prioritizes new critical incident and recommends rerouting Tactical Team Alpha.",
        action: () => {
          const realloc = allocationEngine.checkDynamicReallocation();
          eventBus.broadcast('AI_RECOMMENDATION_CREATED', {
            recommendation: realloc[0] || {
              type: "DYNAMIC_REALLOCATION",
              message: "Recommend reallocating Swiftwater Alpha to Marina Blvd extraction."
            }
          });
        }
      },
      {
        step: 5,
        title: "Warehouse Supplies Dispatched",
        description: "150 Water Jugs & 50 Trauma Kits reserved for incoming shelter evacuees.",
        action: () => {
          store.updateInventoryStock("inv-01", -150, "dispatch", "Emergency Shelter Resupply");
          eventBus.broadcast('INVENTORY_UPDATED', { itemId: "inv-01", quantity: -150 });
        }
      },
      {
        step: 6,
        title: "Mission Completed & Evacuees Sheltered",
        description: "4 residents extracted to safe ground; Shelter occupancy updated.",
        action: () => {
          if (store.shelters[0]) {
            store.shelters[0].current_occupancy += 4;
          }
          eventBus.broadcast('SHELTER_CAPACITY_CHANGED', { shelterId: "sh-01", change: +4 });
        }
      }
    ];

    let currentStep = 0;
    this.simulationTimer = setInterval(() => {
      if (currentStep < simulationSteps.length) {
        const item = simulationSteps[currentStep];
        item.action();
        this.simulationStep = item.step;
        if (onStepUpdate) onStepUpdate(item);
        console.log(`[SimulationEngine] Executed step ${item.step}: ${item.title}`);
        currentStep++;
      } else {
        clearInterval(this.simulationTimer);
        this.activeSimulation.status = "completed";
        console.log('[SimulationEngine] Simulation sequence completed successfully.');
      }
    }, 4500); // 4.5 seconds per step for dynamic live visual progression

    return this.activeSimulation;
  }

  stopSimulation() {
    if (this.simulationTimer) {
      clearInterval(this.simulationTimer);
      this.simulationTimer = null;
    }
    if (this.activeSimulation) {
      this.activeSimulation.status = "stopped";
    }
  }
}

export const simulationEngine = new SimulationEngine();
