import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { HeaderBand } from '../components/layout/HeaderBand';
import { IncidentCard } from '../components/incidents/IncidentCard';
import { IncidentDetailModal } from '../components/incidents/IncidentDetailModal';
import { AllocationModal } from '../components/allocation/AllocationModal';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { Incident } from '../types';
import { api } from '../services/api';
import { Search, Filter, Sparkles, Layers, ListFilter } from 'lucide-react';

export const IncidentsPage: React.FC = () => {
  const { incidents, refreshData } = useDisaster();
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [allocationIncident, setAllocationIncident] = useState<Incident | null>(null);

  const filtered = incidents.filter(i => {
    const matchesSearch = 
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.tracking_code.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSeverity = severityFilter === 'all' || i.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || i.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.updateIncident(id, { status: status as any });
      refreshData();
      if (selectedIncident?.id === id) {
        setSelectedIncident(prev => prev ? { ...prev, status: status as any } : null);
      }
    } catch (e: any) {
      alert(`Error updating status: ${e.message}`);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col pb-12">
      <HeaderBand
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Operations' },
          { label: 'Incidents Feed' }
        ]}
        title="Incident Operations & AI Triage Center"
        description="Comprehensive queue of citizen distress reports, AI severity scoring, and dispatch workflows."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full mt-6 space-y-6">
        
        {/* Filter & Search Bar */}
        <div className="card-soft p-4 bg-white flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search incidents, codes, or keywords..."
              className="input-field text-xs pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Severity Filter */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="input-field text-xs w-auto"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field text-xs w-auto"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="verified">Verified</option>
              <option value="prioritized">Prioritized</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Incidents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full card-soft p-12 text-center text-slate-400 text-xs">
              No emergency incidents match current query.
            </div>
          ) : (
            filtered.map(inc => (
              <IncidentCard
                key={inc.id}
                incident={inc}
                isSelected={selectedIncident?.id === inc.id}
                onClick={() => setSelectedIncident(inc)}
                onAllocate={() => setAllocationIncident(inc)}
              />
            ))
          )}
        </div>
      </div>

      <IncidentDetailModal
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onAllocate={(inc) => setAllocationIncident(inc)}
        onUpdateStatus={handleUpdateStatus}
      />

      <AllocationModal
        incident={allocationIncident}
        onClose={() => setAllocationIncident(null)}
      />
    </div>
  );
};
