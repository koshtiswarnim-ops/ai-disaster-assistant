import React, { useState, useEffect } from 'react';
import { HeaderBand } from '../components/layout/HeaderBand';
import { useAuth } from '../context/AuthContext';
import { useDisaster } from '../context/DisasterContext';
import { api } from '../services/api';
import { 
  Users, 
  HeartHandshake, 
  CheckCircle2, 
  ShieldCheck, 
  PlusCircle, 
  UserPlus, 
  Award, 
  Check, 
  Send,
  Home
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const NgoVolunteersPage: React.FC = () => {
  const { user } = useAuth();
  const { shelters } = useDisaster();
  const navigate = useNavigate();

  const [ngos, setNgos] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['first_aid']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const isNgoOrVolunteer = user.role === 'ngo' || user.role === 'volunteer';

  const fetchData = async () => {
    try {
      const [ngoRes, volRes] = await Promise.all([api.getNgos(), api.getVolunteers()]);
      setNgos(ngoRes.ngos || []);
      setVolunteers(volRes.volunteers || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEnrollVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch('/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          phone,
          skills: selectedSkills
        })
      });
      await fetchData();
      setEnrollModalOpen(false);
      setFullName('');
      setPhone('');
      setNotice('Volunteer successfully registered to DisasterOS Humanitarian Corps!');
      setTimeout(() => setNotice(null), 4000);
    } catch (err: any) {
      alert(`Enrollment failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignTask = async (volId: string, currentTask: string | null) => {
    const nextTask = currentTask ? null : 'Shelter Care & Food Rations Distribution';
    try {
      await api.updateVolunteer(volId, {
        assigned_task: nextTask,
        availability_status: nextTask ? 'deployed' : 'available'
      });
      await fetchData();
    } catch (err: any) {
      alert(`Task assignment failed: ${err.message}`);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col pb-12">
      <HeaderBand
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Community' },
          { label: 'NGOs & Volunteers' }
        ]}
        title="NGO Humanitarian Network & Volunteer Task Matching"
        description="Coordinates accredited non-governmental disaster relief agencies, certified volunteer skills, and humanitarian distributions."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full mt-6 space-y-6">

        {/* ROLE WORKSPACE: NGO / VOLUNTEER OPERATOR */}
        {isNgoOrVolunteer && (
          <div className="card-soft bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-white border-purple-200/80 p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-purple-600 text-white">
                    Civilian Relief Operations
                  </span>
                  <span className="text-xs font-bold text-purple-900">Red Cross & Community Responders</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-purple-600" />
                  Humanitarian Coordination Desk
                </h2>
                <p className="text-xs text-slate-600">
                  {volunteers.length} registered specialists · {volunteers.filter(v => v.availability_status === 'available').length} ready for immediate shelter & aid deployment
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEnrollModalOpen(true)}
                  className="px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-2xs flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Register Specialist Volunteer
                </button>
                <button
                  onClick={() => navigate('/shelters')}
                  className="px-3.5 py-2 rounded-lg bg-white border border-purple-200 hover:bg-purple-50 text-purple-700 text-xs font-bold shadow-2xs flex items-center gap-1.5"
                >
                  <Home className="w-3.5 h-3.5" />
                  View Shelters
                </button>
              </div>
            </div>

            {notice && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{notice}</span>
              </div>
            )}
          </div>
        )}

        {/* NGOs Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Verified Humanitarian Aid Agencies ({ngos.length})
            </h3>
            <span className="text-xs text-slate-400">Accredited Relief Partners</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ngos.map(ngo => (
              <div key={ngo.id} className="card-soft p-5 bg-white border-slate-200 space-y-3">
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{ngo.name}</h4>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Verified
                  </span>
                </div>
                <p className="text-xs text-slate-500">Contact: {ngo.contact_person} ({ngo.phone})</p>
                <div className="flex flex-wrap gap-1">
                  {ngo.specialties?.map((s: string, idx: number) => (
                    <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                      {s.replace('_', ' ')}
                    </span>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-100 text-xs text-purple-700 font-semibold flex items-center justify-between">
                  <span>{ngo.available_units} Field Aid Units Ready</span>
                  <button
                    onClick={() => {
                      setNotice(`Aid coordination channel linked with ${ngo.name}!`);
                      setTimeout(() => setNotice(null), 3000);
                    }}
                    className="text-[11px] text-blue-600 hover:underline"
                  >
                    Coordinate Aid
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Volunteers Section */}
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Registered Specialist Volunteers ({volunteers.length})
            </h3>
            <button
              onClick={() => setEnrollModalOpen(true)}
              className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Enroll Volunteer
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {volunteers.map(vol => (
              <div key={vol.id} className="card-soft p-4 bg-white border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">{vol.full_name}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    vol.availability_status === 'available' ? 'bg-emerald-50 text-emerald-700' : 'bg-purple-50 text-purple-700'
                  }`}>
                    {vol.availability_status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Phone: {vol.phone}</p>
                <div className="flex flex-wrap gap-1">
                  {vol.skills?.map((sk: string, i: number) => (
                    <span key={i} className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium">
                      {sk.replace('_', ' ')}
                    </span>
                  ))}
                </div>
                {vol.assigned_task ? (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 truncate max-w-[150px] font-medium" title={vol.assigned_task}>
                      {vol.assigned_task}
                    </span>
                    <button
                      onClick={() => handleAssignTask(vol.id, vol.assigned_task)}
                      className="text-emerald-700 font-bold hover:underline shrink-0"
                    >
                      Complete
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 italic">No task assigned</span>
                    <button
                      onClick={() => handleAssignTask(vol.id, null)}
                      className="text-purple-700 font-bold hover:underline"
                    >
                      Assign Task
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Enroll Volunteer Modal */}
      {enrollModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Register Community Volunteer
            </h3>

            <form onSubmit={handleEnrollVolunteer} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maria Gonzalez"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 555-0199"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Primary Skill Domain</label>
                <select
                  onChange={(e) => setSelectedSkills([e.target.value])}
                  className="input-field text-xs"
                >
                  <option value="first_aid">Certified First Aid / CPR</option>
                  <option value="translation">Multilingual Translation</option>
                  <option value="water_rescue">Water Safety & Life Guarding</option>
                  <option value="food_distribution">Logistics & Meal Distribution</option>
                  <option value="counseling">Crisis Trauma Counseling</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEnrollModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold"
                >
                  {isSubmitting ? 'Registering...' : 'Register Specialist'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
