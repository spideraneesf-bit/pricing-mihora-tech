import { Candidate } from '../types/index';

const STORAGE_KEY = 'engineer_pay_candidates_v2';

/**
 * Loads real user-added candidates from local storage.
 * Starts completely empty with NO fake/dummy profiles.
 */
export function loadCandidates(): Candidate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Error loading candidates from localStorage:', err);
    return [];
  }
}

/**
 * Saves real candidates to local storage.
 */
export function saveCandidates(candidates: Candidate[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
  } catch (err) {
    console.error('Error saving candidates to localStorage:', err);
  }
}

/**
 * Clears candidate list back to empty.
 */
export function resetToDefaultCandidates(): Candidate[] {
  saveCandidates([]);
  return [];
}

/**
 * Exports candidate evaluations to CSV.
 */
export function exportCandidatesToCSV(candidates: Candidate[]): string {
  const headers = [
    'Slot #',
    'Candidate Name',
    'Scheduled Time',
    'Country',
    'City',
    'Role / Skill',
    'Experience (Years)',
    'Status',
    'Asking Rate',
    'Asking Period',
    'Agreed Rate',
    'Agreed Period',
    'Notes',
    'Phone',
    'Email'
  ];

  const rows = candidates.map(c => [
    c.slotNumber,
    `"${(c.name || '').replace(/"/g, '""')}"`,
    `"${(c.scheduledTime || '').replace(/"/g, '""')}"`,
    `"${(c.country || '').replace(/"/g, '""')}"`,
    `"${(c.city || '').replace(/"/g, '""')}"`,
    `"${(c.role || '').replace(/"/g, '""')}"`,
    c.experienceYears,
    `"${c.status}"`,
    c.candidateAskingRate || '',
    c.candidateAskingPeriod || '',
    c.agreedRate || '',
    c.agreedPeriod || '',
    `"${(c.notes || '').replace(/"/g, '""')}"`,
    `"${(c.contactNumber || '').replace(/"/g, '""')}"`,
    `"${(c.email || '').replace(/"/g, '""')}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
