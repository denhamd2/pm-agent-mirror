/**
 * Shared BP duration labels and type definitions.
 * Extracted from data-bp-durations.ts so dashboards that only need LABELS
 * (e.g. Customer Scorecard, Value Realisation) don't load the 102 MB data file.
 */

export const LABELS = ["2025-04", "2025-05", "2025-06", "2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12", "2026-01", "2026-02", "2026-03"] as const;

export const REGION_OPTIONS = ["APAC", "Corporate", "EMEA", "Japan", "North America", "US Federal", "Unknown"] as const;
export const INDUSTRY_OPTIONS = ["Education", "Energy & Utilities", "Federal / National Government", "Financial Services", "Healthcare", "Hospitality", "Manufacturing", "Non-Profit", "Professional & Business Services", "Public Sector", "Retail", "Technology & Media", "Transportation", "Unknown"] as const;

export interface StatusMetrics { events: number; avgDays: number | null; medianDays: number | null; avgSteps: number | null; pctSentBack: number; pctCorrected: number; pctReassigned: number; }
export interface BpMonthly { ym: string; completed: StatusMetrics; inProgress: StatusMetrics; cancelled: StatusMetrics; other: StatusMetrics; total: number; tenants: number; completionPct: number; cancellationPct: number; avgDays: number | null; medianDays: number | null; }
export interface SubBpConfig { key: string; label: string; description: string; data: BpMonthly[]; }
export type AggTuple = [string, string, string, string, number, number, number | null, number | null, number | null, number, number, number, string, string];
