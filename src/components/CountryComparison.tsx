import React, { useState } from 'react';
import {
  ALL_ROLES,
  ALL_COUNTRIES,
  getRateRecord,
  formatRate,
  EXPERIENCE_RULES,
  getExperienceTierRule
} from '../data/rateCardData';
import { GitCompare, ArrowUpDown, Globe, Clock, Calendar, Check } from 'lucide-react';

export const CountryComparison: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState('Software Engineer');
  const [experienceYears, setExperienceYears] = useState(4);
  const [sortBy, setSortBy] = useState<'usd_asc' | 'usd_desc' | 'alphabetical'>('usd_asc');
  
  // Default selected countries to compare
  const [selectedCountries, setSelectedCountries] = useState<string[]>([
    'Pakistan',
    'India',
    'Bangladesh',
    'Sri Lanka',
    'Egypt',
    'Morocco',
    'United Arab Emirates',
    'Saudi Arabia',
    'United Kingdom',
    'Germany',
    'United States'
  ]);

  const rule = getExperienceTierRule(experienceYears);

  // Compute comparison data for selected countries
  const comparisonData = selectedCountries.map((c) => {
    const record = getRateRecord(c, selectedRole);
    if (!record) return null;

    let hourlyLocal = 0;
    let hourlyUsd = 0;
    let fullDay8hLocal = 0;
    let fullDay8hUsd = 0;

    if (rule.levelCode === 'L1') {
      hourlyLocal = record.l1LocalHr;
      hourlyUsd = record.l1UsdRef;
      fullDay8hLocal = record.l1Local8h;
      fullDay8hUsd = record.l1UsdRef * 8;
    } else if (rule.levelCode === 'L2') {
      hourlyLocal = record.l2LocalHr;
      hourlyUsd = record.l2UsdRef;
      fullDay8hLocal = record.l2Local8h;
      fullDay8hUsd = record.l2UsdRef * 8;
    } else {
      const mult = rule.rateMultiplierFromL3;
      hourlyLocal = record.l3LocalHr * mult;
      hourlyUsd = record.l3UsdRef * mult;
      fullDay8hLocal = record.l3Local8h * mult;
      fullDay8hUsd = (record.l3UsdRef * 8) * mult;
    }

    return {
      country: c,
      currency: record.currency,
      role: selectedRole,
      hourlyLocal,
      hourlyUsd,
      fullDay8hLocal,
      fullDay8hUsd,
      monthlyUsd: fullDay8hUsd * 22
    };
  }).filter(Boolean) as Array<{
    country: string;
    currency: string;
    role: string;
    hourlyLocal: number;
    hourlyUsd: number;
    fullDay8hLocal: number;
    fullDay8hUsd: number;
    monthlyUsd: number;
  }>;

  // Sorting
  comparisonData.sort((a, b) => {
    if (sortBy === 'usd_asc') return a.hourlyUsd - b.hourlyUsd;
    if (sortBy === 'usd_desc') return b.hourlyUsd - a.hourlyUsd;
    return a.country.localeCompare(b.country);
  });

  const toggleCountry = (countryName: string) => {
    if (selectedCountries.includes(countryName)) {
      if (selectedCountries.length > 2) {
        setSelectedCountries(selectedCountries.filter((c) => c !== countryName));
      }
    } else {
      setSelectedCountries([...selectedCountries, countryName]);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Header */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 sm:p-7 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs uppercase tracking-wider font-mono text-indigo-400 font-semibold bg-indigo-950/60 border border-indigo-800/60 px-2.5 py-0.5 rounded">
                Cross-Border Analytics
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-400">USD Normalized Benchmarks</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Cross-Country Rate Comparison
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Compare regional market costs for identical technical roles across multiple offshore, nearshore, and onshore talent hubs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="usd_asc">USD Rate (Lowest First)</option>
              <option value="usd_desc">USD Rate (Highest First)</option>
              <option value="alphabetical">Country Name (A–Z)</option>
            </select>
          </div>
        </div>

        {/* Role & Experience Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Select Role to Compare
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-medium"
            >
              {ALL_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold uppercase tracking-wider">Experience Level</span>
              <span className="font-mono text-indigo-400 font-bold">
                {experienceYears} Yrs ({rule.tier})
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="22"
              value={experienceYears}
              onChange={(e) => setExperienceYears(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-500 h-2 bg-slate-950 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Country Chip Selector */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <div className="text-xs font-medium text-slate-400 mb-2">
            Included Countries ({selectedCountries.length}): Click to toggle in/out of comparison
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
            {ALL_COUNTRIES.map((c) => {
              const isSelected = selectedCountries.includes(c);
              return (
                <button
                  key={c}
                  onClick={() => toggleCountry(c)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600/30 border-indigo-500 text-white font-medium'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-indigo-400" />}
                  <span>{c}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comparison Grid & Cards */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-300 border-b border-slate-800 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Rank</th>
                <th className="py-3.5 px-4">Country & Currency</th>
                <th className="py-3.5 px-4 text-right">Hourly Rate (Local)</th>
                <th className="py-3.5 px-4 text-right">Full-Day (8h Local)</th>
                <th className="py-3.5 px-4 text-right">Hourly Rate (USD)</th>
                <th className="py-3.5 px-4 text-right">Full-Day Rate (USD)</th>
                <th className="py-3.5 px-4 text-right">Est. Monthly (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {comparisonData.map((row, idx) => {
                const isUsBase = row.country === 'United States';
                return (
                  <tr
                    key={row.country}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isUsBase ? 'bg-indigo-950/20' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-sans text-slate-400 font-medium">
                      #{idx + 1}
                    </td>

                    <td className="py-3.5 px-4 font-sans">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{row.country}</span>
                        {isUsBase && (
                          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1 rounded">
                            US Anchor
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {row.currency}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right tabular-nums font-semibold text-slate-200">
                      {formatRate(row.hourlyLocal, row.currency, true)}
                    </td>

                    <td className="py-3.5 px-4 text-right tabular-nums text-slate-300">
                      {formatRate(row.fullDay8hLocal, row.currency, false)}
                    </td>

                    <td className="py-3.5 px-4 text-right tabular-nums font-bold text-indigo-300">
                      ${row.hourlyUsd.toFixed(2)} /hr
                    </td>

                    <td className="py-3.5 px-4 text-right tabular-nums font-semibold text-emerald-400">
                      ${row.fullDay8hUsd.toFixed(1)} /day
                    </td>

                    <td className="py-3.5 px-4 text-right tabular-nums text-slate-400">
                      ${Math.round(row.monthlyUsd).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
