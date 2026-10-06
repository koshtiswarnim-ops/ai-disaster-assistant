import React from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { AlertTriangle, Info, CheckCircle2, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { liveNotifications, dismissNotification } = useDisaster();

  if (liveNotifications.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {liveNotifications.map((notif) => {
        let borderClass = 'border-l-slate-900';
        let icon = <Info className="w-4 h-4 text-slate-700" />;

        if (notif.type === 'SOS_CREATED' || notif.severity === 'info' && notif.title.includes('✅')) {
          borderClass = 'border-l-emerald-600';
          icon = <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
        } else if (notif.severity === 'critical') {
          borderClass = 'border-l-rose-600';
          icon = <AlertTriangle className="w-4 h-4 text-rose-600" />;
        } else if (notif.severity === 'high') {
          borderClass = 'border-l-amber-500';
          icon = <AlertTriangle className="w-4 h-4 text-amber-600" />;
        }

        return (
          <div
            key={notif.id}
            className={`pointer-events-auto bg-white border border-slate-200 border-l-4 ${borderClass} p-3 rounded shadow-lg flex items-start gap-3 transition-all animate-in slide-in-from-bottom-5`}
          >
            <div className="mt-0.5 shrink-0">{icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-900 leading-tight truncate">{notif.title}</p>
                <span className="text-[10px] font-mono text-slate-400 ml-2">{notif.timestamp}</span>
              </div>
              <p className="text-[11.5px] text-slate-600 font-normal mt-0.5 leading-snug line-clamp-2">
                {notif.message}
              </p>
            </div>
            <button
              onClick={() => dismissNotification(notif.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
