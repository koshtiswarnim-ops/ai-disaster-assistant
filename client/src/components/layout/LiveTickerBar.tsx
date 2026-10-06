import React, { useState, useEffect } from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { Link } from 'react-router-dom';
import { Activity, Radio } from 'lucide-react';

export const LiveTickerBar: React.FC = () => {
  const { incidents, hospitals, rescueTeams } = useDisaster();
  const [utcTime, setUtcTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toTimeString().split(' ')[0] + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const criticalIncidents = incidents.filter(i => i.severity === 'critical');
  const availableBeds = hospitals.reduce((acc, h) => acc + (h.available_beds || 0), 0);
  const activeTeams = rescueTeams.filter(t => t.status === 'dispatched' || t.status === 'on_scene');

  const tickerFeed = [
    {
      id: 'feed-1',
      badge: 'FLOOD ALERT',
      badgeColor: 'text-blue-700 bg-blue-50 border-blue-200',
      text: 'Zone A Marina Waterfront: Flash flood surge rising at 2.4 in/hr — Peak crest predicted in 38 mins',
      link: '/risk-analysis',
    },
    {
      id: 'feed-2',
      badge: 'SEISMIC WATCH',
      badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
      text: 'USGS Stream: 5.4M event with 4 active aftershocks — Structural triage units deployed to Zone B',
      link: '/risk-analysis',
    },
    {
      id: 'feed-3',
      badge: 'FIRE PERIMETER',
      badgeColor: 'text-rose-700 bg-rose-50 border-rose-200',
      text: 'Zone C Hillside: Chemical fire plume spreading NE at 12 km/h — Evacuation buffer active',
      link: '/risk-analysis',
    },
    {
      id: 'feed-4',
      badge: 'GALE ADVISORY',
      badgeColor: 'text-purple-700 bg-purple-50 border-purple-200',
      text: 'Storm Zephyr: 108 km/h wind gusts detected — Power grid backup generators deployed to shelters',
      link: '/map',
    },
    {
      id: 'feed-5',
      badge: 'AI ASSISTANT',
      badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      text: 'Location-specific intelligence online: Ask AI for neighborhood safety, nearest shelters & safe routes',
      link: '/ai-assistant',
    },
    {
      id: 'feed-6',
      badge: 'FAST DISPATCH',
      badgeColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      text: `${activeTeams.length} taskforces active · ${availableBeds} trauma beds available · Sub-second AI allocation active`,
      link: '/command-center',
    }
  ];

  return (
    <div className="w-full bg-slate-100 border-b border-slate-200 text-xs overflow-hidden flex items-center h-8 select-none relative z-30">
      
      {/* Left Station Badge */}
      <div className="shrink-0 flex items-center gap-1.5 px-3 h-full bg-slate-900 text-white font-mono text-[10.5px] uppercase font-bold tracking-wider z-20 shadow-xs">
        <Radio className="w-3 h-3 text-rose-400 animate-pulse" />
        <span className="hidden sm:inline">LIVE SITREP</span>
        <span className="sm:hidden">SITREP</span>
      </div>

      {/* Sliding Marquee Track */}
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        {/* Soft edge gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-100 to-transparent z-10 pointer-events-none" />
        
        {/* Continuous sliding loop (2 repetitions for seamless infinite scroll) */}
        <div className="animate-ticker flex items-center gap-8 pl-4 cursor-pointer hover:pause font-mono text-[11px]">
          {tickerFeed.concat(tickerFeed).map((item, idx) => (
            <Link
              key={`${item.id}-${idx}`}
              to={item.link}
              className="flex items-center gap-2 hover:opacity-75 transition-opacity shrink-0 group"
            >
              <span className={`px-1.5 py-0.5 rounded border text-[9.5px] font-semibold tracking-wider ${item.badgeColor}`}>
                {item.badge}
              </span>
              <span className="text-slate-700 group-hover:text-slate-900 font-medium">
                {item.text}
              </span>
              <span className="text-slate-300 font-normal pl-3">///</span>
            </Link>
          ))}
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-100 to-transparent z-10 pointer-events-none" />
      </div>

      {/* Right Telemetry / UTC Clock */}
      <div className="hidden md:flex items-center gap-3 px-3 h-full bg-slate-100 border-l border-slate-200/90 shrink-0 font-mono text-[10.5px] text-slate-500 z-20">
        <div className="flex items-center gap-1 text-emerald-700">
          <Activity className="w-3 h-3 animate-pulse text-emerald-600" />
          <span className="font-semibold text-[10px]">EOC ONLINE</span>
        </div>
        <span className="text-slate-300">|</span>
        <span className="font-mono text-slate-700 font-medium">{utcTime}</span>
      </div>

    </div>
  );
};
