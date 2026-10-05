import React, { useState, useMemo } from 'react';
import { Candidate, InterviewStatus } from '../types/index';
import {
  calculateCandidateRate,
  formatRate,
  COUNTRY_CURRENCIES
} from '../data/rateCardData';
import {
  Search,
  Users,
  Filter,
  Clock,
  Printer,
  RotateCcw,
  ExternalLink,
  Award,
  Plus,
  Calculator
} from 'lucide-react';

interface InterviewDeskProps {
  candidates: Candidate[];
  onOpenInterview: (candidate: Candidate) => void;
  onUpdateCandidate: (candidate: Candidate) => void;
  onDeleteCandidate: (id: string) => void;
  onResetCandidates: () => void;
  onAddNewClick: () => void;
  onNavigateToCalculator?: () => void;
}

export const InterviewDesk: React.FC<InterviewDeskProps> = ({
  candidates,
  onOpenInterview,
  onUpdateCandidate,
  onDeleteCandidate,
  onResetCandidates,
  onAddNewClick,
  onNavigateToCalculator
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [countryFilter, setCountryFilter] = useState<string>('All');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = candidates.length;
    const scheduled = candidates.filter((c) => c.status === 'Scheduled').length;
    const inInterview = candidates.filter((c) => c.status === 'In Interview').length;
    const offered = candidates.filter(
      (c) => c.status === 'Offer Extended' || c.status === 'Offer Accepted'
    ).length;
    const passed = candidates.filter((c) => c.status === 'Passed to Next Round').length;
    const counterOffered = candidates.filter((c) => c.status === 'Counter-Offered').length;
    const rejected = candidates.filter((c) => c.status === 'Rejected').length;

    return { total, scheduled, inInterview, offered, passed, counterOffered, rejected };
  }, [candidates]);

  // Filtered List
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      if (statusFilter !== 'All' && c.status !== statusFilter) return false;
      if (countryFilter !== 'All' && c.country !== countryFilter) return false;
      if (roleFilter !== 'All' && c.role !== roleFilter) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesRole = c.role.toLowerCase().includes(q);
        const matchesCountry = c.country.toLowerCase().includes(q);
        const matchesCity = (c.city || '').toLowerCase().includes(q);
        const matchesSlot = `#${c.slotNumber}`.includes(q) || c.slotNumber.toString() === q;
        if (!matchesName && !matchesRole && !matchesCountry && !matchesCity && !matchesSlot) {
          return false;
        }
      }
      return true;
    });
  }, [candidates, statusFilter, countryFilter, roleFilter, search]);

  const handleStatusChange = (cand: Candidate, newStatus: InterviewStatus) => {
    onUpdateCandidate({
      ...cand,
      status: newStatus,
      updatedAt: new Date().toISOString()
    });
  };

  const getStatusBadge = (status: InterviewStatus) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'In Interview':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Offer Extended':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Offer Accepted':
        return 'bg-green-600/20 text-green-300 border-green-500/30';
      case 'Counter-Offered':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Passed to Next Round':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'Rejected':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Top Banner & Overview */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 sm:p-7 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs uppercase tracking-wider font-mono text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded">
                Candidate Evaluation Workspace
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-400 font-medium">Real-Time Offer Tracking</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Candidate Offer & Interview Desk
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Log candidate interviews, evaluate against official 2026 country benchmark pay rates, and generate tailored negotiation offers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => window.print()}
              title="Print Candidate Roster"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Roster</span>
            </button>

            {candidates.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Clear all candidate records?')) {
                    onResetCandidates();
                  }
                }}
                title="Clear all candidates"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-medium transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}

            <button
              onClick={onAddNewClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Candidate</span>
            </button>
          </div>
        </div>

        {/* Status Metrics Bar */}
        {candidates.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            <button
              onClick={() => setStatusFilter('All')}
              className={`p-3 rounded-xl border text-left transition-all ${
                statusFilter === 'All'
                  ? 'bg-indigo-600/20 border-indigo-500 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-[11px] font-medium uppercase text-slate-400">Total Pipeline</div>
              <div className="text-xl font-bold font-mono text-white mt-0.5">{metrics.total}</div>
            </button>

            <button
              onClick={() => setStatusFilter('Scheduled')}
              className={`p-3 rounded-xl border text-left transition-all ${
                statusFilter === 'Scheduled'
                  ? 'bg-blue-600/20 border-blue-500 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-[11px] font-medium uppercase text-slate-400">Scheduled</div>
              <div className="text-xl font-bold font-mono text-blue-300 mt-0.5">{metrics.scheduled}</div>
            </button>

            <button
              onClick={() => setStatusFilter('In Interview')}
              className={`p-3 rounded-xl border text-left transition-all ${
                statusFilter === 'In Interview'
                  ? 'bg-amber-600/20 border-amber-500 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-[11px] font-medium uppercase text-slate-400">In Interview</div>
              <div className="text-xl font-bold font-mono text-amber-300 mt-0.5">{metrics.inInterview}</div>
            </button>

            <button
              onClick={() => setStatusFilter('Offer Extended')}
              className={`p-3 rounded-xl border text-left transition-all ${
                statusFilter === 'Offer Extended'
                  ? 'bg-emerald-600/20 border-emerald-500 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-[11px] font-medium uppercase text-slate-400">Offered</div>
              <div className="text-xl font-bold font-mono text-emerald-300 mt-0.5">{metrics.offered}</div>
            </button>

            <button
              onClick={() => setStatusFilter('Passed to Next Round')}
              className={`p-3 rounded-xl border text-left transition-all ${
                statusFilter === 'Passed to Next Round'
                  ? 'bg-indigo-600/20 border-indigo-500 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-[11px] font-medium uppercase text-slate-400">Passed</div>
              <div className="text-xl font-bold font-mono text-indigo-300 mt-0.5">{metrics.passed}</div>
            </button>

            <button
              onClick={() => setStatusFilter('Counter-Offered')}
              className={`p-3 rounded-xl border text-left transition-all ${
                statusFilter === 'Counter-Offered'
                  ? 'bg-purple-600/20 border-purple-500 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-[11px] font-medium uppercase text-slate-400">Counter</div>
              <div className="text-xl font-bold font-mono text-purple-300 mt-0.5">{metrics.counterOffered}</div>
            </button>

            <button
              onClick={() => setStatusFilter('Rejected')}
              className={`p-3 rounded-xl border text-left transition-all ${
                statusFilter === 'Rejected'
                  ? 'bg-rose-600/20 border-rose-500 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-[11px] font-medium uppercase text-slate-400">Rejected</div>
              <div className="text-xl font-bold font-mono text-rose-300 mt-0.5">{metrics.rejected}</div>
            </button>
          </div>
        ) : null}
      </div>

      {/* Empty State when 0 candidates */}
      {candidates.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-indigo-950/70 border border-indigo-800/60 text-indigo-400 flex items-center justify-center mx-auto">
            <Users className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white">No Candidate Offers Logged Yet</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            All mock profiles have been removed. Add your first real candidate to evaluate their experience against official 2026 benchmarks or compute starting offers in the Pay Calculator.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={onAddNewClick}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Candidate</span>
            </button>
            {onNavigateToCalculator && (
              <button
                onClick={onNavigateToCalculator}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
              >
                <Calculator className="w-4 h-4" />
                <span>Open Pay Calculator</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Active Candidate Roster & Search */
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search candidates, roles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Filter className="w-3.5 h-3.5" />
                <span>Filters:</span>
              </div>

              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="All">All Countries</option>
                {Array.from(new Set(candidates.map((c) => c.country))).map((co) => (
                  <option key={co} value={co}>{co}</option>
                ))}
              </select>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="All">All Roles</option>
                {Array.from(new Set(candidates.map((c) => c.role))).map((ro) => (
                  <option key={ro} value={ro}>{ro}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table View */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4 font-semibold">Candidate</th>
                    <th className="py-3.5 px-4 font-semibold">Location</th>
                    <th className="py-3.5 px-4 font-semibold">Role & Experience</th>
                    <th className="py-3.5 px-4 font-semibold">Benchmark (Full Day 8h)</th>
                    <th className="py-3.5 px-4 font-semibold">Asking vs Agreed</th>
                    <th className="py-3.5 px-4 font-semibold">Evaluation Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-xs">
                  {filteredCandidates.map((cand) => {
                    const calc = calculateCandidateRate(cand.country, cand.role, cand.experienceYears);
                    const currency = COUNTRY_CURRENCIES[cand.country] || 'USD';

                    return (
                      <tr
                        key={cand.id}
                        className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                        onClick={() => onOpenInterview(cand)}
                      >
                        {/* Slot & Candidate */}
                        <td className="py-3.5 px-4 font-sans">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 text-indigo-400 font-mono font-bold flex items-center justify-center text-xs shrink-0">
                              #{cand.slotNumber}
                            </span>
                            <div>
                              <div className="font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                                <span>{cand.name}</span>
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-500" />
                                <span>{cand.scheduledTime}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="py-3.5 px-4 font-sans text-slate-300">
                          <div className="font-medium text-white">{cand.country}</div>
                          {cand.city && <div className="text-[11px] text-slate-400">{cand.city}</div>}
                        </td>

                        {/* Role & Experience */}
                        <td className="py-3.5 px-4 font-sans">
                          <div className="font-semibold text-slate-200">{cand.role}</div>
                          <div className="text-[11px] text-indigo-400 font-mono font-medium flex items-center gap-1 mt-0.5">
                            <Award className="w-3 h-3" />
                            <span>
                              {cand.experienceYears} yrs ({calc?.tierLabel})
                            </span>
                          </div>
                        </td>

                        {/* Benchmark Rates */}
                        <td className="py-3.5 px-4 tabular-nums">
                          {calc ? (
                            <div>
                              <div className="font-bold text-emerald-400 font-mono">
                                {formatRate(calc.fullDay8hLocal, currency, false)} /day
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono">
                                {formatRate(calc.hourlyLocal, currency, true)}/hr (~${calc.hourlyUsd.toFixed(1)} USD)
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>

                        {/* Asking vs Agreed */}
                        <td className="py-3.5 px-4 font-sans">
                          {cand.candidateAskingRate ? (
                            <div className="text-[11px] text-slate-300 font-mono">
                              <span className="text-slate-400">Ask:</span>{' '}
                              <span className="font-semibold">{formatRate(cand.candidateAskingRate, currency, cand.candidateAskingPeriod === 'hr')}</span>
                              {cand.candidateAskingPeriod ? `/${cand.candidateAskingPeriod}` : ''}
                            </div>
                          ) : (
                            <div className="text-[11px] text-slate-500 italic">No ask recorded</div>
                          )}

                          {cand.agreedRate ? (
                            <div className="text-[11px] text-emerald-300 font-mono font-bold mt-0.5">
                              <span className="text-slate-400">Agreed:</span>{' '}
                              <span>{formatRate(cand.agreedRate, currency, cand.agreedPeriod === 'hr')}</span>
                              {cand.agreedPeriod ? `/${cand.agreedPeriod}` : ''}
                            </div>
                          ) : null}
                        </td>

                        {/* Status Dropdown */}
                        <td
                          className="py-3.5 px-4 font-sans"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <select
                            value={cand.status}
                            onChange={(e) => handleStatusChange(cand, e.target.value as InterviewStatus)}
                            className={`text-[11px] font-semibold rounded-lg px-2.5 py-1 border focus:outline-none transition-colors cursor-pointer ${getStatusBadge(
                              cand.status
                            )}`}
                          >
                            <option value="Scheduled" className="bg-slate-900 text-slate-200">Scheduled</option>
                            <option value="In Interview" className="bg-slate-900 text-slate-200">In Interview</option>
                            <option value="Passed to Next Round" className="bg-slate-900 text-slate-200">Passed</option>
                            <option value="Offer Extended" className="bg-slate-900 text-slate-200">Offer Extended</option>
                            <option value="Offer Accepted" className="bg-slate-900 text-slate-200">Offer Accepted</option>
                            <option value="Counter-Offered" className="bg-slate-900 text-slate-200">Counter-Offered</option>
                            <option value="Rejected" className="bg-slate-900 text-slate-200">Rejected</option>
                          </select>
                        </td>

                        {/* Action */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => onOpenInterview(cand)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-semibold text-xs border border-indigo-500/30 transition-all"
                          >
                            <span>Evaluate</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
