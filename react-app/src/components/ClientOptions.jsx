export default function ClientOptions({ clients, emptyLabel }) {
  const sorted = [...clients].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <>
      <option value="">{emptyLabel}</option>
      {sorted.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}{c.company ? ' — ' + c.company : ''}
        </option>
      ))}
    </>
  );
}
