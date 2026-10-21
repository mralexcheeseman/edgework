// Conviction as a red-pen tally: four strokes, and the fifth strikes through them.
export default function Conviction({ value = 3, night = false }) {
  const n = Math.max(1, Math.min(5, Number(value) || 3));
  return (
    <span className="inline-flex items-center gap-3" aria-label={`Conviction ${n} out of 5`}>
      <span className="ew-label" style={{ color: night ? 'var(--on-night-2)' : 'var(--ink-3)' }} aria-hidden="true">
        Conviction
      </span>
      <span aria-hidden="true" className="relative inline-block" style={{ fontFamily: 'var(--font-scrawl)', color: night ? 'var(--red-night)' : 'var(--red)', fontSize: 20, letterSpacing: '.08em', lineHeight: 1, transform: 'rotate(-3deg)' }}>
        {'I'.repeat(Math.min(n, 4))}
        {n === 5 && (
          <span className="absolute left-[-6px] right-[-6px] top-1/2 block h-[3px] -translate-y-1/2 -rotate-[24deg] rounded-full" style={{ background: 'currentColor' }} />
        )}
      </span>
    </span>
  );
}
