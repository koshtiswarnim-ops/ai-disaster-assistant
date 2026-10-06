# 🌍 DISASTEROS

### Intelligent Disaster Response & Resource Coordination Platform

> **"One intelligent operating system for disaster response."**

DisasterOS is a full-stack, connected emergency operations platform bridging Citizens, Emergency Authorities, First Responders, Hospitals, Warehouses, Logistics Teams, Shelters, NGOs, and Volunteers with explainable AI decision support.

---

## 🎨 UI/UX Design System & Palette

Crafted with a clean, calm, professional emergency operations center aesthetic:
* **Primary Accent:** Single Cobalt-Blue (`#2563eb`, hover `#1d4ed8`, tint `#eff4ff`, mid `#dbe6fe` / `#93b4fd`)
* **Neutral Scale:** Cool slate / ink neutral scale (`#f8fafc` page background, pure-white cards `#ffffff`, borders `#e2e8f0` and hairlines `#f1f5f9` at 70–80% opacity)
* **Text Hierarchy:** Headings in `#0f172a`, strong labels `#334155`, body text `#64748b`, muted captions `#94a3b8`
* **Restrained Semantic Status Colors:**
  * **Emerald** (`#ecfdf5` bg / `#047857` text / `#a7f3d0` border) &rarr; Healthy, Resolved, Synced
  * **Rose** (`#ffe4e6` bg / `#e11d48` text / `#fecdd3` border) &rarr; Critical, Impassable, Danger Zone
  * **Amber** (`#fef3c7` bg / `#b45309` text / `#fde68a` border) &rarr; Warning, In-Progress, Pending, Unsaved
* **Elevation & Cards:** Soft 1px card borders, `rounded-2xl` corners, subtle dual-layer shadows (`0 1px 2px rgba(15,23,42,.04), 0 1px 3px rgba(15,23,42,.06)`), sticky translucent app-bar and bottom save bar.

---

## ⚡ The Connected Operational Workflow

```text
CITIZEN SOS INGRESS
       ↓
AI SEMANTIC CLASSIFICATION (Flood, USAR, Medical, Hazmat)
       ↓
EXPLAINABLE MULTI-FACTOR PRIORITIZATION (0-100 Score + Factors)
       ↓
SMART RESOURCE MATCHING (Team Skills + Proximity + Transit Time + Fleet Status)
       ↓
HAZARD-AWARE ROUTE COMPUTATION (Submerged road avoidance + Emergency corridors)
       ↓
EMERGENCY AUTHORITY REVIEW & APPROVAL
       ↓
MISSION DISPATCH & RESPONDER TELEMETRY
       ↓
REAL-TIME WEBSOCKET BROADCAST (Command Center + Map updates)
       ↓
DEPOT INVENTORY CONSUMPTION & TRANSACTION AUDIT
       ↓
DYNAMIC REALLOCATION MONITORING (Automated swap alerts on critical escalations)
       ↓
MISSION RESOLUTION & POST-ACTION ANALYTICS
```

---

## 🏛️ System Architecture

```text
               EXTERNAL DATA SOURCES (USGS, OpenWeather, GDACS, ReliefWeb)
                                     │
                                     ▼
                       BACKEND API (Node.js + Express)
     ┌───────────────────────────────┼───────────────────────────────┐
     ▼                               ▼                               ▼
AI / Decision Engine        Data Layer (PostgreSQL/Supabase)     Event & Realtime Bus
(Gemini/Claude/OpenAI)       (Normalized schema + RLS)             (WebSockets/Events)
     │                               │                               │
     └───────────────────────────────┼───────────────────────────────┘
                                     ▼
                    FRONTEND (React + Vite + TypeScript)
        Tailwind CSS (Cobalt-Blue & Slate/Ink Palette) + Lucide Icons + Recharts
```

---

## 🔑 Role-Based Access Control (RBAC) Personas

DisasterOS includes an interactive **Persona Switcher** in the top navigation bar to test the platform as any stakeholder:

| Persona | Role Key | Test Profile | Capabilities |
|---|---|---|---|
| **Chief Marcus Vance** | `authority` | Command Center EOC Director | Verify incidents, approve AI recommendations, dispatch missions, trigger simulation cascades. |
| **Sarah Lin** | `citizen` | Marina Basin Resident | 1-tap SOS ingress, GPS auto-detect, real-time rescue status tracker. |
| **Capt. Sarah Jenkins** | `rescue_team` | Swiftwater Alpha Taskforce Lead | Mission queue, tactical navigation, on-scene status telemetry, mission resolution. |
| **Dr. Arvind Patel** | `hospital` | Metro Trauma Center Triage | Live ER beds, ICU telemetry, ambulance diversion controls. |
| **Elena Rostova** | `warehouse` | North Shore Forward Cache Depot | Inventory buffers, stock replenishment, item dispatch transaction logs. |
| **Sgt. Tom Bradley** | `logistics` | Heavy Transit & Fleet Convoy | Vehicle tracking, fuel telemetry, route clearance. |
| **Rachel Simmons** | `ngo` | Red Cross Disaster Coordinator | Aid distribution, shelter support, emergency supplies matching. |
| **Dr. Jonathan Hayes** | `volunteer` | Medical Auxiliary Specialist | Certified skills registry, task assignment. |
| **Alex Mercer** | `admin` | System Administrator | Immutable audit logs, API configurations, system health monitoring. |

