import ClientOptions from './ClientOptions.jsx';
import DomainTable from './DomainTable.jsx';
import { byExpiry, statusOf } from '../lib/dates';

export default function Domains({ clients, domains, filters, onFilters, onAdd, onRenew, onEdit, onDelete }) {
  const q = filters.q.trim().toLowerCase();
  const clientName = (id) => clients.find((c) => c.id === id)?.name || '';
  const list = domains.filter((d) => {
    if (filters.clientId && d.clientId !== filters.clientId) return false;
    if (filters.status && statusOf(d).key !== filters.status) return false;
    if (!q) return true;
    return [d.name, d.registrar, d.notes, clientName(d.clientId)].some((v) => (v || '').toLowerCase().includes(q));
  }).sort(byExpiry);

  const set = (patch) => onFilters({ ...filters, ...patch });

  return (
    <section>
      <div className="view-head">
        <h1>Domains</h1>
        <button className="btn primary" onClick={onAdd}>+ Add domain</button>
      </div>
      <div className="toolbar">
        <input
          type="search"
          placeholder="Search domain, client, registrar…"
          value={filters.q}
          onChange={(e) => set({ q: e.target.value })}
        />
        <select value={filters.clientId} onChange={(e) => set({ clientId: e.target.value })}>
          <ClientOptions clients={clients} emptyLabel="All clients" />
        </select>
        <select value={filters.status} onChange={(e) => set({ status: e.target.value })}>
          <option value="">All statuses</option>
          <option value="expired">Expired</option>
          <option value="critical">Expiring ≤ 30 days</option>
          <option value="soon">Expiring ≤ 90 days</option>
          <option value="ok">Active</option>
        </select>
      </div>
      <div className="table-wrap">
        {list.length ? (
          <DomainTable domains={list} clients={clients} onRenew={onRenew} onEdit={onEdit} onDelete={onDelete} />
        ) : (
          <div className="empty">
            {domains.length ? 'No domains match your filters.' : 'No domains yet. Click “Add domain” to create one.'}
          </div>
        )}
      </div>
    </section>
  );
}
