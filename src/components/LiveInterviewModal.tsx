import React, { useState, useEffect } from 'react';
import { Candidate, InterviewStatus } from '../types';
import {
  calculateCandidateRate,
  formatRate,
  COUNTRY_CURRENCIES,
  CURRENCY_SYMBOLS
} from '../data/rateCardData';
import { generateOfferPitch } from '../services/pitchGenerator';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Check,
  Copy,
  Clock,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Star,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  ShieldAlert,
  Save,
  CheckCircle2
} from 'lucide-react';

interface LiveInterviewModalProps {
  candidate: Candidate;
  allCandidates: Candidate[];
  onClose: () => void;
  onSaveCandidate: (updated: Candidate) => void;
  onNavigateCandidate: (candidateId: string) => void;
}

export const LiveInterviewModal: React.FC<LiveInterviewModalProps> = ({
  candidate,
  allCandidates,
  onClose,
  onSaveCandidate,
  onNavigateCandidate
}) => {
  // Candidate form states
  const [name, setName] = useState(candidate.name);
  const [country, setCountry] = useState(candidate.country);
  const [role, setRole] = useState(candidate.role);
  const [experienceYears, setExperienceYears] = useState(candidate.experienceYears);
  const [status, setStatus] = useState<InterviewStatus>(candidate.status);
  const [notes, setNotes] = useState(candidate.notes || '');
  const [askingRate, setAskingRate] = useState<string>(
    candidate.candidateAskingRate ? candidate.candidateAskingRate.toString() : ''
  );
  const [askingPeriod, setAskingPeriod] = useState<'hr' | '5h' | '8h' | 'month'>(
    candidate.candidateAskingPeriod || 'hr'
  );
  const [agreedRate, setAgreedRate] = useState<string>(
    candidate.agreedRate ? candidate.agreedRate.toString() : ''
  );
  const [agreedPeriod, setAgreedPeriod] = useState<'hr' | '5h' | '8h' | 'month'>(
    candidate.agreedPeriod || 'hr'
  );

  // Ratings
  const [techScore, setTechScore] = useState(candidate.evaluation?.technicalRating || 4);
  const [commScore, setCommScore] = useState(candidate.evaluation?.communicationRating || 4);
  const [probScore, setProbScore] = useState(candidate.evaluation?.problemSolvingRating || 4);

  // Stopwatch timer state
  const [timerSeconds, setTimerSeconds] = useState(candidate.callDurationSeconds || 0);
  const [isTimerRunning, setIsTimerRunning] = useState(candidate.status === 'In Interview');

  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Calculate live rate for candidate
  const calc = calculateCandidateRate(country, role, experienceYears);
  const numericAsking = askingRate ? parseFloat(askingRate) : null;
  const pitch = calc ? generateOfferPitch(calc, name, numericAsking, askingPeriod) : null;

  const currency = COUNTRY_CURRENCIES[country] || 'USD';
  const currencySymbol = CURRENCY_SYMBOLS[currency] || (currency + ' ');

  // Stopwatch interval
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleSave = () => {
    const updated: Candidate = {
      ...candidate,
      name,
      country,
      role,
      experienceYears,
      status,
      notes,
      candidateAskingRate: askingRate ? parseFloat(askingRate) : undefined,
      candidateAskingPeriod: askingPeriod,
      agreedRate: agreedRate ? parseFloat(agreedRate) : undefined,
      agreedPeriod: agreedPeriod,
      callDurationSeconds: timerSeconds,
      evaluation: {
        technicalRating: techScore,
        communicationRating: commScore,
        problemSolvingRating: probScore,
        availabilityRating: 4,
        overallRecommendation: techScore >= 4 ? 'Hire' : 'Borderline'
      },
      updatedAt: new Date().toISOString()
    };

    onSaveCandidate(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // Find index for prev/next
  const currentIndex = allCandidates.findIndex((c) => c.id === candidate.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allCandidates.length - 1;

  const handleApplyBenchmarkAsAgreed = () => {
    if (!calc) return;
    setAgreedRate(calc.hourlyLocal.toFixed(0));
    setAgreedPeriod('hr');
    setStatus('Offer Extended');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Top Header of Cockpit */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 flex items-center justify-center font-mono font-bold text-xs">
              #{candidate.slotNumber}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">{name}</h2>
                <span className="text-xs text-slate-400 font-mono">({candidate.scheduledTime})</span>
              </div>
              <div className="text-xs text-slate-400">
                {role} · {country} · {experienceYears} yrs experience ({calc?.tierLabel})
              </div>
            </div>
          </div>

          {/* Stopwatch & Navigation */}
          <div className="flex items-center gap-3">
            {/* Live Call Stopwatch */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-xs">
              <span className="text-slate-400">Call Time:</span>
              <span
                className={`font-bold tabular-nums text-sm ${
                  isTimerRunning ? 'text-emerald-400 animate-pulse' : 'text-slate-300'
                }`}
              >
                {formatTimer(timerSeconds)}
              </span>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 ml-1 transition-colors"
                title={isTimerRunning ? 'Pause Call Timer' : 'Start Call Timer'}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(0);
                }}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Reset Timer"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* Prev / Next navigation */}
            <div className="flex items-center gap-1 border border-slate-800 bg-slate-900 p-0.5 rounded-lg">
              <button
                disabled={!hasPrev}
                onClick={() => {
                  handleSave();
                  if (hasPrev) onNavigateCandidate(allCandidates[currentIndex - 1].id);
                }}
                className="p-1.5 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                title="Previous Candidate"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono text-slate-400 px-1">
                {currentIndex + 1} / {allCandidates.length}
              </span>
              <button
                disabled={!hasNext}
                onClick={() => {
                  handleSave();
                  if (hasNext) onNavigateCandidate(allCandidates[currentIndex + 1].id);
                }}
                className="p-1.5 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                title="Next Candidate"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cockpit Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Candidate & Interview Status */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Status Selector */}
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Current Interview Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Interview">In Interview</option>
                  <option value="Offer Extended">Offer Extended</option>
                  <option value="Offer Accepted">Offer Accepted</option>
                  <option value="Counter-Offered">Counter-Offered</option>
                  <option value="Passed to Next Round">Passed to Next Round</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Candidate Info Edit */}
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
                  Candidate Profile & Experience
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Experience (Years)</label>
                    <input
                      type="number"
                      min="0"
                      max="35"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Seniority Tier</label>
                    <div className="px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-800/80 text-xs font-mono font-bold text-indigo-300">
                      {calc?.tierLabel}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Candidate Asking Rate ({currency})</label>
                  <div className="grid grid-cols-12 gap-2">
                    <input
                      type="number"
                      placeholder="e.g. 1500"
                      value={askingRate}
                      onChange={(e) => setAskingRate(e.target.value)}
                      className="col-span-7 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                    <select
                      value={askingPeriod}
                      onChange={(e) => setAskingPeriod(e.target.value as any)}
                      className="col-span-5 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none"
                    >
                      <option value="hr">/hr</option>
                      <option value="5h">/5h half-day</option>
                      <option value="8h">/8h full-day</option>
                      <option value="month">/month</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] text-slate-400 font-medium">Final Agreed / Offered Rate</label>
                    <button
                      type="button"
                      onClick={handleApplyBenchmarkAsAgreed}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 underline"
                    >
                      Use Benchmark Rate
                    </button>
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <input
                      type="number"
                      placeholder="e.g. 1324"
                      value={agreedRate}
                      onChange={(e) => setAgreedRate(e.target.value)}
                      className="col-span-7 bg-slate-900 border border-emerald-700/80 rounded-lg px-3 py-1.5 text-xs text-emerald-300 font-mono font-bold focus:outline-none focus:border-emerald-500"
                    />
                    <select
                      value={agreedPeriod}
                      onChange={(e) => setAgreedPeriod(e.target.value as any)}
                      className="col-span-5 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none"
                    >
                      <option value="hr">/hr</option>
                      <option value="5h">/5h half-day</option>
                      <option value="8h">/8h full-day</option>
                      <option value="month">/month</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Evaluation Scores (1-5 Stars) */}
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
                  Call Evaluation Rubric
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Technical Depth</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setTechScore(star)}
                          className={`p-1 ${star <= techScore ? 'text-amber-400' : 'text-slate-700'}`}
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">English & Communication</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setCommScore(star)}
                          className={`p-1 ${star <= commScore ? 'text-amber-400' : 'text-slate-700'}`}
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Problem Solving</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setProbScore(star)}
                          className={`p-1 ${star <= probScore ? 'text-amber-400' : 'text-slate-700'}`}
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Interview Notes & Candidate Comments
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter remarks, strengths, availability date, shift preferences..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Right Column: Live Rate Card Benchmarks & Ready Pitches */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Benchmark Rates Card */}
              {calc && (
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[11px] font-mono text-indigo-400 uppercase font-semibold">
                        2026 Official Benchmark
                      </span>
                      <h3 className="text-sm font-bold text-white mt-0.5">
                        {role} · {country}
                      </h3>
                    </div>
                    <span className="text-xs bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded font-mono font-bold">
                      {calc.tierLabel}
                    </span>
                  </div>

                  {/* 4 Rate Display Boxes */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400">Hourly Rate</div>
                      <div className="text-lg font-mono font-bold text-white tabular-nums">
                        {formatRate(calc.hourlyLocal, calc.currency, true)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        ~${calc.hourlyUsd.toFixed(1)} USD
                      </div>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-xl border border-emerald-900/60 ring-1 ring-emerald-500/20">
                      <div className="text-[10px] text-emerald-400 font-medium">Full-Day (8h Shift)</div>
                      <div className="text-lg font-mono font-bold text-emerald-400 tabular-nums">
                        {formatRate(calc.fullDay8hLocal, calc.currency, false)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        ~${calc.fullDay8hUsd.toFixed(0)} USD
                      </div>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400">Half-Day (5h Shift)</div>
                      <div className="text-sm font-mono font-semibold text-slate-200 tabular-nums">
                        {formatRate(calc.halfDay5hLocal, calc.currency, false)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        ~${calc.halfDay5hUsd.toFixed(0)} USD
                      </div>
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400">Monthly Est. (22d)</div>
                      <div className="text-sm font-mono font-semibold text-slate-200 tabular-nums">
                        {formatRate(calc.monthlyLocal, calc.currency, false)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        ~${Math.round(calc.monthlyUsd).toLocaleString()} USD
                      </div>
                    </div>
                  </div>

                  {/* Negotiation Delta Feedback */}
                  {pitch && pitch.deltaPercent !== undefined && (
                    <div
                      className={`p-3 rounded-xl border text-xs ${
                        pitch.deltaStatus === 'below'
                          ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                          : pitch.deltaStatus === 'exact'
                          ? 'bg-blue-950/40 border-blue-800 text-blue-300'
                          : pitch.deltaStatus === 'slightly_above'
                          ? 'bg-amber-950/40 border-amber-800 text-amber-300'
                          : 'bg-rose-950/40 border-rose-800 text-rose-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold mb-1">
                        <span>Candidate Asking Comparison:</span>
                        <span className="font-mono">
                          {pitch.deltaPercent > 0 ? `+${pitch.deltaPercent}%` : `${pitch.deltaPercent}%`} vs benchmark
                        </span>
                      </div>
                      <p className="opacity-90">{pitch.negotiationAdvice}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Ready-to-Copy Offer Pitches */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Direct Negotiation Scripts
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">Click to Copy</span>
                </div>

                {/* Urdu Version */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300">
                      WhatsApp Pitch (Roman Urdu)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(pitch?.urduText || '', 'urdu')}
                      className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white"
                    >
                      {copiedType === 'urdu' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedType === 'urdu' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed max-h-32 overflow-y-auto">
                    {pitch?.urduText}
                  </div>
                </div>

                {/* English Version */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300">
                      Formal Offer Pitch (English)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(pitch?.englishText || '', 'english')}
                      className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white"
                    >
                      {copiedType === 'english' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedType === 'english' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed max-h-32 overflow-y-auto">
                    {pitch?.englishText}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="bg-slate-950 px-6 py-3.5 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {saveSuccess ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-lg">
                <CheckCircle2 className="w-4 h-4" /> Changes saved to interview record!
              </span>
            ) : (
              <span className="text-xs text-slate-400">
                Slot #{candidate.slotNumber} of {allCandidates.length}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              Close
            </button>

            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Record Evaluation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
