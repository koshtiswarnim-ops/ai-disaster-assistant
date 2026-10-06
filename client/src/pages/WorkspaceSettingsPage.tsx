import React, { useState } from 'react';
import { 
  UserRound, 
  SlidersHorizontal, 
  BellRing, 
  Send, 
  ShieldAlert, 
  CheckCircle2, 
  Upload, 
  Mail, 
  Trash2, 
  Check, 
  Table2, 
  Webhook, 
  Inbox, 
  BarChart3, 
  Megaphone 
} from 'lucide-react';
import { HeaderBand } from '../components/layout/HeaderBand';

export const WorkspaceSettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'profile' | 'behaviour' | 'notifications' | 'delivery' | 'danger'>('profile');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(true);
  const [unsavedCount, setUnsavedCount] = useState<number>(3);

  // Profile Form State
  const [fullName, setFullName] = useState('Bonnie Green');
  const [email, setEmail] = useState('bonnie@formcraft.io');
  const [workspaceRole, setWorkspaceRole] = useState('Workspace Owner');
  const [timezone, setTimezone] = useState('(GMT-08:00) Pacific Time (US & Canada)');

  // Form Behaviour State
  const [spamFilter, setSpamFilter] = useState(true);
  const [savePartial, setSavePartial] = useState(true);
  const [thankYouRedirect, setThankYouRedirect] = useState(false);
  const [submissionLimit, setSubmissionLimit] = useState<'None' | '100' | '500' | 'Custom'>('500');

  // Notifications State
  const [notifySubmissions, setNotifySubmissions] = useState(true);
  const [notifyWeekly, setNotifyWeekly] = useState(true);
  const [notifyProduct, setNotifyProduct] = useState(false);
  const [alertDelivery, setAlertDelivery] = useState('Email + Slack');

  // Delivery State
  const [selectedDestination, setSelectedDestination] = useState<'sheets' | 'webhook'>('sheets');
  const [replyTo, setReplyTo] = useState('notifications@formcraft.io');
  const [attachUploads, setAttachUploads] = useState(true);

  const handleSave = () => {
    setHasUnsavedChanges(false);
    alert('Settings successfully synchronized.');
  };

  const handleDiscard = () => {
    setHasUnsavedChanges(false);
  };

  const navItems = [
    { id: 'profile', label: 'Profile', icon: UserRound },
    { id: 'behaviour', label: 'Form behaviour', icon: SlidersHorizontal },
    { id: 'notifications', label: 'Notifications', icon: BellRing },
    { id: 'delivery', label: 'Response delivery', icon: Send },
    { id: 'danger', label: 'Danger zone', icon: ShieldAlert },
  ];

  return (
    <div className="flex-1 bg-[#f8fafc] flex flex-col pb-28">
      {/* Header Band */}
      <HeaderBand
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Account' },
          { label: 'Settings' }
        ]}
        title="Workspace settings"
        description="Manage workspace preferences, response delivery endpoints, and agency collaboration telemetry."
        statusText="All systems synced · 2 min ago"
      />

      {/* Main Two-Column Body Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full mt-7 grid grid-cols-1 lg:grid-cols-[208px_minmax(0,1fr)] gap-7 items-start">
        
        {/* Left: Sticky In-Page Section Nav */}
        <aside className="sticky top-24 z-10 hidden lg:block">
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id as any);
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] font-medium text-left transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-white'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-blue-600 rounded-r" />
                  )}
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Horizontal Section Nav */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id as any);
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border ${
                  isActive
                    ? 'bg-blue-50 border-blue-200 text-blue-700 font-semibold'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Column: Stack of Cards */}
        <div className="flex flex-col gap-7">

          {/* 1. Profile Card */}
          <section id="profile" className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">Profile</h2>
                <p className="text-[13px] text-slate-500 mt-0.5">Manage your operator persona and verified dispatch contact credentials</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-semibold">
                Public
              </span>
            </div>

            {/* Profile photo row */}
            <div className="flex flex-col sm:flex-row sm:items-center py-4 border-b border-slate-100">
              <div className="sm:w-52 shrink-0 mb-2 sm:mb-0">
                <span className="text-[13.5px] font-semibold text-slate-800 block">Profile photo</span>
                <span className="text-xs text-slate-400">PNG or JPG, up to 2 MB</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-blue-100 border-2 border-white shadow-xs text-blue-700 font-bold flex items-center justify-center text-lg">
                  BG
                </div>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium"
                >
                  Remove
                </button>
              </div>
            </div>

            {/* Sub-group with hairline dividers */}
            <div className="mt-4 rounded-xl border border-slate-100 divide-y divide-slate-100 overflow-hidden">
              {/* Full Name */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="sm:w-52 shrink-0">
                  <label className="text-[13px] font-semibold text-slate-700 block">Full name</label>
                </div>
                <div className="w-full sm:max-w-md">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                    className="input-field text-xs"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="sm:w-52 shrink-0">
                  <label className="text-[13px] font-semibold text-slate-700 block">Email address</label>
                </div>
                <div className="w-full sm:max-w-md relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                    className="input-field text-xs pl-9"
                  />
                </div>
              </div>

              {/* Workspace Role */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="sm:w-52 shrink-0">
                  <label className="text-[13px] font-semibold text-slate-700 block">Workspace role</label>
                </div>
                <div className="w-full sm:max-w-md">
                  <select
                    value={workspaceRole}
                    onChange={(e) => {
                      setWorkspaceRole(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                    className="input-field text-xs"
                  >
                    <option value="Workspace Owner">Workspace Owner</option>
                    <option value="Emergency Authority">Emergency Authority</option>
                    <option value="Rescue Coordinator">Rescue Coordinator</option>
                    <option value="Auditor">Auditor</option>
                  </select>
                </div>
              </div>

              {/* Timezone */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="sm:w-52 shrink-0">
                  <label className="text-[13px] font-semibold text-slate-700 block">Timezone</label>
                  <span className="text-[11px] text-slate-400">Used for timestamps & SLA metrics</span>
                </div>
                <div className="w-full sm:max-w-md">
                  <select
                    value={timezone}
                    onChange={(e) => {
                      setTimezone(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                    className="input-field text-xs"
                  >
                    <option value="(GMT-08:00) Pacific Time (US & Canada)">(GMT-08:00) Pacific Time (US & Canada)</option>
                    <option value="(GMT-05:00) Eastern Time (US & Canada)">(GMT-05:00) Eastern Time (US & Canada)</option>
                    <option value="(GMT+00:00) UTC">(GMT+00:00) UTC</option>
                    <option value="(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi">(GMT+05:30) Indian Standard Time</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Form Behaviour Card */}
          <section id="behaviour" className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.06)]">
            <div className="border-b border-slate-100 pb-4 mb-4">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Form behaviour</h2>
              <p className="text-[13px] text-slate-500 mt-0.5">Control submission validation, deduplication, and citizen emergency ingress rules</p>
            </div>

            <div className="divide-y divide-slate-100">
              {/* Smart spam filtering */}
              <div className="py-4 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-[13.5px] font-semibold text-slate-800">Smart spam filtering</h4>
                  <p className="text-xs text-slate-500">Automatically flag duplicate or fraudulent distress signals</p>
                </div>
                <input
                  type="checkbox"
                  checked={spamFilter}
                  onChange={(e) => {
                    setSpamFilter(e.target.checked);
                    setHasUnsavedChanges(true);
                  }}
                  className="toggle-checkbox"
                />
              </div>

              {/* Save partial responses */}
              <div className="py-4 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-[13.5px] font-semibold text-slate-800">Save partial responses</h4>
                  <p className="text-xs text-slate-500">Capture in-progress citizen SOS even if connection drops abruptly</p>
                </div>
                <input
                  type="checkbox"
                  checked={savePartial}
                  onChange={(e) => {
                    setSavePartial(e.target.checked);
                    setHasUnsavedChanges(true);
                  }}
                  className="toggle-checkbox"
                />
              </div>

              {/* Custom thank-you redirect */}
              <div className="py-4 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-[13.5px] font-semibold text-slate-800">Custom thank-you redirect</h4>
                  <p className="text-xs text-slate-500">Redirect users to public evacuation shelter directions after submission</p>
                </div>
                <input
                  type="checkbox"
                  checked={thankYouRedirect}
                  onChange={(e) => {
                    setThankYouRedirect(e.target.checked);
                    setHasUnsavedChanges(true);
                  }}
                  className="toggle-checkbox"
                />
              </div>

              {/* Submission Limit Segmented Control */}
              <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-[13.5px] font-semibold text-slate-800">Submission limit</h4>
                  <p className="text-xs text-slate-500">Cap max concurrent live SOS signals before auto-scaling queue</p>
                </div>
                <div className="inline-flex p-1 rounded-lg bg-slate-100 border border-slate-200/80 text-xs">
                  {(['None', '100', '500', 'Custom'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setSubmissionLimit(opt);
                        setHasUnsavedChanges(true);
                      }}
                      className={`px-3 py-1 rounded-md font-medium transition-all ${
                        submissionLimit === opt
                          ? 'bg-white shadow-[0_1px_2px_rgba(15,23,42,0.1)] text-slate-900 font-bold'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 3. Notifications Card */}
          <section id="notifications" className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">Notifications</h2>
                <p className="text-[13px] text-slate-500 mt-0.5">Configure alerting channels, threshold summaries, and operational updates</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setNotifySubmissions(true);
                  setNotifyWeekly(true);
                  setNotifyProduct(true);
                  setHasUnsavedChanges(true);
                }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Select all
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {/* New submissions */}
              <div className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <Inbox className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[13.5px] font-semibold text-slate-800">New submissions</h4>
                    <p className="text-xs text-slate-500">Receive immediate notifications when new SOS emergencies arrive</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifySubmissions}
                  onChange={(e) => {
                    setNotifySubmissions(e.target.checked);
                    setHasUnsavedChanges(true);
                  }}
                  className="toggle-checkbox"
                />
              </div>

              {/* Weekly summary */}
              <div className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[13.5px] font-semibold text-slate-800">Weekly summary</h4>
                    <p className="text-xs text-slate-500">Digest report on response times, resources dispatched, and resolution metrics</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyWeekly}
                  onChange={(e) => {
                    setNotifyWeekly(e.target.checked);
                    setHasUnsavedChanges(true);
                  }}
                  className="toggle-checkbox"
                />
              </div>

              {/* Product news */}
              <div className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[13.5px] font-semibold text-slate-800">Product news</h4>
                    <p className="text-xs text-slate-500">DisasterOS engine updates, new AI model releases, and feature patches</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyProduct}
                  onChange={(e) => {
                    setNotifyProduct(e.target.checked);
                    setHasUnsavedChanges(true);
                  }}
                  className="toggle-checkbox"
                />
              </div>

              {/* Deliver alerts to */}
              <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="sm:w-52 shrink-0">
                  <label className="text-[13px] font-semibold text-slate-800 block">Deliver alerts to</label>
                </div>
                <div className="w-full sm:max-w-md">
                  <select
                    value={alertDelivery}
                    onChange={(e) => {
                      setAlertDelivery(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                    className="input-field text-xs"
                  >
                    <option value="Email only">Email only</option>
                    <option value="Email + Slack">Email + Slack</option>
                    <option value="Slack only">Slack only</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Response Delivery Card */}
          <section id="delivery" className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.06)]">
            <div className="border-b border-slate-100 pb-4 mb-4">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Response delivery</h2>
              <p className="text-[13px] text-slate-500 mt-0.5">Forward emergency data to external spreadsheet logs or municipal webhooks</p>
            </div>

            {/* 2-up Destination Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
              {/* Tile 1: Google Sheets (Selected) */}
              <div 
                onClick={() => {
                  setSelectedDestination('sheets');
                  setHasUnsavedChanges(true);
                }}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  selectedDestination === 'sheets'
                    ? 'border-blue-600 bg-blue-50/50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white shadow-2xs border border-slate-100 flex items-center justify-center text-blue-600">
                    <Table2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Google Sheets</h4>
                    <p className="text-[11px] text-slate-500">Connected · 2 forms</p>
                  </div>
                </div>
                {selectedDestination === 'sheets' && (
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                )}
              </div>

              {/* Tile 2: Webhook */}
              <div 
                onClick={() => {
                  setSelectedDestination('webhook');
                  setHasUnsavedChanges(true);
                }}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  selectedDestination === 'webhook'
                    ? 'border-blue-600 bg-blue-50/50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500">
                    <Webhook className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Webhook</h4>
                    <p className="text-[11px] text-slate-500">Not connected</p>
                  </div>
                </div>
                {selectedDestination === 'webhook' ? (
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                ) : (
                  <span className="text-xs font-semibold text-blue-600">Connect</span>
                )}
              </div>
            </div>

            {/* Sub-group with Reply-to and Toggle */}
            <div className="rounded-xl border border-slate-100 divide-y divide-slate-100">
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="sm:w-52 shrink-0">
                  <label className="text-[13px] font-semibold text-slate-800 block">Reply-to address</label>
                </div>
                <div className="w-full sm:max-w-md">
                  <input
                    type="email"
                    value={replyTo}
                    onChange={(e) => {
                      setReplyTo(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                    className="input-field text-xs"
                  />
                </div>
              </div>

              <div className="p-4 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-[13.5px] font-semibold text-slate-800">Attach file uploads</h4>
                  <p className="text-xs text-slate-500">Include citizen uploaded photo evidence directly in notification payloads</p>
                </div>
                <input
                  type="checkbox"
                  checked={attachUploads}
                  onChange={(e) => {
                    setAttachUploads(e.target.checked);
                    setHasUnsavedChanges(true);
                  }}
                  className="toggle-checkbox"
                />
              </div>
            </div>
          </section>

          {/* 5. Danger Zone Card */}
          <section id="danger" className="rounded-2xl border border-rose-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.06)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-[15px] font-bold text-rose-700 tracking-tight">Delete workspace</h2>
                <p className="text-[13px] text-slate-500 mt-0.5">
                  Permanently erase all disaster incidents, dispatch logs, and facility capacity histories. This action is irreversible.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you absolutely sure you want to delete this workspace and all operational telemetry?')) {
                    alert('Action aborted: Administrative safeguard active.');
                  }
                }}
                className="px-4 py-2 rounded-lg border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 shrink-0 shadow-2xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </section>

        </div>
      </div>

      {/* Sticky Bottom Save Bar */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_12px_rgba(15,23,42,0.05)] py-3">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
            {/* Unsaved Dot Indicator */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <span className="text-[12.5px] font-medium text-slate-600">
                You have {unsavedCount} unsaved changes
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDiscard}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
