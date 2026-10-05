/**
 * ENGINEER PAY RATE CARD — COUNTRY & LOCAL CURRENCY (2026)
 * Source: engineer_pay_rate_card_by_country_2026.xlsx
 * Exactly 987 Records (47 Countries x 21 Roles)
 * Half-day = 5 hours | Full-day = 8 hours
 */

import { RateCardRecord, ExperienceRule, CalculatedRate } from '../types/index';
import rawRateCardJson from './rawRateCard.json';

export const RATE_CARD_METADATA = {
  sourceFile: "engineer_pay_rate_card_by_country_2026.xlsx",
  worksheet: "Engineer Pay Only",
  tableName: "EngineerPayRates",
  title: "ENGINEER PAY RATE CARD — COUNTRY & LOCAL CURRENCY",
  subtitle: "Engineer pay only — no agency margin, no client bill rate | Half-day = 5 hours | Full-day = 8 hours",
  methodologyNote: "L1 = junior/first-line | L2 = experienced/second-line | L3 = senior/lead/third-line | Local rates are rounded market-pay benchmarks",
  importantNote: "Important: This is engineer compensation/pay, not client billing. Country/level anchors were taken from the researched market-pay ranges; role-by-role rows are calculated benchmarks using role skill premiums/discounts and the country pay anchor. They are suitable for starting offers, then confirm the specific candidate, city, employment model and contract length.",
  fxSource: "https://open.er-api.com/v6/latest/USD",
  sourceUpdate: "Sun, 04 Oct 2026 00:02:32 +0000",
  recordCount: 987
};

/**
 * Official "Experience ke hisaab se pay rule":
 * 0–2 years  -> L1 rate
 * 3–6 years  -> L2 rate
 * 7–10 years -> L3 rate
 * 11–15 years -> L3 + 10%
 * 16–20 years -> L3 + 15%
 * 20+ years  -> L3 + 20%
 */
export const EXPERIENCE_RULES: ExperienceRule[] = [
  {
    tier: 'L1',
    rangeLabel: '0–2 years',
    minYears: 0,
    maxYears: 2,
    formulaDescription: 'Base L1 Rate (Junior / First-line support & engineering)',
    rateMultiplierFromL3: 0,
    levelCode: 'L1',
    markupPercent: 0
  },
  {
    tier: 'L2',
    rangeLabel: '3–6 years',
    minYears: 3,
    maxYears: 6,
    formulaDescription: 'Base L2 Rate (Experienced / Second-line engineer)',
    rateMultiplierFromL3: 0,
    levelCode: 'L2',
    markupPercent: 0
  },
  {
    tier: 'L3',
    rangeLabel: '7–10 years',
    minYears: 7,
    maxYears: 10,
    formulaDescription: 'Base L3 Rate (Senior / Lead / Third-line engineer)',
    rateMultiplierFromL3: 1.0,
    levelCode: 'L3',
    markupPercent: 0
  },
  {
    tier: 'L3+10%',
    rangeLabel: '11–15 years',
    minYears: 11,
    maxYears: 15,
    formulaDescription: 'L3 rate + 10% Seniority Premium',
    rateMultiplierFromL3: 1.10,
    levelCode: 'L3',
    markupPercent: 10
  },
  {
    tier: 'L3+15%',
    rangeLabel: '16–20 years',
    minYears: 16,
    maxYears: 20,
    formulaDescription: 'L3 rate + 15% Principal / Veteran Premium',
    rateMultiplierFromL3: 1.15,
    levelCode: 'L3',
    markupPercent: 15
  },
  {
    tier: 'L3+20%',
    rangeLabel: '20+ years',
    minYears: 21,
    maxYears: 99,
    formulaDescription: 'L3 rate + 20% Industry Expert / Fellow Premium',
    rateMultiplierFromL3: 1.20,
    levelCode: 'L3',
    markupPercent: 20
  }
];

export const COUNTRY_REGIONS: Record<string, string> = {
  "United States": "North America",
  "Canada": "North America",
  "United Kingdom": "Europe",
  "Ireland": "Europe",
  "Germany": "Europe",
  "Switzerland": "Europe",
  "Austria": "Europe",
  "Netherlands": "Europe",
  "Belgium": "Europe",
  "France": "Europe",
  "Spain": "Europe",
  "Italy": "Europe",
  "Portugal": "Europe",
  "Sweden": "Europe",
  "Norway": "Europe",
  "Denmark": "Europe",
  "Finland": "Europe",
  "Poland": "Europe",
  "Czech Republic": "Europe",
  "Hungary": "Europe",
  "Romania": "Europe",
  "Ukraine": "Europe",
  "India": "Asia",
  "Pakistan": "Asia",
  "Bangladesh": "Asia",
  "Sri Lanka": "Asia",
  "China": "Asia",
  "Japan": "Asia",
  "South Korea": "Asia",
  "Singapore": "Asia",
  "Hong Kong": "Asia",
  "Australia": "Oceania",
  "New Zealand": "Oceania",
  "Brazil": "Latin America",
  "Mexico": "Latin America",
  "Argentina": "Latin America",
  "Chile": "Latin America",
  "Colombia": "Latin America",
  "United Arab Emirates": "Middle East",
  "Saudi Arabia": "Middle East",
  "Israel": "Middle East",
  "Turkey": "Middle East",
  "South Africa": "Africa",
  "Nigeria": "Africa",
  "Kenya": "Africa",
  "Egypt": "Africa",
  "Morocco": "Africa",
};

