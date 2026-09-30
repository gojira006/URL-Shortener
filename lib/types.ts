export type Link = { id: string; user_id: string; slug: string; target_url: string; created_at: string; expires_at: string | null };
export type AnalyticsRow = { label: string; clicks: number };
export type Analytics = { total: number; perDay: AnalyticsRow[]; country: AnalyticsRow[]; device: AnalyticsRow[]; browser: AnalyticsRow[]; referrer: AnalyticsRow[] };
