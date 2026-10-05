import React, { useState } from 'react';
import {
  ALL_COUNTRIES,
  ALL_ROLES,
  calculateCandidateRate,
  formatRate,
  EXPERIENCE_RULES,
  COUNTRY_CURRENCIES,
  CURRENCY_SYMBOLS
} from '../data/rateCardData';
import { generateOfferPitch } from '../services/pitchGenerator';
import {
  Calculator,
  Copy,
  Check,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Calendar,
  AlertCircle,
  Sparkles,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';

interface PayCalculatorProps {
  initialCountry?: string | null;
  initialRole?: string | null;
}

export const PayCalculator: React.FC<PayCalculatorProps> = ({ initialCountry, initialRole }) => {
  const [country, setCountry] = useState(initialCountry || 'Pakistan');
  const [role, setRole] = useState(initialRole || 'Software Engineer');
  const [experienceYears, setExperienceYears] = useState(4);
  const [candidateName, setCandidateName] = useState('');
  const [askingRate, setAskingRate] = useState<string>('');
  const [askingPeriod, setAskingPeriod] = useState<'hr' | '5h' | '8h' | 'month'>('hr');

  const [copiedType, setCopiedType] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialCountry) setCountry(initialCountry);
  }, [initialCountry]);

  React.useEffect(() => {
    if (initialRole) setRole(initialRole);
  }, [initialRole]);

  const calc = calculateCandidateRate(country, role, experienceYears);
  const numericAsking = askingRate ? parseFloat(askingRate) : null;
  const pitch = calc ? generateOfferPitch(calc, candidateName, numericAsking, askingPeriod) : null;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const currency = COUNTRY_CURRENCIES[country] || 'USD';
  const currencySymbol = CURRENCY_SYMBOLS[currency] || (currency + ' ');

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      {/* Top Banner & Header */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 sm:p-8 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-wider font-mono text-indigo-400 font-semibold bg-indigo-950/60 border border-indigo-800/60 px-2.5 py-0.5 rounded">
                Live Negotiation Calculator
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-400">Experience Pay Rule Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Instant Offer & Pay Benchmark Calculator
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Calculate exact hourly, 5h, 8h, and monthly engineer payouts for any country and role. Compare candidate quotes directly against verified 2026 market anchors.
            </p>
          </div>

          {/* Quick Preset Buttons for Top Interview Locations */}
          <div className="flex flex-wrap items-center gap-1.5 self-start md:self-center">
            <span className="text-xs text-slate-400 mr-1 font-medium">Quick Hubs:</span>
            {['Pakistan', 'India', 'United Arab Emirates', 'Saudi Arabia', 'United Kingdom', 'Germany', 'Egypt'].map(
              (c) => (
                <button
                  key={c}
                  onClick={() => setCountry(c)}
                  className={`text-xs px-2.5 py-1 rounded-md transition-all font-medium ${
                    country === c
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {c}
                </button>
              )
            )}
          </div>
        </div>

        {/* Input Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Country Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              1. Candidate Country & Currency
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-medium"
            >
              {ALL_COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c} ({COUNTRY_CURRENCIES[c] || 'USD'})
                </option>
              ))}
            </select>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              2. Technical Role / Skill
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-medium"
            >
              {ALL_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Candidate Name (Optional) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              3. Candidate Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Muhammad Ali"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Experience Selector Slider & Tier Badges */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                4. Total Relevant Experience
              </span>
              <span className="text-xs text-slate-400 ml-2">
                (Maps automatically to Experience Pay Rule)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Exact Years:</span>
              <input
                type="number"
                min="0"
                max="35"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-center font-mono font-bold text-white text-sm focus:outline-none focus:border-indigo-500"
              />
              <span className="text-sm font-bold text-indigo-400 bg-indigo-950/70 border border-indigo-800/80 px-2.5 py-1 rounded-lg font-mono">
                {calc?.tierLabel}
              </span>
            </div>
          </div>

          {/* Range Slider */}
          <input
            type="range"
            min="0"
            max="25"
            step="1"
            value={experienceYears}
            onChange={(e) => setExperienceYears(parseInt(e.target.value, 10))}
            className="w-full accent-indigo-500 h-2 bg-slate-950 rounded-lg cursor-pointer"
          />

          {/* Rule Milestones */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 mt-3">
            {EXPERIENCE_RULES.map((rule) => {
              const isActive = experienceYears >= rule.minYears && experienceYears <= rule.maxYears;
              return (
                <button
                  key={rule.tier}
                  onClick={() => setExperienceYears(rule.minYears === 0 ? 1 : rule.minYears)}
                  className={`text-left p-2 rounded-lg border transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-950/50 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="text-[11px] font-bold font-mono">{rule.tier}</div>
                  <div className="text-[11px] text-slate-300 font-sans">{rule.rangeLabel}</div>
                  <div className="text-[10px] text-slate-500">
                    {rule.markupPercent > 0 ? `+${rule.markupPercent}% on L3` : 'Base'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Calculated Results & Negotiation Deck */}
      {calc && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Detailed Benchmark Rates Card */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-7 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider font-semibold">
                    {country} · {calc.currency} Benchmark
                  </div>
                  <h2 className="text-xl font-bold text-white mt-0.5">{role}</h2>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Assigned Seniority:</span>
                  <div className="text-sm font-mono font-bold text-emerald-400">{calc.tierLabel}</div>
                </div>
              </div>

              {/* 4 Primary Rate Metric Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Hourly Rate */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" /> Hourly Rate
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">1 Hour</span>
                  </div>
                  <div className="text-2xl font-mono font-extrabold text-white tabular-nums tracking-tight">
                    {formatRate(calc.hourlyLocal, calc.currency, true)}
                  </div>
                  <div className="text-xs font-mono text-slate-400 mt-1">
                    ~${calc.hourlyUsd.toFixed(2)} USD reference
                  </div>
                </div>

                {/* Full-Day 8h Rate (Standard) */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-indigo-900/60 hover:border-indigo-700 transition-colors ring-1 ring-indigo-500/20">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                      <Calendar className="w-3.5 h-3.5" /> Full-Day Rate (8h)
                    </span>
                    <span className="font-mono text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-800 px-1.5 py-0.5 rounded">
                      Standard Shift
                    </span>
                  </div>
                  <div className="text-2xl font-mono font-extrabold text-emerald-400 tabular-nums tracking-tight">
                    {formatRate(calc.fullDay8hLocal, calc.currency, false)}
                  </div>
                  <div className="text-xs font-mono text-slate-400 mt-1">
                    ~${calc.fullDay8hUsd.toFixed(1)} USD / day
                  </div>
                </div>

                {/* Half-Day 5h Rate */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> Half-Day Rate (5h)
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">5h Shift</span>
                  </div>
                  <div className="text-xl font-mono font-bold text-slate-200 tabular-nums">
                    {formatRate(calc.halfDay5hLocal, calc.currency, false)}
                  </div>
                  <div className="text-xs font-mono text-slate-400 mt-1">
                    ~${calc.halfDay5hUsd.toFixed(1)} USD / half-day
                  </div>
                </div>

                {/* Monthly Estimate (22 working days) */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="flex items-center gap-1.5 font-medium">
                      <DollarSign className="w-3.5 h-3.5 text-blue-400" /> Monthly Baseline
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">22 Days / 176h</span>
                  </div>
                  <div className="text-xl font-mono font-bold text-slate-200 tabular-nums">
                    {formatRate(calc.monthlyLocal, calc.currency, false)}
                  </div>
                  <div className="text-xs font-mono text-slate-400 mt-1">
                    ~${Math.round(calc.monthlyUsd).toLocaleString()} USD / month
                  </div>
                </div>
              </div>

              {/* Formula & Policy Note */}
              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="text-slate-200">Rule Applied:</strong> {calc.formulaNote}. Engineer pay only — no agency margin, no client bill rate. Half-day = 5 hours | Full-day = 8 hours.
                </div>
              </div>
            </div>

            {/* Negotiation Quote Tester */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Candidate Quote Comparison
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Live Delta Analyzer</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-7">
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    What is the candidate asking for? ({currency})
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-500 text-sm font-mono font-medium">
                      {currencySymbol}
                    </span>
                    <input
                      type="number"
                      placeholder="e.g. 1500"
                      value={askingRate}
                      onChange={(e) => setAskingRate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="sm:col-span-5">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Period</label>
                  <select
                    value={askingPeriod}
                    onChange={(e) => setAskingPeriod(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-medium"
                  >
                    <option value="hr">Per Hour</option>
                    <option value="5h">Per Half-Day (5h)</option>
                    <option value="8h">Per Full-Day (8h)</option>
                    <option value="month">Per Month (176h)</option>
                  </select>
                </div>
              </div>

              {/* Delta result banner */}
              {pitch && pitch.deltaPercent !== undefined && (
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    pitch.deltaStatus === 'below'
                      ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                      : pitch.deltaStatus === 'exact'
                      ? 'bg-blue-950/40 border-blue-800 text-blue-300'
                      : pitch.deltaStatus === 'slightly_above'
                      ? 'bg-amber-950/40 border-amber-800 text-amber-300'
                      : 'bg-rose-950/40 border-rose-800 text-rose-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      {pitch.deltaPercent > 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>
                        {pitch.deltaPercent > 0 ? `+${pitch.deltaPercent}%` : `${pitch.deltaPercent}%`} vs Official Benchmark
                      </span>
                    </div>
                    <span className="text-xs uppercase font-mono px-2 py-0.5 rounded font-semibold bg-black/30">
                      {pitch.deltaStatus?.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs opacity-90 mt-1">{pitch.negotiationAdvice}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Pitch & Negotiation Script Generator */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Instant Interview Offer Script
                  </h3>
                </div>
                <span className="text-xs text-indigo-400 font-mono">1-Click Copy</span>
              </div>

              {/* Quick Bullets to Read on Call */}
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <div className="text-xs font-semibold text-slate-300 mb-1">Key Talking Points on Call:</div>
                {pitch?.quickBullets.map((bullet, idx) => (
                  <div key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">›</span>
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              {/* WhatsApp Message in Roman Urdu (Perfect for PK/IN/ME interviews) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <span>WhatsApp Pitch (Roman Urdu)</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Local Calls</span>
                  </span>
                  <button
                    onClick={() => handleCopy(pitch?.urduText || '', 'urdu')}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white transition-colors"
                  >
                    {copiedType === 'urdu' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'urdu' ? 'Copied!' : 'Copy Urdu'}</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={6}
                  value={pitch?.urduText || ''}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 font-sans leading-relaxed resize-none focus:outline-none"
                />
              </div>

              {/* WhatsApp / Email in Formal English */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <span>Formal Offer Message (English)</span>
                    <span className="text-[10px] text-blue-400 font-mono">Email / WhatsApp</span>
                  </span>
                  <button
                    onClick={() => handleCopy(pitch?.englishText || '', 'english')}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white transition-colors"
                  >
                    {copiedType === 'english' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'english' ? 'Copied!' : 'Copy English'}</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={6}
                  value={pitch?.englishText || ''}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 font-sans leading-relaxed resize-none focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