export const COUNTRY_CURRENCIES: Record<string, string> = {
  "United States": "USD",
  "Canada": "CAD",
  "United Kingdom": "GBP",
  "Ireland": "EUR",
  "Germany": "EUR",
  "Switzerland": "CHF",
  "Austria": "EUR",
  "Netherlands": "EUR",
  "Belgium": "EUR",
  "France": "EUR",
  "Spain": "EUR",
  "Italy": "EUR",
  "Portugal": "EUR",
  "Sweden": "SEK",
  "Norway": "NOK",
  "Denmark": "DKK",
  "Finland": "EUR",
  "Poland": "PLN",
  "Czech Republic": "CZK",
  "Hungary": "HUF",
  "Romania": "RON",
  "Ukraine": "UAH",
  "India": "INR",
  "Pakistan": "PKR",
  "Bangladesh": "BDT",
  "Sri Lanka": "LKR",
  "China": "CNY",
  "Japan": "JPY",
  "South Korea": "KRW",
  "Singapore": "SGD",
  "Hong Kong": "HKD",
  "Australia": "AUD",
  "New Zealand": "NZD",
  "Brazil": "BRL",
  "Mexico": "MXN",
  "Argentina": "ARS",
  "Chile": "CLP",
  "Colombia": "COP",
  "United Arab Emirates": "AED",
  "Saudi Arabia": "SAR",
  "Israel": "ILS",
  "Turkey": "TRY",
  "South Africa": "ZAR",
  "Nigeria": "NGN",
  "Kenya": "KES",
  "Egypt": "EGP",
  "Morocco": "MAD",
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  CAD: "CA$",
  GBP: "£",
  EUR: "€",
  CHF: "CHF ",
  SEK: "kr ",
  NOK: "kr ",
  DKK: "kr. ",
  PLN: "zł ",
  CZK: "Kč ",
  HUF: "Ft ",
  RON: "lei ",
  UAH: "₴",
  INR: "₹",
  PKR: "Rs ",
  BDT: "৳",
  LKR: "Rs ",
  CNY: "¥",
  JPY: "¥",
  KRW: "₩",
  SGD: "S$",
  HKD: "HK$",
  AUD: "A$",
  NZD: "NZ$",
  BRL: "R$",
  MXN: "Mex$",
  ARS: "$",
  CLP: "CLP$",
  COP: "COL$",
  AED: "AED ",
  SAR: "SAR ",
  ILS: "₪",
  TRY: "₺",
  ZAR: "R ",
  NGN: "₦",
  KES: "KSh ",
  EGP: "E£ ",
  MAD: "DH "
};

export const ALL_COUNTRIES: string[] = [
  "United States",
  "Canada",
  "United Kingdom",
  "Ireland",
  "Germany",
  "Switzerland",
  "Austria",
  "Netherlands",
  "Belgium",
  "France",
  "Spain",
  "Italy",
  "Portugal",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Poland",
  "Czech Republic",
  "Hungary",
  "Romania",
  "Ukraine",
  "India",
  "Pakistan",
  "Bangladesh",
  "Sri Lanka",
  "China",
  "Japan",
  "South Korea",
  "Singapore",
  "Hong Kong",
  "Australia",
  "New Zealand",
  "Brazil",
  "Mexico",
  "Argentina",
  "Chile",
  "Colombia",
  "United Arab Emirates",
  "Saudi Arabia",
  "Israel",
  "Turkey",
  "South Africa",
  "Nigeria",
  "Kenya",
  "Egypt",
  "Morocco",
];

export const ALL_ROLES: string[] = [
  "Service Desk / Helpdesk",
  "Desktop / Field Support",
  "NOC Engineer",
  "Network Engineer",
  "Network Security Engineer",
  "Systems Administrator",
  "Infrastructure Engineer",
  "Cloud Engineer",
  "DevOps / SRE Engineer",
  "Cybersecurity Analyst / Engineer",
  "QA Manual Tester",
  "QA Automation / SDET",
  "Software Engineer",
  "Full-stack Engineer",
  "Data Engineer",
  "AI / ML Engineer",
  "Database Administrator / DBA",
  "Solutions Architect",
  "Technical Lead",
  "IT Project Manager",
  "ERP / SAP Consultant",
];

