import React, { useState } from 'react';
import { Candidate, InterviewStatus } from '../types';
import { ALL_COUNTRIES, ALL_ROLES, COUNTRY_CURRENCIES } from '../data/rateCardData';
import { X, Plus, UserPlus } from 'lucide-react';

interface AddCandidateModalProps {
  onClose: () => void;
  onAdd: (newCandidate: Candidate) => void;
  nextSlotNumber: number;
}

export const AddCandidateModal: React.FC<AddCandidateModalProps> = ({
  onClose,
  onAdd,
  nextSlotNumber
}) => {
  const [name, setName] = useState('');
  const [scheduledTime, setScheduledTime] = useState('02:00 PM');
  const [country, setCountry] = useState('Pakistan');
  const [city, setCity] = useState('');
  const [role, setRole] = useState('Software Engineer');
  const [experienceYears, setExperienceYears] = useState(3);
  const [status, setStatus] = useState<InterviewStatus>('Scheduled');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCand: Candidate = {
      id: `cand-${Date.now()}`,
      slotNumber: nextSlotNumber,
      name: name.trim(),
      scheduledTime,
      country,
      city: city.trim() || undefined,
      role,
      experienceYears: Math.max(0, experienceYears),
      status,
      contactNumber: contactNumber.trim() || undefined,
      email: email.trim() || undefined,
      notes: notes.trim(),
      updatedAt: new Date().toISOString()
    };

    onAdd(newCand);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <UserPlus className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Add New Interview Candidate</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Candidate Name *
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Asad Ullah"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Scheduled Time Slot
              </label>
              <input
                type="text"
                placeholder="e.g. 03:30 PM"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Country
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {ALL_COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c} ({COUNTRY_CURRENCIES[c] || 'USD'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                City / Location
              </label>
              <input
                type="text"
                placeholder="e.g. Lahore / Remote"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Target Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {ALL_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Experience (Years)
              </label>
              <input
                type="number"
                min="0"
                max="35"
                value={experienceYears}
                onChange={(e) => setExperienceYears(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Phone / WhatsApp (Optional)
              </label>
              <input
                type="text"
                placeholder="+92 300 0000000"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="In Interview">In Interview</option>
                <option value="Offer Extended">Offer Extended</option>
                <option value="Passed to Next Round">Passed to Next Round</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Interview Notes / Requirements
            </label>
            <textarea
              rows={2}
              placeholder="Candidate background, key interview focus areas..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Candidate (Slot #{nextSlotNumber})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
