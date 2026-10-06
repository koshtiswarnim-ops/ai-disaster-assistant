import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface HeaderBandProps {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  description: string;
  statusText?: string;
  actionButton?: React.ReactNode;
}

export const HeaderBand: React.FC<HeaderBandProps> = ({
  breadcrumbs,
  title,
  description,
  statusText = 'SYSTEM SYNCHRONIZED · LIVE',
  actionButton
}) => {
  return (
    <div className="bg-white border-b border-slate-200/80 pt-4 pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[11.5px] font-medium text-slate-400 mb-1.5">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={idx}>
                {crumb.path && !isLast ? (
                  <Link to={crumb.path} className="hover:text-slate-800 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={isLast ? 'text-slate-700 font-semibold' : ''}>
                    {crumb.label}
                  </span>
                )}
                {!isLast && <ChevronRight className="w-3 h-3 text-slate-300" />}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Title and Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-[22px] font-bold tracking-tight text-slate-900 leading-tight">
              {title}
            </h1>
            <p className="text-xs text-slate-500 font-normal mt-0.5 max-w-3xl">
              {description}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {statusText && (
              <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-slate-200 bg-slate-50 text-slate-600 text-[11px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{statusText}</span>
              </div>
            )}
            {actionButton}
          </div>
        </div>
      </div>
    </div>
  );
};
