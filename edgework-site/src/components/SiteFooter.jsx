import { Link } from 'react-router-dom';

export default function SiteFooter() {
  return (
    <footer className="ew-night relative overflow-hidden">
      <img src="/marks/splat-3.webp" alt="" aria-hidden="true" className="pointer-events-none absolute -right-24 -top-16 w-[340px] opacity-70" />
      <div className="relative mx-auto grid max-w-[1320px] gap-10 px-4 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:px-10 md:py-24">
        <div>
          <p className="ew-shout ew-lp text-[56px] md:text-[88px]" style={{ color: 'var(--on-night)' }}>
            Edgework
          </p>
          <p className="ew-ui mt-4 max-w-[38ch]" style={{ color: 'var(--on-night-2)' }}>
            Positions, essays and dispatches by Alex Cheeseman. Filed late, argued in daylight.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-col gap-3">
          <p className="ew-label" style={{ color: 'var(--on-night-2)' }}>The desk</p>
          {[
            ['/positions', 'Positions'],
            ['/essays', 'Essays'],
            ['/dispatches', 'Dispatches'],
            ['/work', 'Work'],
            ['/about', 'About'],
          ].map(([to, label]) => (
            <Link key={to} to={to} className="ew-ui w-fit" style={{ color: 'var(--on-night)' }}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-3">
          <p className="ew-label" style={{ color: 'var(--on-night-2)' }}>Elsewhere</p>
          <a className="ew-ui ew-link w-fit" href="https://thelastanimal.base44.app" target="_blank" rel="noreferrer">
            The Last Animal ↗
          </a>
          <span className="ew-scrawl mt-6 text-base">no edits. no refunds.</span>
        </div>
      </div>
    </footer>
  );
}
