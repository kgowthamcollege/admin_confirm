const STORAGE_KEY = 'adminDashboard.v1';

export function isValidData(d) {
  return d && Array.isArray(d.clients) && Array.isArray(d.domains);
}

export function load() {
  try {
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (isValidData(d)) return d;
  } catch {}
  return { clients: [], domains: [] };
}

export function save(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    alert('Could not save to browser storage: ' + e.message);
  }
}

export function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}
