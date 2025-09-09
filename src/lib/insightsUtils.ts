import { Account } from "./types";

export interface AccountAgeInfo {
  account: Account;
  ageInDays: number;
}

function calculateAgeInDays(registeredDate: string): number {
  const regDate = new Date(registeredDate);
  if (isNaN(regDate.getTime())) return 0;
  return Math.floor((Date.now() - regDate.getTime()) / (1000 * 60 * 60 * 24));
}

export function getNewPlayersInLast(accounts: Account[], days: number): number {
  const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
  return accounts.filter(acc => new Date(acc.registered).getTime() >= threshold).length;
}

export function getMostActiveRegionToday(accounts: Account[]): string {
  const threshold = Date.now() - 24 * 60 * 60 * 1000;
  const recentActivity: Record<string, number> = {};
  accounts.forEach(acc => {
    if (acc.last_seen * 1000 >= threshold) {
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
    if (new Date(acc.registered).getTime() >= threshold && acc.crew_name && acc.crew_name !== 'N/A') {
      newCrewMembers[acc.crew_name] = (newCrewMembers[acc.crew_name] || 0) + 1;
    }
  });
  if (Object.keys(newCrewMembers).length === 0) return "N/A";
  return Object.entries(newCrewMembers).reduce((a, b) => a[1] > b[1] ? a : b)[0];
}

export function getAccountAgeExtremes(accounts: Account[]): { oldest: AccountAgeInfo; newest: AccountAgeInfo } | null {
  const validAccounts = accounts.filter(acc => acc.registered && !isNaN(new Date(acc.registered).getTime()));
  if (validAccounts.length === 0) {
    return null;
  }

  let oldestAccount = validAccounts[0];
  let newestAccount = validAccounts[0];

  for (const account of validAccounts) {
    if (new Date(account.registered).getTime() < new Date(oldestAccount.registered).getTime()) {
      oldestAccount = account;
    }
    if (new Date(account.registered).getTime() > new Date(newestAccount.registered).getTime()) {
      newestAccount = account;
    }
  }

  return {
    oldest: { account: oldestAccount, ageInDays: calculateAgeInDays(oldestAccount.registered) },
    newest: { account: newestAccount, ageInDays: calculateAgeInDays(newestAccount.registered) },
  };
}