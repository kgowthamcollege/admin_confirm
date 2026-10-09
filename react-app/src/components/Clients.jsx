import Badge from './Badge.jsx';
import { byExpiry, statusOf } from '../lib/dates';

export default function Clients({ clients, domains, search, onSearch, onAdd, onEdit, onDelete, onAddDomain, onViewDomains }) {
  const q = search.trim().toLowerCase();
  const list = clients
    .filter((c) => !q || [c.name, c.company, c.email, c.phone, c.address, c.notes].some((v) => (v || '').toLowerCase().includes(q)))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section>
      <div className="view-head">
        <h1>Clients</h1>
        <button className="btn primary" onClick={onAdd}>+ Add client</button>
      </div>
      <div className="toolbar">
        <input
          type="search"
          placeholder="Search name, company, email, phone…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="table-wrap">
        {!list.length ? (
          <div className="empty">
            {clients.length ? 'No clients match your search.' : 'No clients yet. Click “Add client” to create one.'}
          </div>
        ) : (
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Domains</th><th>Next expiry</th><th></th></tr>
            </thead>
            <tbody>
              {list.map((c) => {
                const owned = domains.filter((d) => d.clientId === c.id).sort(byExpiry);
                const next = owned[0];
                return (
                  <tr key={c.id}>
                    <td>
                      <strong>{c.name}</strong>
                      {c.company && <div className="sub">{c.company}</div>}
                    </td>
                    <td>{c.email ? <a href={`mailto:${c.email}`}>{c.email}</a> : '—'}</td>
                    <td>{c.phone || '—'}</td>
                    <td>{owned.length}</td>
                    <td>{next ? <>{next.name} <Badge status={statusOf(next)} /></> : '—'}</td>
                    <td className="actions">
                      <button className="btn small" onClick={() => onAddDomain(c.id)}>+ Domain</button>
                      <button className="btn small" onClick={() => onViewDomains(c.id)}>Domains</button>
                      <button className="btn small" onClick={() => onEdit(c.id)}>Edit</button>
                      <button className="btn small danger" onClick={() => onDelete(c.id)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
