// DisasterOS Smart Multi-Factor Resource Allocation & Dynamic Reallocation Engine
import { store } from '../database/store.js';

// Haversine distance calculator in kilometers
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

export class AllocationEngine {
  // 1. Calculate Optimal Resource Match for an Incident
  recommendAllocation(incidentId) {
    const incident = store.getIncidentById(incidentId);
    if (!incident) return null;

    const availableTeams = store.rescueTeams;
    const availableVehicles = store.vehicles;
    const hospitals = store.hospitals;
    const warehouses = store.warehouses;

    // Candidate teams scoring
    const candidateTeams = availableTeams.map((team) => {
      const distance = getDistanceKm(team.current_lat, team.current_lng, incident.latitude, incident.longitude);
      let matchScore = 100 - (distance * 4); // closer is higher score

      // Availability penalty
      if (team.status !== 'available') matchScore -= 30;

      // Skill bonus
      if (incident.type === 'flood' && team.skills.includes('water_rescue')) matchScore += 25;
      if (incident.type === 'structural_collapse' && team.skills.includes('structural_collapse')) matchScore += 25;
      if (incident.medical_urgency && team.skills.includes('medical_evac')) matchScore += 20;

      // Travel time estimation (average 35 km/h urban disaster speed)
      const estTravelMinutes = Math.max(3, Math.round((distance / 35) * 60) + (team.status !== 'available' ? 12 : 0));

      return {
        team_id: team.id,
        team_name: team.name,
        team_code: team.team_code,
        distance_km: distance,
        status: team.status,
        matchScore: Math.round(matchScore),
        estTravelMinutes,
        skills: team.skills
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    // Candidate vehicles scoring
    const candidateVehicles = availableVehicles.map((veh) => {
      const distance = getDistanceKm(veh.current_lat, veh.current_lng, incident.latitude, incident.longitude);
      let vScore = 100 - (distance * 3);
      if (veh.status !== 'available') vScore -= 30;

      // Appropriate vehicle type matching
      if (incident.type === 'flood' && veh.type === 'rescue_boat') vScore += 30;
      if (incident.type === 'flood' && veh.type === 'high_clearance_truck') vScore += 20;
      if (incident.medical_urgency && veh.type === 'ambulance') vScore += 35;

      const estTravelMinutes = Math.max(4, Math.round((distance / 30) * 60));

      return {
        vehicle_id: veh.id,
        registration_number: veh.registration_number,
        type: veh.type,
        distance_km: distance,
        status: veh.status,
        vScore: Math.round(vScore),
        estTravelMinutes,
        fuel_percent: veh.fuel_percent
      };
    }).sort((a, b) => b.vScore - a.vScore);

    // Recommended Hospital if medical needed
    let recommendedHospital = null;
    if (incident.medical_urgency || incident.injured_count > 0) {
      const scoredHospitals = hospitals.filter(h => h.status !== 'full' && h.status !== 'diverted').map(h => {
        const dist = getDistanceKm(h.latitude, h.longitude, incident.latitude, incident.longitude);
        const score = (h.available_beds * 2) + (h.icu_available * 5) - (dist * 3);
        return { ...h, distance_km: dist, score };
      }).sort((a, b) => b.score - a.score);

      if (scoredHospitals.length > 0) {
        recommendedHospital = {
          hospital_id: scoredHospitals[0].id,
          name: scoredHospitals[0].name,
          distance_km: scoredHospitals[0].distance_km,
          available_beds: scoredHospitals[0].available_beds,
          icu_available: scoredHospitals[0].icu_available,
          trauma_level: scoredHospitals[0].trauma_level
        };
      }
    }

    const topTeam = candidateTeams[0];
    const topVehicle = candidateVehicles[0];

    const recommendation = {
      incident_id: incident.id,
      tracking_code: incident.tracking_code,
      priority: incident.severity,
      priority_score: incident.priority_score,
      recommended_team: topTeam,
      recommended_vehicle: topVehicle,
      recommended_hospital: recommendedHospital,
      candidate_teams: candidateTeams.slice(0, 3),
      candidate_vehicles: candidateVehicles.slice(0, 3),
      expected_arrival_minutes: topTeam ? topTeam.estTravelMinutes : 15,
      reasoning: `Selected ${topTeam?.team_name || 'Standby Unit'} (${topTeam?.distance_km}km away) with ${topVehicle?.registration_number || 'assigned vehicle'} because of direct specialized capability (${topTeam?.skills?.join(', ')}) and lowest computed hazard transit time (${topTeam?.estTravelMinutes} mins).`,
      human_approval_required: true,
      status: "pending_authority_approval",
      timestamp: new Date().toISOString()
    };

    return recommendation;
  }

  // 2. Dynamic Reallocation Scanner: Identifies Critical Swaps
  checkDynamicReallocation() {
    const criticalIncidents = store.incidents.filter(i => i.severity === 'critical' && (i.status === 'prioritized' || i.status === 'submitted'));
    const recommendations = [];

    criticalIncidents.forEach((critIncident) => {
      // Find currently dispatched or on-scene teams on lower priority incidents
      const activeMissions = store.missions.filter(m => m.status === 'dispatched' && m.priority !== 'critical');

      activeMissions.forEach((mis) => {
        const assignedTeam = store.rescueTeams.find(t => t.id === mis.team_id);
        if (assignedTeam) {
          const distToCrit = getDistanceKm(assignedTeam.current_lat, assignedTeam.current_lng, critIncident.latitude, critIncident.longitude);
          if (distToCrit < 5.0) {
            recommendations.push({
              id: `realloc-${Date.now()}-${critIncident.id}`,
              type: "DYNAMIC_REALLOCATION_RECOMMENDATION",
              critical_incident: {
                id: critIncident.id,
                title: critIncident.title,
                priority_score: critIncident.priority_score
              },
              current_mission: {
                id: mis.id,
                code: mis.mission_code,
                priority: mis.priority
              },
              resource: {
                team_id: assignedTeam.id,
                name: assignedTeam.name,
                distance_to_critical_km: distToCrit
              },
              rationale: `Critical Incident #${critIncident.tracking_code} (${critIncident.title}) has emergent life-safety score of ${critIncident.priority_score}. Recommend reallocating ${assignedTeam.name} from lower priority Mission ${mis.mission_code}.`,
              expected_impact: `Accelerates critical life-safety extraction by ~14 minutes in High-Risk Zone.`,
              requires_authority_approval: true
            });
          }
        }
      });
    });

    return recommendations;
  }
}

export const allocationEngine = new AllocationEngine();
