import { useRef } from 'react';

export default function Sidebar({ view, onNavigate, clientCount, domainCount, onExport, onImport }) {
  const fileRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files[0];
    e.target.value = '';
    if (file) onImport(file);
  }

  const navBtn = (name, label, count) => (
    <button className={`nav-btn${view === name ? ' active' : ''}`} onClick={() => onNavigate(name)}>
      {label}
      {count !== undefined && <span className="count">{count}</span>}
    </button>
  );

  return (
    <aside className="sidebar">
      <div className="brand">Admin Dashboard</div>
      {navBtn('overview', 'Overview')}
      {navBtn('clients', 'Clients', clientCount)}
      {navBtn('domains', 'Domains', domainCount)}
      <div className="sidebar-foot">
        <button className="btn small" onClick={onExport}>Export backup</button>
        <button className="btn small" onClick={() => fileRef.current.click()}>Import backup</button>
        <input type="file" ref={fileRef} accept="application/json,.json" hidden onChange={handleFile} />
        <small>Data is saved in this browser only. Export a backup regularly.</small>
      </div>
    </aside>
  );
}
