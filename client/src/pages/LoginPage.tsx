import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { availableRoles, setRole, user } = useAuth();
  const navigate = useNavigate();

  const handleSelectRole = (role: UserRole) => {
    setRole(role);
    if (role === 'citizen') {
      navigate('/sos');
    } else {
      navigate('/command-center');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="max-w-md w-full p-6 sm:p-8 bg-white border border-slate-200 rounded">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-white mx-auto mb-3">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            DisasterOS Access Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Select an authorized stakeholder persona to access the operational coordination console.
          </p>
        </div>

        {/* Personas selection */}
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {availableRoles.map((r) => {
            const isCurrent = user.role === r.role;
            return (
              <button
                key={r.role}
                onClick={() => handleSelectRole(r.role)}
                className={`w-full p-3 rounded border text-left flex items-center justify-between transition-colors ${
                  isCurrent
                    ? 'border-slate-900 ring-1 ring-slate-900 bg-slate-50/60'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-900">{r.label}</span>
                    <span className="text-[10px] text-slate-400 font-mono uppercase">[{r.role}]</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{r.name} · {r.org}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <button
            onClick={() => navigate('/command-center')}
            className="text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            Bypass to Operations Command Center &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
