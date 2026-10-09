import ClientOptions from './ClientOptions.jsx';
import Modal from './Modal.jsx';

export default function DomainDialog({ domain, presetClientId, clients, onSave, onClose }) {
  function handleSubmit(e) {
    e.preventDefault();
    const f = e.target.elements;
    const data = {
      name: f.name.value.trim().toLowerCase(),
      clientId: f.clientId.value,
      registrar: f.registrar.value.trim(),
      registered: f.registered.value,
      expiry: f.expiry.value,
      cost: f.cost.value,
      autoRenew: f.autoRenew.checked,
      notes: f.notes.value.trim(),
    };
    if (!data.name || !data.expiry) return;
    if (data.registered && data.registered > data.expiry) {
      alert('Expiry date must be after the registration date.');
      return;
    }
    onSave(data);
  }

  const selectedClient = (domain ? domain.clientId : presetClientId) || '';

  return (
    <Modal onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <h2>{domain ? 'Edit domain' : 'Add domain'}</h2>
        <div className="fields">
          <label className="field full"><span>Domain name *</span><input name="name" required maxLength={253} placeholder="example.com" defaultValue={domain?.name || ''} /></label>
          <label className="field">
            <span>Client</span>
            <select name="clientId" defaultValue={clients.some((c) => c.id === selectedClient) ? selectedClient : ''}>
              <ClientOptions clients={clients} emptyLabel="— No client —" />
            </select>
          </label>
          <label className="field"><span>Registrar</span><input name="registrar" maxLength={120} placeholder="GoDaddy, Namecheap…" defaultValue={domain?.registrar || ''} /></label>
          <label className="field"><span>Registration date</span><input name="registered" type="date" defaultValue={domain?.registered || ''} /></label>
          <label className="field"><span>Expiry date *</span><input name="expiry" type="date" required defaultValue={domain?.expiry || ''} /></label>
          <label className="field"><span>Renewal cost</span><input name="cost" type="number" min="0" step="0.01" defaultValue={domain?.cost ?? ''} /></label>
          <label className="field check"><input name="autoRenew" type="checkbox" defaultChecked={!!domain?.autoRenew} /><span>Auto-renew enabled</span></label>
          <label className="field full"><span>Notes</span><textarea name="notes" rows={3} defaultValue={domain?.notes || ''} /></label>
        </div>
        <div className="dialog-actions">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn primary">Save</button>
        </div>
      </form>
    </Modal>
  );
}
