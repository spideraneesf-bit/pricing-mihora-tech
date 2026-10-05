import React, { useState, useEffect } from 'react';
import { Candidate } from './types/index';
import { loadCandidates, saveCandidates, resetToDefaultCandidates, exportCandidatesToCSV, downloadFile } from './services/candidateStorage';
import { Header } from './components/Header';
import { InterviewDesk } from './components/InterviewDesk';
import { PayCalculator } from './components/PayCalculator';
import { RateCardExplorer } from './components/RateCardExplorer';
import { ExperienceRuleGuide } from './components/ExperienceRuleGuide';
import { CountryComparison } from './components/CountryComparison';
import { LiveInterviewModal } from './components/LiveInterviewModal';
import { AddCandidateModal } from './components/AddCandidateModal';

export default function App() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  // Default to the Rate Card Explorer so user sees the verified official pricing right away!
  const [activeTab, setActiveTab] = useState<'ratecard' | 'calculator' | 'comparison' | 'rules' | 'candidates'>('ratecard');
  const [activeInterviewCandidate, setActiveInterviewCandidate] = useState<Candidate | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [calculatorCountry, setCalculatorCountry] = useState<string | null>(null);
  const [calculatorRole, setCalculatorRole] = useState<string | null>(null);

  // Load real candidates from localStorage (starts empty, NO dummy data)
  useEffect(() => {
    const loaded = loadCandidates();
    setCandidates(loaded);
  }, []);

  const handleUpdateCandidate = (updated: Candidate) => {
    const nextList = candidates.map((c) => (c.id === updated.id ? updated : c));
    setCandidates(nextList);
    saveCandidates(nextList);
    if (activeInterviewCandidate && activeInterviewCandidate.id === updated.id) {
      setActiveInterviewCandidate(updated);
    }
  };

  const handleAddCandidate = (newCand: Candidate) => {
    const nextList = [newCand, ...candidates];
    setCandidates(nextList);
    saveCandidates(nextList);
    setActiveTab('candidates');
  };

  const handleDeleteCandidate = (id: string) => {
    if (window.confirm('Are you sure you want to remove this candidate evaluation?')) {
      const nextList = candidates.filter((c) => c.id !== id);
      setCandidates(nextList);
      saveCandidates(nextList);
    }
  };

  const handleClearCandidates = () => {
    if (window.confirm('Clear all candidate records?')) {
      const def = resetToDefaultCandidates();
      setCandidates(def);
    }
  };

  const handleExportCsv = () => {
    if (candidates.length === 0) {
      alert('No candidates to export yet. Add candidate offers first or browse the Rate Card Explorer.');
      return;
    }
    const csvData = exportCandidatesToCSV(candidates);
    downloadFile(csvData, `engineer_pay_candidate_evaluations_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8;');
  };

  const handleSelectRateCardRecord = (country: string, role: string) => {
    setCalculatorCountry(country);
    setCalculatorRole(role);
    setActiveTab('calculator');
  };

  const handleNavigateCandidate = (candidateId: string) => {
    const target = candidates.find((c) => c.id === candidateId);
    if (target) {
      setActiveInterviewCandidate(target);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Header with Rate Card First */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        candidateCount={candidates.length}
        onAddCandidateClick={() => setIsAddModalOpen(true)}
        onExportCsvClick={handleExportCsv}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'ratecard' && (
          <RateCardExplorer onSelectForCalculator={handleSelectRateCardRecord} />
        )}

        {activeTab === 'calculator' && (
          <PayCalculator initialCountry={calculatorCountry} initialRole={calculatorRole} />
        )}

        {activeTab === 'comparison' && (
          <CountryComparison />
        )}

        {activeTab === 'rules' && (
          <ExperienceRuleGuide />
        )}

        {activeTab === 'candidates' && (
          <InterviewDesk
            candidates={candidates}
            onOpenInterview={(cand) => setActiveInterviewCandidate(cand)}
            onUpdateCandidate={handleUpdateCandidate}
            onDeleteCandidate={handleDeleteCandidate}
            onResetCandidates={handleClearCandidates}
            onAddNewClick={() => setIsAddModalOpen(true)}
            onNavigateToCalculator={() => setActiveTab('calculator')}
          />
        )}
      </main>

      {/* Live Interview Workspace Cockpit Modal */}
      {activeInterviewCandidate && (
        <LiveInterviewModal
          candidate={activeInterviewCandidate}
          allCandidates={candidates}
          onClose={() => setActiveInterviewCandidate(null)}
          onSaveCandidate={handleUpdateCandidate}
          onNavigateCandidate={handleNavigateCandidate}
        />
      )}

      {/* Add New Real Candidate Modal */}
      {isAddModalOpen && (
        <AddCandidateModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddCandidate}
          nextSlotNumber={candidates.length + 1}
        />
      )}

      {/* Professional Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">ENGINEER PAY RATE CARD (2026)</span>
            <span>·</span>
            <span>engineer_pay_rate_card_by_country_2026.xlsx</span>
            <span>·</span>
            <span>47 Countries · 21 Roles · 987 Records</span>
          </div>
          <div className="font-mono text-[11px] text-slate-500">
            Engineer Pay Only (No Agency Markup) · Half-day: 5h | Full-day: 8h
          </div>
        </div>
      </footer>
    </div>
  );
}
