export interface RateCardRecord {
  country: string;
  currency: string;
  role: string;
  l1UsdRef: number;
  l1LocalHr: number;
  l1Local5h: number;
  l1Local8h: number;
  l2UsdRef: number;
  l2LocalHr: number;
  l2Local5h: number;
  l2Local8h: number;
  l3UsdRef: number;
  l3LocalHr: number;
  l3Local5h: number;
  l3Local8h: number;
}

export type ExperienceTier = 'L1' | 'L2' | 'L3' | 'L3+10%' | 'L3+15%' | 'L3+20%';

export interface ExperienceRule {
  tier: ExperienceTier;
  rangeLabel: string;
  minYears: number;
  maxYears: number; // 99 for 20+
  formulaDescription: string;
  rateMultiplierFromL3: number; // 1 for L3, 1.1 for L3+10%, etc.
  levelCode: 'L1' | 'L2' | 'L3';
  markupPercent: number; // 0, 0, 0, 10, 15, 20
}

export interface CalculatedRate {
  country: string;
  currency: string;
  role: string;
  experienceYears: number;
  tier: ExperienceTier;
  tierLabel: string;
  hourlyLocal: number;
  hourlyUsd: number;
  halfDay5hLocal: number;
  halfDay5hUsd: number;
  fullDay8hLocal: number;
  fullDay8hUsd: number;
  monthlyLocal: number; // 22 working days x 8 hours
  monthlyUsd: number;
  formulaNote: string;
}

export type InterviewStatus =
  | 'Scheduled'
  | 'In Interview'
  | 'Offer Extended'
  | 'Offer Accepted'
  | 'Counter-Offered'
  | 'Passed to Next Round'
  | 'On Hold'
  | 'Rejected';

export interface CandidateEvaluation {
  technicalRating: number; // 1-5
  communicationRating: number; // 1-5
  problemSolvingRating: number; // 1-5
  availabilityRating: number; // 1-5
  overallRecommendation: 'Strong Hire' | 'Hire' | 'Borderline' | 'Do Not Hire';
}

export interface Candidate {
  id: string;
  slotNumber: number; // 1 to 72+
  name: string;
  scheduledTime: string;
  country: string;
  city?: string;
  role: string;
  experienceYears: number;
  status: InterviewStatus;
  notes: string;
  candidateAskingRate?: number; // In local currency
  candidateAskingPeriod?: 'hr' | '5h' | '8h' | 'month';
  agreedRate?: number; // In local currency
  agreedPeriod?: 'hr' | '5h' | '8h' | 'month';
  evaluation?: CandidateEvaluation;
  callDurationSeconds?: number;
  contactNumber?: string;
  email?: string;
  updatedAt: string;
}

export interface FilterState {
  searchQuery: string;
  selectedCountry: string;
  selectedRole: string;
  selectedStatus: string;
  selectedTier: string;
  rateUnit: 'hourly' | '5h' | '8h' | 'monthly';
  currencyView: 'local' | 'usd' | 'both';
}
