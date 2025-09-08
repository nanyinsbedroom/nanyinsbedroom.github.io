export interface ActivityStatus {
  status: 'online' | 'recent' | 'inactive' | 'dormant';
  label: string;
  color: string;
}

export interface RegionActivityData {
  online: number;
  recent: number;
  inactive: number;
  dormant: number;
  total: number;
}

export const getActivityStatus = (lastSeen: number): ActivityStatus => {
  const now = Date.now();
  const lastSeenMs = lastSeen * 1000;
  const daysSince = (now - lastSeenMs) / (1000 * 60 * 60 * 24);

  if (daysSince <= 1) {
    return { status: 'online', label: 'Online', color: 'var(--accent-green)' };
  } else if (daysSince <= 7) {
    return { status: 'recent', label: 'Recent', color: 'var(--accent-blue)' };
  } else if (daysSince <= 30) {
    return { status: 'inactive', label: 'Inactive', color: 'var(--accent-orange)' };
  } else {
    return { status: 'dormant', label: 'Dormant', color: 'var(--text-secondary)' };
  }
};

export const getCrewMemberCount = (accounts: any[], crewName: string): number => {
  if (!crewName || crewName === 'N/A') return 0;
  return accounts.filter(acc => acc.crew_name === crewName).length;
};

export const getRegionalActivitySummary = (accounts: any[]): Record<string, RegionActivityData> => {
  const summary = accounts.reduce((acc, player) => {
    const region = player.server_region;
    const activity = getActivityStatus(player.last_seen);
    
    if (!acc[region]) {
      acc[region] = { online: 0, recent: 0, inactive: 0, dormant: 0, total: 0 };
    }
    
    acc[region][activity.status]++;
    acc[region].total++;
    
    return acc;
  }, {} as Record<string, RegionActivityData>);
  
  return summary;
};
