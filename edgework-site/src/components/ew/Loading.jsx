export default function Loading({ label = 'Pulling the files' }) {
  return (
    <p className="ew-label py-16" style={{ color: 'var(--ink-3)' }} role="status">
      {label}
      <span className="ew-cursor" />
    </p>
  );
}
