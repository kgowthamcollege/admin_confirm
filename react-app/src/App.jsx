import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Overview from './components/Overview.jsx';
import Clients from './components/Clients.jsx';
import Domains from './components/Domains.jsx';
import ClientDialog from './components/ClientDialog.jsx';
import DomainDialog from './components/DomainDialog.jsx';
import { addYear, fmtDate, toISO } from './lib/dates';
import { isValidData, load, newId, save } from './lib/storage';

const NO_FILTERS = { q: '', clientId: '', status: '' };

export default function App() {
  const [state, setState] = useState(load);
  const [view, setView] = useState('overview');
  const [clientSearch, setClientSearch] = useState('');
  const [domainFilters, setDomainFilters] = useState(NO_FILTERS);
  // null | { type: 'client', id } | { type: 'domain', id, presetClientId }
  const [dialog, setDialog] = useState(null);

  const { clients, domains } = state;

  useEffect(() => {
    save(state);
  }, [state]);

  // A filter pointing at a client that no longer exists falls back to "All clients".
  const filters = clients.some((c) => c.id === domainFilters.clientId)
    ? domainFilters
    : { ...domainFilters, clientId: '' };

  // ---------- clients ----------
  function saveClient(data) {
    const id = dialog.id;
    setState((s) => ({
      ...s,
      clients: id
        ? s.clients.map((c) => (c.id === id ? { ...c, ...data } : c))
        : [...s.clients, { id: newId(), ...data }],
    }));
    setDialog(null);
  }

  function deleteClient(id) {
    const c = clients.find((x) => x.id === id);
    if (!c) return;
    const owned = domains.filter((d) => d.clientId === id).length;
    const msg = owned
      ? `Delete client "${c.name}" and their ${owned} domain${owned === 1 ? '' : 's'}? This cannot be undone.`
      : `Delete client "${c.name}"? This cannot be undone.`;
    if (!confirm(msg)) return;
    setState((s) => ({
      clients: s.clients.filter((x) => x.id !== id),
      domains: s.domains.filter((d) => d.clientId !== id),
    }));
  }

  function viewClientDomains(id) {
    setDomainFilters({ ...NO_FILTERS, clientId: id });
    setView('domains');
  }

  // ---------- domains ----------
  function saveDomain(data) {
    const id = dialog.id;
    const duplicate = domains.some((d) => d.name === data.name && d.id !== id);
    if (duplicate && !confirm(`"${data.name}" is already in the list. Save anyway?`)) return;
    setState((s) => ({
      ...s,
      domains: id
        ? s.domains.map((d) => (d.id === id ? { ...d, ...data } : d))
        : [...s.domains, { id: newId(), ...data }],
    }));
    setDialog(null);
  }

  function renewDomain(id) {
    const d = domains.find((x) => x.id === id);
    const expiry = d && addYear(d.expiry);
    if (!expiry) return;
    if (!confirm(`Extend ${d.name} to ${fmtDate(expiry)}?`)) return;
    setState((s) => ({
      ...s,
      domains: s.domains.map((x) => (x.id === id ? { ...x, expiry } : x)),
    }));
  }

  function deleteDomain(id) {
    const d = domains.find((x) => x.id === id);
    if (!d || !confirm(`Delete domain "${d.name}"? This cannot be undone.`)) return;
    setState((s) => ({ ...s, domains: s.domains.filter((x) => x.id !== id) }));
  }

  const editDomain = (id) => setDialog({ type: 'domain', id });
  const addDomain = (presetClientId) => setDialog({ type: 'domain', id: null, presetClientId });

  // ---------- backup ----------
  function exportBackup() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `admin-dashboard-backup-${toISO(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function importBackup(file) {
    try {
      const data = JSON.parse(await file.text());
      if (!isValidData(data)) throw new Error('File is not a dashboard backup.');
      const msg = `Replace current data (${clients.length} clients, ${domains.length} domains) with the backup (${data.clients.length} clients, ${data.domains.length} domains)?`;
      if (!confirm(msg)) return;
      setState({ clients: data.clients, domains: data.domains });
    } catch (err) {
      alert('Import failed: ' + err.message);
    }
  }

  return (
    <div className="app">
      <Sidebar
        view={view}
        onNavigate={setView}
        clientCount={clients.length}
        domainCount={domains.length}
        onExport={exportBackup}
        onImport={importBackup}
      />

      <main>
        {view === 'overview' && (
          <Overview clients={clients} domains={domains} onRenew={renewDomain} onEdit={editDomain} />
        )}
        {view === 'clients' && (
          <Clients
            clients={clients}
            domains={domains}
            search={clientSearch}
            onSearch={setClientSearch}
            onAdd={() => setDialog({ type: 'client', id: null })}
            onEdit={(id) => setDialog({ type: 'client', id })}
            onDelete={deleteClient}
            onAddDomain={addDomain}
            onViewDomains={viewClientDomains}
          />
        )}
        {view === 'domains' && (
          <Domains
            clients={clients}
            domains={domains}
            filters={filters}
            onFilters={setDomainFilters}
            onAdd={() => addDomain(filters.clientId)}
            onRenew={renewDomain}
            onEdit={editDomain}
            onDelete={deleteDomain}
          />
        )}
      </main>

      {dialog?.type === 'client' && (
        <ClientDialog
          client={clients.find((c) => c.id === dialog.id)}
          onSave={saveClient}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog?.type === 'domain' && (
        <DomainDialog
          domain={domains.find((d) => d.id === dialog.id)}
          presetClientId={dialog.presetClientId}
          clients={clients}
          onSave={saveDomain}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  );
}
