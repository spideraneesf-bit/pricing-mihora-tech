import React, { useState } from 'react';
import {
  EXPERIENCE_RULES,
  ALL_COUNTRIES,
  ALL_ROLES,
  calculateCandidateRate,
  formatRate,
  RATE_CARD_METADATA
} from '../data/rateCardData';
import { Info, Calculator, Award, CheckCircle2, ArrowRight, TrendingUp } from 'lucide-react';

export const ExperienceRuleGuide: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState('Pakistan');
  const [selectedRole, setSelectedRole] = useState('Software Engineer');
  const [testYears, setTestYears] = useState(4);

  const calc = calculateCandidateRate(selectedCountry, selectedRole, testYears);

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      {/* Title & Context */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 sm:p-8 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-wider font-mono text-indigo-400 font-semibold bg-indigo-950/60 border border-indigo-800/60 px-2.5 py-0.5 rounded">
                Official Compensation Standard
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-400">Worksheet: Engineer Pay Only</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Experience ke hisaab se pay rule
            </h1>
            <p className="text-sm text-slate-300 mt-1.5 max-w-3xl">
              Official seniority mapping rule for technical interviews. Automatically determines L1, L2, L3 anchor and percentage seniority premiums based on verified professional experience.
            </p>
          </div>
          <div className="shrink-0 bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 text-right">
            <div className="text-xs text-slate-400">Active FX Source</div>
            <div className="text-xs font-mono text-emerald-400 font-medium mt-0.5">open.er-api.com</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Updated Oct 2026</div>
          </div>
        </div>

        {/* Visual Rule Table (Exact representation of User's Image) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 bg-slate-950/80 rounded-xl border border-slate-800 p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Experience ke hisaab se pay rule
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Standard Rule Matrix</span>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-800">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Experience</th>
                    <th className="py-3 px-4">Rate Tier</th>
                    <th className="py-3 px-4 text-right">Seniority Multiplier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                  {EXPERIENCE_RULES.map((rule) => {
                    const isSelected = testYears >= rule.minYears && testYears <= rule.maxYears;
                    return (
                      <tr
                        key={rule.tier}
                        onClick={() => setTestYears(rule.minYears === 0 ? 1 : rule.minYears)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-indigo-600/20 text-white font-semibold'
                            : 'text-slate-300 hover:bg-slate-900/50'
                        }`}
                      >
                        <td className="py-3.5 px-4 font-sans font-medium flex items-center gap-2">
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>}
                          <span>{rule.rangeLabel}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${
                              isSelected
                                ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-400/40'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {rule.tier} rate
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right tabular-nums text-slate-400">
                          {rule.markupPercent > 0 ? (
                            <span className="text-emerald-400 font-semibold">+{rule.markupPercent}% on L3</span>
                          ) : (
                            <span>{rule.levelCode} Base</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-3 bg-slate-900/60 rounded-lg border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2">
              <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>
                <strong>Methodology:</strong> L1 represents junior/first-line support, L2 represents experienced/second-line engineers, L3 is senior/lead. Engineers with 11+ years receive incremental 5% premiums every 5 years on top of L3.
              </span>
            </div>
          </div>

          {/* Live Simulator for any Country & Role */}
          <div className="lg:col-span-6 bg-slate-900/90 rounded-xl border border-slate-800 p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Live Rule Simulator
                </h3>
              </div>
              <span className="text-xs text-indigo-400 font-mono">Real-time Benchmark Test</span>
            </div>

            {/* Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Select Country</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
                >
                  {ALL_COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Select Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
                >
                  {ALL_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Experience Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-300 font-medium">Candidate Experience:</span>
                <span className="text-white font-mono font-bold text-sm bg-indigo-600/30 px-2 py-0.5 rounded border border-indigo-500/40">
                  {testYears} Years
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={testYears}
                onChange={(e) => setTestYears(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-500 h-2 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>0 yrs (L1)</span>
                <span>3 yrs (L2)</span>
                <span>7 yrs (L3)</span>
                <span>11 yrs (L3+10%)</span>
                <span>16 yrs (L3+15%)</span>
                <span>20+ yrs (L3+20%)</span>
              </div>
            </div>

            {/* Calculated Breakdown Display */}
            {calc && (
              <div className="bg-slate-950/90 rounded-xl p-4 border border-indigo-900/50 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div>
                    <span className="text-xs text-slate-400">Assigned Tier:</span>
                    <div className="text-base font-extrabold text-indigo-400 flex items-center gap-1.5 mt-0.5">
                      <TrendingUp className="w-4 h-4" />
                      <span>{calc.tierLabel}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Currency</span>
                    <div className="text-sm font-mono font-bold text-white">{calc.currency}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-[11px] text-slate-400">Hourly Rate</div>
                    <div className="text-lg font-mono font-bold text-white tabular-nums">
                      {formatRate(calc.hourlyLocal, calc.currency, true)}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      ~${calc.hourlyUsd.toFixed(1)} USD ref
                    </div>
                  </div>

                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-[11px] text-slate-400">Full-Day (8 Hours)</div>
                    <div className="text-lg font-mono font-bold text-emerald-400 tabular-nums">
                      {formatRate(calc.fullDay8hLocal, calc.currency, false)}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      ~${calc.fullDay8hUsd.toFixed(0)} USD
                    </div>
                  </div>

                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-[11px] text-slate-400">Half-Day (5 Hours)</div>
                    <div className="text-base font-mono font-semibold text-slate-200 tabular-nums">
                      {formatRate(calc.halfDay5hLocal, calc.currency, false)}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      ~${calc.halfDay5hUsd.toFixed(0)} USD
                    </div>
                  </div>

                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-[11px] text-slate-400">Monthly Baseline (22d)</div>
                    <div className="text-base font-mono font-semibold text-slate-200 tabular-nums">
                      {formatRate(calc.monthlyLocal, calc.currency, false)}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      ~${calc.monthlyUsd.toLocaleString()} USD
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 flex items-center justify-between">
                  <span>Note: {calc.formulaNote}</span>
                  <span className="text-indigo-400">Half-day = 5h | Full-day = 8h</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interviewer Guidelines & Rules of Engagement */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm mb-3">
            01
          </div>
          <h4 className="text-sm font-bold text-white">Direct Engineer Pay Only</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            This card represents exact engineer take-home compensation—no agency margin, no client bill rate overhead. Rates are rounded market-pay benchmarks suitable for starting firm offers.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-sm mb-3">
            02
          </div>
          <h4 className="text-sm font-bold text-white">Shift Definition Standard</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            A Half-day shift is officially standardized at <strong>5 hours</strong>. A Full-day shift is standardized at <strong>8 hours</strong>. Overtime beyond 8 hours is calculated at the base hourly rate.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm mb-3">
            03
          </div>
          <h4 className="text-sm font-bold text-white">Starting Offer & Final City Confirmation</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Role-by-role rows use role skill premiums and country pay anchors. Present these benchmark rates as starting offers, then confirm city cost of living, contract length, and employment model.
          </p>
        </div>
      </div>
    </div>
  );
};
