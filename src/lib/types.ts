export interface Account {
  level: number;
  hp: number;
  equipping_title: string;
  crew_id: number;
  crew_name: string;
  gender: number;
  last_seen: number;
  name: string;
  name_history: string[];
  registered: string;
  role_id: number;
  server_region: string;
}

export interface RegionData {
  accounts: Record<string, Omit<Account, 'server_region'>>;
}

export interface RegionIndexInfo {
  last_update: number;
  total_accounts: number;
}

export interface IndexData {
  last_update: number;
  total_accounts: number;
  regions: Record<string, RegionIndexInfo>;
}

export interface DashboardData {
  index: IndexData;
  accounts: Account[];
}