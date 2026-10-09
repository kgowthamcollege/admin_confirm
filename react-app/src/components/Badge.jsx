export default function Badge({ status }) {
  return <span className={`badge ${status.key}`}>{status.label}</span>;
}
