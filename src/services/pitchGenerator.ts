import { CalculatedRate } from '../types';
import { formatRate } from '../data/rateCardData';

export interface OfferPitch {
  englishText: string;
  urduText: string;
  quickBullets: string[];
  negotiationAdvice: string;
  deltaPercent?: number;
  deltaStatus?: 'below' | 'exact' | 'slightly_above' | 'substantially_above';
}

export function generateOfferPitch(
  calc: CalculatedRate,
  candidateName = '',
  askingRate?: number | null,
  askingPeriod: 'hr' | '5h' | '8h' | 'month' = 'hr'
): OfferPitch {
  const { country, currency, role, experienceYears, tier, tierLabel, hourlyLocal, fullDay8hLocal, halfDay5hLocal, monthlyLocal, hourlyUsd } = calc;

  const candidateDisplayName = candidateName.trim() || 'Candidate';

  // Compare asking rate against benchmark
  let deltaPercent: number | undefined;
  let deltaStatus: OfferPitch['deltaStatus'];
  let compText = '';

  if (askingRate && askingRate > 0) {
    let normalizedAskingHourly = askingRate;
    if (askingPeriod === '5h') normalizedAskingHourly = askingRate / 5;
    else if (askingPeriod === '8h') normalizedAskingHourly = askingRate / 8;
    else if (askingPeriod === 'month') normalizedAskingHourly = askingRate / 176;

    const diff = normalizedAskingHourly - hourlyLocal;
    deltaPercent = Math.round((diff / hourlyLocal) * 100);

    if (deltaPercent <= -5) {
      deltaStatus = 'below';
      compText = `Candidate's expectation is ${Math.abs(deltaPercent)}% BELOW our benchmark rate (Great budget value).`;
    } else if (deltaPercent >= -4 && deltaPercent <= 5) {
      deltaStatus = 'exact';
      compText = `Candidate's expectation is right on par with the official 2026 market benchmark (0-5% delta).`;
    } else if (deltaPercent > 5 && deltaPercent <= 15) {
      deltaStatus = 'slightly_above';
      compText = `Candidate is asking +${deltaPercent}% above standard rate. Within acceptable negotiation buffer.`;
    } else {
      deltaStatus = 'substantially_above';
      compText = `Candidate is asking +${deltaPercent}% above benchmark. Counter with benchmark or highlight steady shift hours.`;
    }
  }

  const quickBullets = [
    `Role: ${role} (${country})`,
    `Experience: ${experienceYears} Years — Bracket: ${tierLabel}`,
    `Standard Hourly: ${formatRate(hourlyLocal, currency, true)} (~$${hourlyUsd.toFixed(1)} USD/hr ref)`,
    `Half-Day (5h Shift): ${formatRate(halfDay5hLocal, currency, false)}`,
    `Full-Day (8h Shift): ${formatRate(fullDay8hLocal, currency, false)}`,
    `Monthly Estimate (22 Days / 176h): ${formatRate(monthlyLocal, currency, false)}`
  ];

  // English pitch for formal messaging / call script
  const englishText = `Hi ${candidateDisplayName},

Thank you for your time during our technical interview today.

Based on your ${experienceYears} years of experience in ${role} and our verified 2026 market rate benchmarks for ${country}, your position maps directly to our ${tierLabel} compensation tier:

• Role: ${role}
• Experience Tier: ${tierLabel}
• Hourly Rate: ${formatRate(hourlyLocal, currency, true)} (~$${hourlyUsd.toFixed(1)} USD/hr ref)
• Full-Day Rate (8 hours): ${formatRate(fullDay8hLocal, currency, false)}
• Half-Day Rate (5 hours): ${formatRate(halfDay5hLocal, currency, false)}
• Monthly Baseline (22 working days): ${formatRate(monthlyLocal, currency, false)}

This compensation is for direct engineer pay (clean payout, guaranteed shift hours). Please let us know if this aligns with your availability so we can proceed with onboarding.

Best regards,
Hiring & Technical Interview Team`;

  // Roman Urdu pitch for direct local verbal negotiation on call / WhatsApp
  const urduText = `Assalam-o-Alaikum ${candidateDisplayName},

Interview me baat kar ke bohot accha laga. Aapke ${experienceYears} saal ke experience aur ${role} ke skills ke hisaab se hamara official 2026 pay scale rule (${tierLabel}) ye offer karta hai:

• Hourly Rate: ${formatRate(hourlyLocal, currency, true)} (~$${hourlyUsd.toFixed(1)} USD/hr ref)
• Full-Day (8 Ghantay): ${formatRate(fullDay8hLocal, currency, false)}
• Half-Day (5 Ghantay): ${formatRate(halfDay5hLocal, currency, false)}
• Monthly Estimate (22 working days): ${formatRate(monthlyLocal, currency, false)}

Ye direct engineer pay rate hai bina kisi delay ke. Kya ye package aapko confirm hai taake hum contract process start karein?`;

  let negotiationAdvice = `Rule applied: ${calc.formulaNote}.`;
  if (compText) {
    negotiationAdvice += ` ${compText}`;
  } else {
    negotiationAdvice += ` Suitable as a firm starting offer. Confirm candidate location, contract length, and schedule availability.`;
  }

  return {
    englishText,
    urduText,
    quickBullets,
    negotiationAdvice,
    deltaPercent,
    deltaStatus
  };
}
