// Formats a timestamp into a relative string like "Yesterday (9/7/2025)".
export const formatRelativeDate = (dateInput: string | number) => {
  const date = new Date(dateInput);
  const now = new Date();

  const diffInSeconds = (now.getTime() - date.getTime()) / 1000;
  const diffInDays = Math.floor(diffInSeconds / 86400);

  let relativeString = '';
  if (diffInDays < 1) {
    relativeString = 'Today';
  } else if (diffInDays === 1) {
    relativeString = 'Yesterday';
  } else {
    relativeString = `${diffInDays.toLocaleString()} days ago`;
  }

  return `${relativeString} (${date.toLocaleDateString()})`;
};

// Formats a region key like "asia_pacific" into "Asia Pacific".
export const formatRegionName = (region: string) => {
  return region.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};