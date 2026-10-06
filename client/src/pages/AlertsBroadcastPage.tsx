import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { HeaderBand } from '../components/layout/HeaderBand';
import { api } from '../services/api';
import { Bell, Radio, Send, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

export const AlertsBroadcastPage: React.FC = () => {
  const { alerts, refreshData } = useDisaster();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('critical');
  const [affectedArea, setAffectedArea] = useState('Zone A - Waterfront Basin');
  const [channels, setChannels] = useState<string[]>(['push', 'sms']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleChannel = (ch: string) => {
    setChannels(prev => prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch]);
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    setIsSubmitting(true);
    try {
      await api.createAlert({
        title,
        message,
        severity,
        affected_area: affectedArea,
        channels
      });
      refreshData();
      setTitle('');
      setMessage('');
      alert('Emergency Broadcast dispatched to active communication towers.');
    } catch (e: any) {
      alert(`Broadcast failed: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col pb-12">
      <HeaderBand
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Communications' },
          { label: 'Emergency Alerts' }
        ]}
        title="Public Emergency Alert & Evacuation Broadcast"
        description="Multi-channel siren, push notifications, and SMS emergency broadcast transmitter."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Broadcast Composer */}
        <div className="lg:col-span-6 card-soft p-6 bg-white border-slate-200">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Radio className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Compose Emergency Broadcast
            </h3>
          </div>

          <form onSubmit={handleBroadcast} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Alert Headline / Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Flash Flood Evacuation Order - Low-Lying Marina Basin"
                className="input-field text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Severity Level</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="input-field text-xs"
                >
                  <option value="critical">Critical (Life Safety)</option>
                  <option value="severe">Severe Warning</option>
                  <option value="warning">Moderate Advisory</option>
                  <option value="info">Informational</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Target Geographic Zone</label>
                <input
                  type="text"
                  value={affectedArea}
                  onChange={(e) => setAffectedArea(e.target.value)}
                  className="input-field text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Transmission Message Body</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Include safe evacuation routes, shelter locations, and emergency precautions..."
                className="input-field text-xs resize-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">Transmission Channels</label>
              <div className="flex flex-wrap gap-2 text-xs">
                {['push', 'sms', 'siren', 'wea'].map(ch => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => toggleChannel(ch)}
                    className={`px-3 py-1.5 rounded-lg border font-medium uppercase tracking-wider text-[11px] transition-colors ${
                      channels.includes(ch)
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Broadcasting requires Emergency Authority clearance</span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/10 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? 'Transmitting...' : 'Transmit Alert'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Broadcast History */}
        <div className="lg:col-span-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Active Broadcast Feed ({alerts.length})
          </h3>

          <div className="space-y-3">
            {alerts.map(a => (
              <div key={a.id} className="card-soft p-4 bg-white border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    a.severity === 'critical' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {a.severity.toUpperCase()}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(a.sent_at).toLocaleTimeString()}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{a.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{a.message}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Zone: <strong>{a.affected_area}</strong></span>
                  <span className="uppercase text-[10px] font-medium font-mono">Channels: {a.channels?.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
