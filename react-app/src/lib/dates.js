const DAY = 86400000;

// Dates are stored as YYYY-MM-DD and treated as local calendar days.
export function parseDate(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
}

export function toISO(d) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function fmtDate(s) {
  const d = parseDate(s);
  return d ? d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—';
}

function daysLeft(s) {
  const d = parseDate(s);
  if (!d) return null;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((d - today) / DAY);
}

export function statusOf(domain) {
  const n = daysLeft(domain.expiry);
  if (n === null) return { key: 'ok', label: 'No date', days: Infinity };
  if (n < 0) return { key: 'expired', label: `Expired ${-n}d ago`, days: n };
  if (n === 0) return { key: 'critical', label: 'Expires today', days: n };
  if (n <= 30) return { key: 'critical', label: `${n}d left`, days: n };
  if (n <= 90) return { key: 'soon', label: `${n}d left`, days: n };
  return { key: 'ok', label: `${n}d left`, days: n };
}

export function byExpiry(a, b) {
  return statusOf(a).days - statusOf(b).days;
}

// Returns the ISO date one year after the given one, or null if it is not a date.
export function addYear(s) {
  const date = parseDate(s);
  if (!date) return null;
  const month = date.getMonth();
  date.setFullYear(date.getFullYear() + 1);
  if (date.getMonth() !== month) date.setDate(0); // Feb 29 -> Feb 28
  return toISO(date);
}
