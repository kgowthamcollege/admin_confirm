import Modal from './Modal.jsx';

export default function ClientDialog({ client, onSave, onClose }) {
  function handleSubmit(e) {
    e.preventDefault();
    const f = e.target.elements;
    const data = {
      name: f.name.value.trim(),
      company: f.company.value.trim(),
      email: f.email.value.trim(),
      phone: f.phone.value.trim(),
      address: f.address.value.trim(),
      notes: f.notes.value.trim(),
    };
    if (!data.name) return;
    onSave(data);
  }

  return (
    <Modal onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <h2>{client ? 'Edit client' : 'Add client'}</h2>
        <div className="fields">
          <label className="field"><span>Name *</span><input name="name" required maxLength={120} defaultValue={client?.name || ''} /></label>
          <label className="field"><span>Company</span><input name="company" maxLength={120} defaultValue={client?.company || ''} /></label>
          <label className="field"><span>Email</span><input name="email" type="email" maxLength={160} defaultValue={client?.email || ''} /></label>
          <label className="field"><span>Phone</span><input name="phone" type="tel" maxLength={40} defaultValue={client?.phone || ''} /></label>
          <label className="field full"><span>Address</span><input name="address" maxLength={240} defaultValue={client?.address || ''} /></label>
          <label className="field full"><span>Notes</span><textarea name="notes" rows={3} defaultValue={client?.notes || ''} /></label>
        </div>
        <div className="dialog-actions">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn primary">Save</button>
        </div>
      </form>
    </Modal>
  );
}
