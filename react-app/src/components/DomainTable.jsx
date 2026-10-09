import Badge from './Badge.jsx';
import { fmtDate, statusOf } from '../lib/dates';

export default function DomainTable({ domains, clients, compact, onRenew, onEdit, onDelete }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Domain</th>
          <th>Client</th>
          {!compact && <><th>Registrar</th><th>Registered</th></>}
          <th>Expiry</th>
          <th>Status</th>
          {!compact && <><th>Auto-renew</th><th>Cost</th></>}
          <th></th>
        </tr>
      </thead>
      <tbody>
        {domains.map((d) => {
          const client = clients.find((c) => c.id === d.clientId);
          return (
            <tr key={d.id}>
              <td>
                <strong>{d.name}</strong>
                {d.notes && !compact && <div className="sub">{d.notes}</div>}
              </td>
              <td>{client ? client.name : <span className="sub">Unassigned</span>}</td>
              {!compact && <><td>{d.registrar || '—'}</td><td>{fmtDate(d.registered)}</td></>}
              <td>{fmtDate(d.expiry)}</td>
              <td><Badge status={statusOf(d)} /></td>
              {!compact && (
                <>
                  <td>{d.autoRenew ? 'Yes' : 'No'}</td>
                  <td>{d.cost !== '' && d.cost != null ? Number(d.cost).toFixed(2) : '—'}</td>
                </>
              )}
              <td className="actions">
                <button className="btn small" title="Extend expiry by one year" onClick={() => onRenew(d.id)}>+1 yr</button>
                <button className="btn small" onClick={() => onEdit(d.id)}>Edit</button>
                {!compact && <button className="btn small danger" onClick={() => onDelete(d.id)}>Delete</button>}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
