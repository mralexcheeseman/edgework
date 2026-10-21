import { ARENAS } from '@/lib/content';

export default function ArenaFilter({ value, onChange, counts }) {
  const items = [['all', 'Everything'], ...Object.entries(ARENAS).map(([k, v]) => [k, v.label])];
  return (
    <div className="mb-12 flex flex-wrap gap-3" role="group" aria-label="Filter by arena">
      {items.map(([k, label]) => (
        <button key={k} type="button" className="ew-chip" aria-pressed={value === k} onClick={() => onChange(k)}>
          {label}
          {counts && <span className="ml-2 opacity-60">{counts[k] ?? 0}</span>}
        </button>
      ))}
    </div>
  );
}
