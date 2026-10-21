import { Link } from 'react-router-dom';

// Section title: a filing label over a letterpress Anton headline, with an optional way through.
export default function SectionHead({ id, label, title, intro, to, toLabel, scrawl }) {
  return (
    <header className="mb-10 grid gap-6 md:mb-16 md:grid-cols-[1fr_auto] md:items-end">
      <div>
        <p className="ew-label" style={{ color: 'var(--ink-3)' }}>
          {label}
        </p>
        <h2 id={id} className="ew-shout ew-lp mt-3 text-[44px] md:text-[72px]">
          {title}
        </h2>
        {intro && (
          <p className="ew-ui mt-5 max-w-[56ch]" style={{ color: 'var(--ink-2)' }}>
            {intro}
          </p>
        )}
      </div>
      <div className="flex flex-col items-start gap-4 md:items-end">
        {scrawl && <span className="ew-scrawl hidden text-lg md:inline-block">{scrawl}</span>}
        {to && (
          <Link to={to} className="ew-btn">
            {toLabel} <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </header>
  );
}
