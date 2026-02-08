import { Account } from "./types";

export interface ActivityStatus {
  status: 'active' | 'recent' | 'inactive' | 'dormant';
  label: string;
  color: string;
}

export interface CrewActivity {
  name: string;
  memberCount: number;
  activityScore: number;
}

export const getActivityStatus = (lastSeen: number): ActivityStatus => {
  const now = Date.now();
  const lastSeenMs = lastSeen;
  const daysSince = (now - lastSeenMs) / (1000 * 60 * 60 * 24);

  if (daysSince <= 1) {
    return { status: 'active', label: 'Active', color: 'var(--accent-green)' };
  } else if (daysSince <= 7) {
    return { status: 'recent', label: 'Recent', color: '#39c5cf' }; // Cyan
  } else if (daysSince <= 30) {
    return { status: 'inactive', label: 'Inactive', color: 'var(--accent-orange)' };
  } else {
    return { status: 'dormant', label: 'Dormant', color: 'var(--text-tertiary)' };
  }
};

export const getCrewMemberCount = (accounts: Account[], crewName: string): number => {
  if (!crewName || crewName === 'N/A') return 0;
  return accounts.filter(acc => acc.crew_name === crewName).length;
};

export const getCrewActivityScores = (accounts: Account[]): CrewActivity[] => {
  const crews: Record<string, { totalDays: number; members: number }> = {};
  const now = Date.now();

  accounts.forEach(acc => {
    if (acc.crew_name && acc.crew_name !== 'N/A') {
      if (!crews[acc.crew_name]) {
        crews[acc.crew_name] = { totalDays: 0, members: 0 };
      }
      const daysSince = (now - (acc.last_seen)) / (1000 * 60 * 60 * 24);
      crews[acc.crew_name].totalDays += daysSince;
      crews[acc.crew_name].members++;
    }
  });

  const crewScores: CrewActivity[] = Object.entries(crews).map(([name, data]) => ({
    name,
    memberCount: data.members,
    activityScore: data.totalDays / data.members,
  }));

  return crewScores.sort((a, b) => a.activityScore - b.activityScore);
};