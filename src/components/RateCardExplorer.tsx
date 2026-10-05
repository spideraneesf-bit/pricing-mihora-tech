import React, { useState, useMemo } from 'react';
import {
  RATE_CARD_RECORDS,
  ALL_COUNTRIES,
  ALL_ROLES,
  formatRate,
  COUNTRY_CURRENCIES,
  CURRENCY_SYMBOLS,
  RATE_CARD_METADATA
} from '../data/rateCardData';
import { RateCardRecord } from '../types';
import { Search, Download, Filter, Eye, ArrowUpDown, ChevronDown, Check, Globe } from 'lucide-react';
import { downloadFile } from '../services/candidateStorage';

interface RateCardExplorerProps {
  onSelectForCalculator?: (country: string, role: string) => void;
}

export const RateCardExplorer: React.FC<RateCardExplorerProps> = ({ onSelectForCalculator }) => {
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [displayCurrency, setDisplayCurrency] = useState<'local' | 'usd' | 'both'>('both');
  const [activeShift, setActiveShift] = useState<'hourly' | '5h' | '8h'>('8h');

  // Filtered dataset
  const filteredRecords = useMemo(() => {
    return RATE_CARD_RECORDS.filter((rec) => {
      if (countryFilter !== 'All' && rec.country !== countryFilter) return false;
      if (roleFilter !== 'All' && rec.role !== roleFilter) return false;
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesCountry = rec.country.toLowerCase().includes(query);
        const matchesRole = rec.role.toLowerCase().includes(query);
        const matchesCurrency = rec.currency.toLowerCase().includes(query);
        if (!matchesCountry && !matchesRole && !matchesCurrency) return false;
      }
      return true;
    });
  }, [search, countryFilter, roleFilter]);

  const handleExportCSV = () => {
    const headers = [
      'Country',
      'Currency',
      'Role / Skill',
      'L1 USD/hr ref',
      'L1 local/hr',
      'L1 local 5h',
      'L1 local 8h',
      'L2 USD/hr ref',
      'L2 local/hr',
      'L2 local 5h',
      'L2 local 8h',
      'L3 USD/hr ref',
      'L3 local/hr',
      'L3 local 5h',
      'L3 local 8h'
    ];

    const rows = filteredRecords.map(r => [
      `"${r.country}"`,
      r.currency,
      `"${r.role}"`,
      r.l1UsdRef,
      r.l1LocalHr,
      r.l1Local5h,
      r.l1Local8h,
      r.l2UsdRef,
      r.l2LocalHr,
      r.l2Local5h,
      r.l2Local8h,
      r.l3UsdRef,
      r.l3LocalHr,
      r.l3Local5h,
      r.l3Local8h
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    downloadFile(csvContent, `engineer_pay_rate_card_export_${countryFilter}.csv`, 'text/csv;charset=utf-8;');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Title Bar */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 sm:p-7 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs uppercase tracking-wider font-mono text-indigo-400 font-semibold bg-indigo-950/60 border border-indigo-800/60 px-2.5 py-0.5 rounded">
                Verified Database
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-400">987 Benchmarks across 47 Countries</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Rate Card Matrix Explorer
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Research-anchored market engineer pay benchmarks. L1 (Junior/1st-line), L2 (Experienced/2nd-line), L3 (Senior/3rd-line).
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-center">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Filtered ({filteredRecords.length})</span>
            </button>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search input */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search country, role, or currency..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Country filter */}
          <div className="lg:col-span-3">
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="All">All Countries (47)</option>
              {ALL_COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c} ({COUNTRY_CURRENCIES[c] || 'USD'})
                </option>
              ))}
            </select>
          </div>

          {/* Role filter */}
          <div className="lg:col-span-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="All">All Technical Roles (21)</option>
              {ALL_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Currency Toggle */}
          <div className="lg:col-span-2 flex items-center justify-end gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setDisplayCurrency('local')}
              className={`px-2 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                displayCurrency === 'local' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Local
            </button>
            <button
              onClick={() => setDisplayCurrency('usd')}
              className={`px-2 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                displayCurrency === 'usd' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              USD
            </button>
            <button
              onClick={() => setDisplayCurrency('both')}
              className={`px-2 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                displayCurrency === 'both' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Both
            </button>
          </div>
        </div>

        {/* Shift Unit Switcher */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs">
          <span className="text-slate-400 font-medium">Display Shift Unit:</span>
          <div className="inline-flex rounded-lg border border-slate-800 bg-slate-950 p-0.5">
            <button
              onClick={() => setActiveShift('hourly')}
              className={`px-2.5 py-0.5 rounded text-xs font-medium transition-colors ${
                activeShift === 'hourly' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hourly Rate
            </button>
            <button
              onClick={() => setActiveShift('5h')}
              className={`px-2.5 py-0.5 rounded text-xs font-medium transition-colors ${
                activeShift === '5h' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Half-Day (5h)
            </button>
            <button
              onClick={() => setActiveShift('8h')}
              className={`px-2.5 py-0.5 rounded text-xs font-medium transition-colors ${
                activeShift === '8h' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Full-Day (8h Standard)
            </button>
          </div>
          <span className="text-slate-500 ml-auto hidden sm:inline text-[11px]">
            Showing {filteredRecords.length} of 987 rows
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-300 border-b border-slate-800 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-bold">Country & Currency</th>
                <th className="py-3.5 px-4 font-bold">Role / Skill</th>
                <th className="py-3.5 px-4 text-right">
                  <div className="text-white">L1 (0–2 Yrs)</div>
                  <div className="text-[10px] text-slate-400 font-normal">Junior / 1st-Line</div>
                </th>
                <th className="py-3.5 px-4 text-right">
                  <div className="text-white">L2 (3–6 Yrs)</div>
                  <div className="text-[10px] text-slate-400 font-normal">Experienced / 2nd-Line</div>
                </th>
                <th className="py-3.5 px-4 text-right">
                  <div className="text-white">L3 (7–10 Yrs)</div>
                  <div className="text-[10px] text-slate-400 font-normal">Senior / Lead Anchor</div>
                </th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-sans">
                    No rate card records match your filter criteria. Try clearing search.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec, index) => {
                  // Resolve value for active shift
                  const l1Val =
                    activeShift === 'hourly' ? rec.l1LocalHr : activeShift === '5h' ? rec.l1Local5h : rec.l1Local8h;
                  const l1Usd =
                    activeShift === 'hourly' ? rec.l1UsdRef : activeShift === '5h' ? rec.l1UsdRef * 5 : rec.l1UsdRef * 8;

                  const l2Val =
                    activeShift === 'hourly' ? rec.l2LocalHr : activeShift === '5h' ? rec.l2Local5h : rec.l2Local8h;
                  const l2Usd =
                    activeShift === 'hourly' ? rec.l2UsdRef : activeShift === '5h' ? rec.l2UsdRef * 5 : rec.l2UsdRef * 8;

                  const l3Val =
                    activeShift === 'hourly' ? rec.l3LocalHr : activeShift === '5h' ? rec.l3Local5h : rec.l3Local8h;
                  const l3Usd =
                    activeShift === 'hourly' ? rec.l3UsdRef : activeShift === '5h' ? rec.l3UsdRef * 5 : rec.l3UsdRef * 8;

                  return (
                    <tr
                      key={`${rec.country}_${rec.role}_${index}`}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Country & Currency */}
                      <td className="py-3.5 px-4 font-sans">
                        <div className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                          {rec.country}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          Currency: <span className="text-slate-300 font-bold">{rec.currency}</span>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4 font-sans font-medium text-slate-200">
                        {rec.role}
                      </td>

                      {/* L1 Rate */}
                      <td className="py-3.5 px-4 text-right tabular-nums">
                        {displayCurrency !== 'usd' && (
                          <div className="font-bold text-slate-200">
                            {formatRate(l1Val, rec.currency, activeShift === 'hourly')}
                          </div>
                        )}
                        {displayCurrency !== 'local' && (
                          <div className="text-[11px] text-slate-400">
                            ~${l1Usd.toFixed(1)} USD
                          </div>
                        )}
                      </td>

                      {/* L2 Rate */}
                      <td className="py-3.5 px-4 text-right tabular-nums">
                        {displayCurrency !== 'usd' && (
                          <div className="font-bold text-indigo-300">
                            {formatRate(l2Val, rec.currency, activeShift === 'hourly')}
                          </div>
                        )}
                        {displayCurrency !== 'local' && (
                          <div className="text-[11px] text-slate-400">
                            ~${l2Usd.toFixed(1)} USD
                          </div>
                        )}
                      </td>

                      {/* L3 Rate */}
                      <td className="py-3.5 px-4 text-right tabular-nums">
                        {displayCurrency !== 'usd' && (
                          <div className="font-bold text-emerald-400">
                            {formatRate(l3Val, rec.currency, activeShift === 'hourly')}
                          </div>
                        )}
                        {displayCurrency !== 'local' && (
                          <div className="text-[11px] text-slate-400">
                            ~${l3Usd.toFixed(1)} USD
                          </div>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-center font-sans">
                        {onSelectForCalculator && (
                          <button
                            onClick={() => onSelectForCalculator(rec.country, rec.role)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white text-[11px] font-semibold transition-colors"
                          >
                            <span>Calculate</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
