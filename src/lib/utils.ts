export const isDateInEnabledPeriod = (postingDate: Date): boolean => {
  const currentDate = new Date();
  const startOfPeriod = new Date(postingDate);
  startOfPeriod.setDate(1); // Set to the 1st day of the month
  const endOfPeriod = new Date(startOfPeriod);
  endOfPeriod.setDate(10); // Set to the 10th day of the month

  return currentDate >= startOfPeriod && currentDate <= endOfPeriod;
};

export const calculateQuarterStartDate = (date: Date): Date => {
  const quarter = Math.floor(date.getMonth() / 3);
  const quarterStartMonth = (quarter + 1) * 3; // Advance by three months
  const year = date.getFullYear() + (quarterStartMonth > 11 ? 1 : 0);
  const month = quarterStartMonth % 12;

  return new Date(year, month, 1); // Return the 1st day of the calculated quarter
};

//updatedAt
export const getRelativeTime = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds === 1 ? "" : "s"} ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks} week${diffInWeeks === 1 ? "" : "s"} ago`;
};

