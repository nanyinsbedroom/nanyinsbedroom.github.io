// Structure for a single player account.
export interface Account {
  crew_id: number;
  crew_name: string;
  gender: number;
  last_seen: number;
  name: string;
  registered: string;
  role_id: number;
  server_region: string;
}

// Structure of the JSON file for each region.
export interface RegionData {
  accounts: Record<string, Omit<Account, 'server_region'>>;
}

// Structure of the main index.json file.
export interface IndexData {
  total_accounts: number;
  last_update: number;
}

// The final data object passed to the client dashboard.
export interface DashboardData {
  index: IndexData;
  accounts: Account[];
}