export const RATE_CARD_RECORDS: RateCardRecord[] = (rawRateCardJson.records as any[]).map((r) => ({
  country: r['Country'],
  currency: r['Currency'],
  role: r['Role / Skill'],
  l1UsdRef: Number(r['L1 USD/hr ref']),
  l1LocalHr: Number(r['L1 local/hr']),
  l1Local5h: Number(r['L1 local 5h']),
  l1Local8h: Number(r['L1 local 8h']),
  l2UsdRef: Number(r['L2 USD/hr ref']),
  l2LocalHr: Number(r['L2 local/hr']),
  l2Local5h: Number(r['L2 local 5h']),
  l2Local8h: Number(r['L2 local 8h']),
  l3UsdRef: Number(r['L3 USD/hr ref']),
  l3LocalHr: Number(r['L3 local/hr']),
  l3Local5h: Number(r['L3 local 5h']),
  l3Local8h: Number(r['L3 local 8h']),
}));

/**
 * Fast lookup map: key = `${country}___${role}`
 */
const recordMap = new Map<string, RateCardRecord>();
for (const rec of RATE_CARD_RECORDS) {
  recordMap.set(`${rec.country}___${rec.role}`, rec);
}

export function getRateRecord(country: string, role: string): RateCardRecord | undefined {
  return recordMap.get(`${country}___${role}`);
}

/**
 * Determine experience tier rule given years of experience
 */
export function getExperienceTierRule(years: number): ExperienceRule {
  const safeYears = Math.max(0, years);
  for (const rule of EXPERIENCE_RULES) {
    if (safeYears >= rule.minYears && safeYears <= rule.maxYears) {
      return rule;
    }
  }
  return EXPERIENCE_RULES[EXPERIENCE_RULES.length - 1];
}

/**
 * Calculate complete rate breakdown for candidate according to Experience Pay Rule
 */
export function calculateCandidateRate(
  country: string,
  role: string,
  experienceYears: number
): CalculatedRate | null {
  const record = getRateRecord(country, role);
  if (!record) return null;

  const rule = getExperienceTierRule(experienceYears);

  let hourlyLocal = 0;
  let hourlyUsd = 0;
  let halfDay5hLocal = 0;
  let halfDay5hUsd = 0;
  let fullDay8hLocal = 0;
  let fullDay8hUsd = 0;

  if (rule.levelCode === 'L1') {
    hourlyLocal = record.l1LocalHr;
    hourlyUsd = record.l1UsdRef;
    halfDay5hLocal = record.l1Local5h;
    halfDay5hUsd = record.l1UsdRef * 5;
    fullDay8hLocal = record.l1Local8h;
    fullDay8hUsd = record.l1UsdRef * 8;
  } else if (rule.levelCode === 'L2') {
    hourlyLocal = record.l2LocalHr;
    hourlyUsd = record.l2UsdRef;
    halfDay5hLocal = record.l2Local5h;
    halfDay5hUsd = record.l2UsdRef * 5;
    fullDay8hLocal = record.l2Local8h;
    fullDay8hUsd = record.l2UsdRef * 8;
  } else {
    const mult = rule.rateMultiplierFromL3;
    hourlyLocal = record.l3LocalHr * mult;
    hourlyUsd = record.l3UsdRef * mult;
    halfDay5hLocal = record.l3Local5h * mult;
    halfDay5hUsd = (record.l3UsdRef * 5) * mult;
    fullDay8hLocal = record.l3Local8h * mult;
    fullDay8hUsd = (record.l3UsdRef * 8) * mult;
  }

  // Monthly is based on 22 working days x 8 hours = 176 hours
  const monthlyLocal = fullDay8hLocal * 22;
  const monthlyUsd = fullDay8hUsd * 22;

  return {
    country,
    currency: record.currency,
    role,
    experienceYears,
    tier: rule.tier,
    tierLabel: `${rule.tier} (${rule.rangeLabel})`,
    hourlyLocal,
    hourlyUsd,
    halfDay5hLocal,
    halfDay5hUsd,
    fullDay8hLocal,
    fullDay8hUsd,
    monthlyLocal,
    monthlyUsd,
    formulaNote: rule.formulaDescription
  };
}

/**
 * Currency formatter with clean rounding
 */
export function formatRate(amount: number, currency: string, isHourly = true): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '—';
  
  const isHighDenom = ['JPY', 'KRW', 'HUF', 'CLP', 'COP', 'PKR', 'INR', 'BDT', 'LKR', 'NGN', 'KES', 'ARS', 'CZK', 'UAH'].includes(currency);
  
  let formattedNumber = '';
  if (isHighDenom) {
    formattedNumber = Math.round(amount).toLocaleString('en-US');
  } else {
    formattedNumber = amount.toLocaleString('en-US', {
      minimumFractionDigits: isHourly ? 2 : 1,
      maximumFractionDigits: 2
    });
  }

  const symbol = CURRENCY_SYMBOLS[currency] || (currency + ' ');
  return `${symbol}${formattedNumber}`;
}
