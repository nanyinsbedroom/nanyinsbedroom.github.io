// NEW: Add 'export' to make this function available to other files
export function parseAllDateFormats(dateInput: string | number): Date | null {
  if (typeof dateInput === 'string') {
    const chineseDateRegex = /(\d{4})年(\d{1,2})月(\d{1,2})日\s+(上午|下午)(\d{1,2}:\d{2}:\d{2})/;
    const match = dateInput.match(chineseDateRegex);

    if (match) {
      const [, year, month, day, period, time] = match;
      let [hours, minutes, seconds] = time.split(':').map(Number);

      if (period === '下午' && hours !== 12) {
        hours += 12;
      }
      if (period === '上午' && hours === 12) {
        hours = 0;
      }
      
      const isoString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      return new Date(isoString);
    } else {
      const standardizedDateInput = dateInput.replace(' ', 'T');
      return new Date(standardizedDateInput);
    }
  } else if (typeof dateInput === 'number') {
    return new Date(dateInput > 10000000000 ? dateInput : dateInput * 1000);
  }
  
  return null;
}

export const formatRelativeDate = (dateInput: string | number) => {
  const date = parseAllDateFormats(dateInput);

  if (!date || isNaN(date.getTime())) {
    return "Invalid Date";
  }

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

export const formatRegionName = (region: string) => {
  if (!region) return "N/A";
  if (/[^\u0000-\u007F]/.test(region)) {
    return region;
  }
  return region.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export const formatNumber = (num: number) => {
  return Math.floor(num).toLocaleString();
}