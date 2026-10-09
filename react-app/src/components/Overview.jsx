import DomainTable from './DomainTable.jsx';
import { byExpiry, statusOf } from '../lib/dates';

export default function Overview({ clients, domains, onRenew, onEdit }) {
  const counts = { expired: 0, critical: 0, soon: 0, ok: 0 };
  domains.forEach((d) => counts[statusOf(d).key]++);
  const tiles = [
    ['Clients', clients.length, ''],
    ['Domains', domains.length, ''],
    ['Expired', counts.expired, counts.expired ? 'expired' : ''],
    ['Expiring ≤ 30 days', counts.critical, counts.critical ? 'critical' : ''],
    ['Expiring ≤ 90 days', counts.soon, counts.soon ? 'soon' : ''],
  ];
  const attention = domains.filter((d) => statusOf(d).key !== 'ok').sort(byExpiry);

  return (
    <section>
      <div className="view-head"><h1>Overview</h1></div>
      <div className="tiles">
        {tiles.map(([label, value, cls]) => (
          <div className={`tile ${cls}`} key={label}>
            <div className="label">{label}</div>
            <div className="value">{value}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <h2>Needs attention (expired or expiring within 90 days)</h2>
        <div className="table-wrap">
          {attention.length ? (
            <DomainTable domains={attention} clients={clients} compact onRenew={onRenew} onEdit={onEdit} />
          ) : (
            <div className="empty">
              {domains.length ? 'Nothing expiring in the next 90 days.' : 'No domains yet. Add clients and domains to get started.'}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
