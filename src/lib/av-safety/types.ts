export type AvSafetyData = {
  updatedAt: string;
  /** SGO 2021-01 ADS incident-report CSV URL the data was built from. */
  source: string;
  /** De-duplicated SGO reports (latest version per Report ID). */
  totalReports: number;
  /** ISO yyyy-mm, ascending, with zero-filled gaps. */
  reportsByMonth: { month: string; count: number }[];
  reportsByEntity: { entity: string; count: number }[];
  injurySeverity: { severity: string; count: number }[];
  crashWith: { counterparty: string; count: number }[];
  reportsByState?: { state: string; count: number }[];
};