---

## 📱 Main Application Pages

* `/` — **Landing Page**: Platform vision, core pillars, interactive architecture, and direct navigation CTAs.
* `/command-center` — **Command Center**: The primary tactical dashboard with Live Leaflet Map, Critical Incident Feed, live metrics, and agency telemetry tabs.
* `/sos` — **Citizen SOS**: Mobile-first emergency distress ingress with GPS coordinate detection, vulnerability flags, and live stepper tracking.
* `/map` — **Live Map**: Full-screen interactive map with disaster zones, colored incident pins, hospitals, shelters, warehouses, and road hazards.
* `/incidents` — **Incidents Feed**: Multi-filter queue (critical, high, medium), status triage, and AI classification insights.
* `/resources` & `/allocation` — **Smart Allocation Engine**: Multi-factor resource optimization, candidate scoring, and authority approval.
* `/warehouses` — **Warehouses & Inventory**: Stock buffer monitoring, critical low-stock alerts, and transaction logging.
* `/vehicles` — **Logistics Fleet**: Real-time vehicle fleet tracking (ambulances, zodiac boats, 6x6 rescue trucks, drones).
* `/hospitals` — **Hospital Triage**: Live general bed and ICU capacity meters, diversion controls, and trauma levels.
* `/shelters` — **Shelters & Safe Havens**: Evacuee occupancy bars, food/water reserve buffers, and pet accessibility.
* `/routes` — **Hazard Routing**: Dynamic emergency corridor calculator avoiding flooded underpasses and blocked roads.
* `/rescue-teams` — **Rescue Teams**: Specialized skills inventory (water rescue, USAR, alpine, paramedic) and readiness status.
* `/simulation` — **Digital Twin & Flood Cascade**: What-If scenario sandbox + 6-step interactive hackathon flood demonstration runner.
* `/ai-assistant` — **Command Center AI Assistant**: Natural language situational intelligence assistant with source attribution.
* `/risk-analysis` — **Risk Prediction**: Composite vulnerability index fusing meteorological and USGS seismic data.
* `/analytics` — **Operations Analytics**: Recharts visualizations for response velocity, incident modalities, and shelter occupancy.
* `/audit-logs` — **Audit Trail**: Immutable state change log filterable by role, action, and timestamp.
* `/alerts` — **Emergency Broadcast**: Multi-channel broadcast transmitter (push, SMS, siren).
* `/settings` & `/profile` — **Workspace Settings**: Formcraft-styled SaaS settings with profile, form behaviour, notifications, delivery, and danger zone.

---

## 🚀 Quickstart Guide

### 1. Backend Server
```bash
cd server
npm install
npm test           # Runs complete 10-step E2E connected workflow test
npm start          # Starts server on http://localhost:5000 and ws://localhost:5000/ws
```

### 2. Frontend Client
```bash
cd client
npm install
npm run build      # Verifies TypeScript and compiles production bundle
npm run dev        # Launches Vite development server on http://localhost:5173
```

---

## 🧪 Automated End-to-End Verification

The included automated test suite (`server/tests/e2e_workflow.test.js`) verifies all 10 phases of the connected pipeline:
```text
✓ [1/10] System Health & Database Store Initialization
✓ [2/10] Citizen SOS Ingress Registration
✓ [3/10] AI Semantic Classification & Multi-Factor Scoring (100/100 Critical)
✓ [4/10] Smart Resource Allocation (Team + Vehicle + Hospital recommendation)
✓ [5/10] Hazard-Aware Route Computation (Avoids 4ft flooded underpass)
✓ [6/10] Authority Approval & Responder Mission Dispatch
✓ [7/10] Warehouse Inventory Reservation & Dispatch Transaction
✓ [8/10] Dynamic Reallocation Monitoring Scanner
✓ [9/10] Field Mission Completion & Incident Resolution
✓ [10/10] Immutable Audit Trail Verification
```

---

## 🔒 Security & Privacy

* **Role-Based Access Control (RBAC)** across all endpoints.
* **Row-Level Security (RLS)** policies defined in `server/database/rls_policies.sql`.
* **Zero Exposure of Private Credentials** to the frontend client.
* **Structured Error Sanitization** preventing stack trace leakage.
* **Human-in-the-Loop Safeguard** ensuring critical resource reassignments and evacuations require explicit authority authorization.
