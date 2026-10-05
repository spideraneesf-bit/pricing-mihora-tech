import React from 'react';
import { Users, Calculator, Table, BookOpen, GitCompare, Download, Plus } from 'lucide-react';

interface HeaderProps {
  activeTab: 'ratecard' | 'calculator' | 'comparison' | 'rules' | 'candidates';
  setActiveTab: (tab: 'ratecard' | 'calculator' | 'comparison' | 'rules' | 'candidates') => void;
  candidateCount: number;
  onAddCandidateClick: () => void;
  onExportCsvClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  candidateCount,
  onAddCandidateClick,
  onExportCsvClick
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white font-bold text-lg">
              $
            </div>
            <div>
              <a
                href="#ratecard"
                onClick={(e) => { e.preventDefault(); setActiveTab('ratecard'); }}
                className="text-base sm:text-lg font-bold tracking-tight text-white hover:text-indigo-300 transition-colors flex items-center gap-2"
              >
                <span>Engineer Pay Rate Desk</span>
                <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                  2026 Official
                </span>
              </a>
              <div className="text-[11px] text-slate-400 hidden sm:block">
                47 Countries · 21 Roles · 987 Verified Market Pay Benchmarks
              </div>
            </div>
          </div>

          {/* Navigation Tabs - Rate Card Matrix is #1 */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('ratecard')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'ratecard'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Rate Card Matrix</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === 'ratecard' ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                987
              </span>
            </button>

            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'calculator'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Pay Calculator</span>
            </button>

            <button
              onClick={() => setActiveTab('comparison')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'comparison'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Country Compare</span>
            </button>

            <button
              onClick={() => setActiveTab('rules')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'rules'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Pay Rules</span>
            </button>

            <button
              onClick={() => setActiveTab('candidates')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'candidates'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Candidate Offers</span>
              {candidateCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-indigo-700 text-white">
                  {candidateCount}
                </span>
              )}
            </button>
          </nav>

          {/* Primary Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {candidateCount > 0 && (
              <button
                onClick={onExportCsvClick}
                title="Export Candidate Evaluations as CSV"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export Offers</span>
              </button>
            )}

            <button
              onClick={onAddCandidateClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Candidate</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center justify-between py-2 border-t border-slate-800 overflow-x-auto gap-1 text-xs">
          <button
            onClick={() => setActiveTab('ratecard')}
            className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap ${
              activeTab === 'ratecard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Rate Matrix (987)
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap ${
              activeTab === 'calculator' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Calculator
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap ${
              activeTab === 'comparison' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Compare
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap ${
              activeTab === 'rules' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pay Rules
          </button>
          <button
            onClick={() => setActiveTab('candidates')}
            className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap ${
              activeTab === 'candidates' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Offers {candidateCount > 0 ? `(${candidateCount})` : ''}
          </button>
        </div>
      </div>
    </header>
  );
};
