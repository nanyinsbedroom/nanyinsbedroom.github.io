import { Account } from "./types";
import { parseAllDateFormats } from "./formatters";

export interface CohortData {
  cohortMonth: string;
  totalPlayers: number;
  retention: (number | null)[];
}

function monthDiff(d1: Date, d2: Date): number {
  let months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}

export function calculateRetentionCohorts(accounts: Account[]): CohortData[] {
  const cohorts: Record<string, { registered: Date[]; activities: Record<number, Set<number>> }> = {};

  accounts.forEach(acc => {
    if (!acc.registered) return;
    
    // MODIFICATION: Use the robust parser for registered dates
    const registeredDate = parseAllDateFormats(acc.registered);
    if (!registeredDate || isNaN(registeredDate.getTime())) return;

    const cohortKey = `${registeredDate.getFullYear()}-${String(registeredDate.getMonth() + 1).padStart(2, '0')}`;

    if (!cohorts[cohortKey]) {
      cohorts[cohortKey] = { registered: [], activities: {} };
    }
    cohorts[cohortKey].registered.push(registeredDate);

    // The last_seen is a UNIX timestamp in seconds, so it's handled by `new Date(acc.last_seen)`
    const lastSeenDate = new Date(acc.last_seen); 

    const monthIndex = monthDiff(registeredDate, lastSeenDate);

    if (!cohorts[cohortKey].activities[monthIndex]) {
      cohorts[cohortKey].activities[monthIndex] = new Set();
    }
    cohorts[cohortKey].activities[monthIndex].add(acc.role_id);
  });

  return Object.entries(cohorts)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([cohortMonth, data]) => {
      const totalPlayers = data.registered.length;
      const retention: (number | null)[] = [];
      const maxMonth = Math.max(0, ...Object.keys(data.activities).map(Number));

      for (let i = 0; i <= maxMonth; i++) {
        const activePlayers = data.activities[i]?.size || 0;
        const percentage = totalPlayers > 0 ? parseFloat(((activePlayers / totalPlayers) * 100).toFixed(1)) : 0;
        retention.push(percentage);
      }
      return { cohortMonth, totalPlayers, retention };
    });
}

export function calculateAverageRetention(cohorts: CohortData[]): (number | null)[] {
  const averageRetention: (number | null)[] = [];
  for (let i = 0; i < 13; i++) {
    const monthlyData = cohorts
      .map(c => c.retention[i])
      .filter(p => p !== null && p !== undefined) as number[];

    if (monthlyData.length > 0) {
      const average = monthlyData.reduce((sum, val) => sum + val, 0) / monthlyData.length;
      averageRetention.push(parseFloat(average.toFixed(1)));
    } else {
      averageRetention.push(null);
    }
  }
  return averageRetention;
}