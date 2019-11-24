export function marketsAreOpen(now = new Date()) {
  if (isWeekend(now)) return false;
  if (isBefore930AM(now)) return false;
  if (isAfter400PM(now)) return false;
  return true;
}

function isWeekend(date) {
  const day = date.getDay();
  return day == 0 || day == 6 ? true : false;
}

function isBefore930AM(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  if (hours < 9) return true;
  if (hours == 9 && minutes < 30) return true;
  return false;
}

function isAfter400PM(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  if (hours > 16) return true;
  if (hours == 16 && minutes > 0) return true;
  return false;
}
