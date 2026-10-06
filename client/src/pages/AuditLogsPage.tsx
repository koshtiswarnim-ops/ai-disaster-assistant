import React, { useState, useEffect } from 'react';
import { HeaderBand } from '../components/layout/HeaderBand';
import { api } from '../services/api';
import { AuditLog } from '../types';
import { ShieldCheck, Search, Filter, Clock, User, Layers } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    api.getAuditLogs().then(res => setLogs(res.audit_logs || []));
  }, []);

  const filtered = logs.filter(l => {
    const matchesQ = 
      l.action.toLowerCase().includes(query.toLowerCase()) ||
      l.details.toLowerCase().includes(query.toLowerCase()) ||
      l.user_email.toLowerCase().includes(query.toLowerCase());
    const matchesRole = roleFilter === 'all' || l.user_role === roleFilter;
    return matchesQ && matchesRole;
  });

  return (
    <div className="flex-1 bg-slate-50 flex flex-col pb-12">
      <HeaderBand
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Compliance & Telemetry' },
          { label: 'Audit Trail' }
        ]}
        title="Immutable Operational Audit Log"
        description="Tamper-evident record of all emergency authority approvals, resource dispatches, mission progression, and triage state changes."
        statusText="Ledger Verified & Synced"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full mt-6 space-y-4">
        
        {/* Search & Filter Bar */}
        <div className="card-soft p-4 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search audit actions, users, or details..."
              className="input-field text-xs pl-9"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-500">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input-field text-xs w-auto py-1"
            >
              <option value="all">All Roles</option>
              <option value="authority">Authority</option>
              <option value="rescue_team">Rescue Team</option>
              <option value="warehouse">Warehouse</option>
              <option value="hospital">Hospital</option>
              <option value="citizen">Citizen</option>
              <option value="system">System / AI</option>
            </select>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="card-soft overflow-hidden bg-white border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600">
              <thead className="bg-slate-50 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-200/80">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Operator</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {filtered.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(l.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-4 font-sans font-medium text-slate-900 truncate max-w-[150px]">
                      {l.user_email}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-sans font-semibold capitalize">
                        {l.user_role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-blue-700">{l.action}</td>
                    <td className="py-3 px-4 text-slate-500 uppercase">{l.entity_type}</td>
                    <td className="py-3 px-4 font-sans text-slate-700">{l.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
