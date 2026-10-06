import React, { useState, useEffect } from 'react';
import { HeaderBand } from '../components/layout/HeaderBand';
import { api } from '../services/api';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { BarChart3, TrendingUp, Clock, Users, ShieldCheck, Activity } from 'lucide-react';

const COLORS = ['#2563eb', '#dc2626', '#f59e0b', '#7c3aed', '#059669'];

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnalytics()
      .then(res => setData(res))
      .catch(e => console.warn(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1 bg-slate-50 flex flex-col pb-12">
      <HeaderBand
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Intelligence' },
          { label: 'Operational Analytics' }
        ]}
        title="Disaster Intelligence & Operations Analytics"
        description="Empirical mission telemetry, response timelines, casualty extractions, and multi-agency resource utilization."
        statusText="Operational Telemetry Calibrated"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full mt-6 space-y-6">
        
        {/* KPI Row */}
        {data?.kpis && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="card-soft p-4 bg-white">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Avg Response Time</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">{data.kpis.average_response_minutes} min</p>
              <span className="text-xs text-emerald-600 font-medium">Faster than benchmark</span>
            </div>
            <div className="card-soft p-4 bg-white">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Citizens Extricated</span>
              <p className="text-2xl font-bold text-blue-600 mt-1">{data.kpis.total_rescued} people</p>
              <span className="text-xs text-slate-400">Across 18 missions</span>
            </div>
            <div className="card-soft p-4 bg-white">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Active Responders Deployed</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">{data.kpis.teams_deployed} units</p>
              <span className="text-xs text-slate-400">Zone A & Zone B active</span>
            </div>
            <div className="card-soft p-4 bg-white">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Shelter Refuge Rate</span>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{data.kpis.shelter_spaces_free} open</p>
              <span className="text-xs text-slate-400">Capacity buffer secure</span>
            </div>
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Incident Ingress vs Resolution Trend */}
          <div className="card-soft p-5 bg-white border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Incident Ingress vs Resolution Velocity
            </h3>
            <p className="text-xs text-slate-500 mb-4">Cumulative distress signals compared with completed field missions</p>
            
            <div className="h-64 w-full">
              {data?.recent_trend && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.recent_trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="incidents" name="Reported SOS" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Incident Modality Breakdown */}
          <div className="card-soft p-5 bg-white border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Incident Modality Distribution
            </h3>
            <p className="text-xs text-slate-500 mb-4">Volume classified by primary hazard category</p>

            <div className="h-64 w-full flex items-center justify-center">
              {data?.type_distribution && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.type_distribution}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={45}
                      paddingAngle={3}
                      label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {data.type_distribution.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Hospital Bed vs ICU Free Capacity */}
          <div className="card-soft p-5 bg-white border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Hospital Free Trauma & ICU Capacity
            </h3>
            <p className="text-xs text-slate-500 mb-4">Surplus patient capacity across metropolitan receiving centers</p>

            <div className="h-64 w-full">
              {data?.hospital_capacity && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.hospital_capacity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                    <Bar dataKey="available_beds" name="Standard Beds" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="icu_available" name="ICU Beds" fill="#dc2626" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Shelter Load Factor */}
          <div className="card-soft p-5 bg-white border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Evacuation Shelter Load Factor (%)
            </h3>
            <p className="text-xs text-slate-500 mb-4">Percentage of designated capacity currently occupied</p>

            <div className="h-64 w-full">
              {data?.shelter_occupancy && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.shelter_occupancy} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={90} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                    <Bar dataKey="rate" name="Occupancy %" fill="#059669" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
