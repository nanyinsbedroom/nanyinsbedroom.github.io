import { Account } from "./types";
import { parseAllDateFormats } from "./formatters";

export interface AccountAgeInfo {
  account: Account;
  ageInDays: number;
}

function calculateAgeInDays(registeredDate: string): number {
  const regDate = parseAllDateFormats(registeredDate);
  if (!regDate || isNaN(regDate.getTime())) return 0;
  
  // MODIFICATION: Ensure ageInDays is never negative
  const diffInMilliseconds = Date.now() - regDate.getTime();
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffInDays); // Ensure days are at least 0
}

export function getNewPlayersInLast(accounts: Account[], days: number): number {
  const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
  return accounts.filter(acc => {
    const regDate = parseAllDateFormats(acc.registered);
    return regDate ? regDate.getTime() >= threshold : false;
  }).length;
}

export function getMostActiveRegionToday(accounts: Account[]): string {
  const threshold = Date.now() - 24 * 60 * 60 * 1000;
  const recentActivity: Record<string, number> = {};
  accounts.forEach(acc => {
    if (acc.last_seen >= threshold) {
      recentActivity[acc.server_region] = (recentActivity[acc.server_region] || 0) + 1;
    }
  });
  if (Object.keys(recentActivity).length === 0) return "N/A";
  return Object.entries(recentActivity).reduce((a, b) => a[1] > b[1] ? a : b)[0];
}

export function getFastestGrowingCrew(accounts: Account[]): string {
  const threshold = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const newCrewMembers: Record<string, number> = {};
  accounts.forEach(acc => {
    const regDate = parseAllDateFormats(acc.registered);
    if (regDate && regDate.getTime() >= threshold && acc.crew_name && acc.crew_name !== 'N/A') {
      newCrewMembers[acc.crew_name] = (newCrewMembers[acc.crew_name] || 0) + 1;
    }
  });
  if (Object.keys(newCrewMembers).length === 0) return "N/A";
  return Object.entries(newCrewMembers).reduce((a, b) => a[1] > b[1] ? a : b)[0];
}

export function getAccountAgeExtremes(accounts: Account[]): { oldest: AccountAgeInfo; newest: AccountAgeInfo } | null {
  const validAccounts = accounts.filter(acc => {
    if (!acc.registered) return false;
    const date = parseAllDateFormats(acc.registered);
    return date && !isNaN(date.getTime());
  });

  if (validAccounts.length === 0) {
    return null;
  }

  let oldestAccount = validAccounts[0];
  let newestAccount = validAccounts[0];

  for (const account of validAccounts) {
    const accountDate = parseAllDateFormats(account.registered)!;
    const oldestDate = parseAllDateFormats(oldestAccount.registered)!;
    const newestDate = parseAllDateFormats(newestAccount.registered)!;

    if (accountDate.getTime() < oldestDate.getTime()) {
      oldestAccount = account;
    }
    if (accountDate.getTime() > newestDate.getTime()) {
      newestAccount = account;
    }
  }

  return {
    oldest: { account: oldestAccount, ageInDays: calculateAgeInDays(oldestAccount.registered) },
    newest: { account: newestAccount, ageInDays: calculateAgeInDays(newestAccount.registered) },
  };
}