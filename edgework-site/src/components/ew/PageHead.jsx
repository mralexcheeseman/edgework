import Scatter from '@/components/ew/Scatter';

// Top of an inner page: label, letterpress headline, one line of intro, one stain at the edge.
export default function PageHead({ label, title, intro, scrawl, seed = 7, children }) {
  return (
    <header className="relative overflow-hidden">
      <Scatter seed={seed} slots={[{ t: ['coffee', 'burn'], p: { width: 360, right: -150, top: -120 }, o: 0.5, j: 3 }]} />
      <div className="ew-above mx-auto max-w-[1320px] px-4 pb-14 pt-14 md:px-10 md:pb-20 md:pt-24">
        <p className="ew-label" style={{ color: 'var(--ink-3)' }}>
          {label}
        </p>
        <h1 className="ew-shout ew-lp mt-5 text-[64px] md:text-[136px]">{title}</h1>
        <div className="mt-6 flex flex-wrap items-end gap-6">
          {intro && (
            <p className="ew-ui max-w-[58ch] text-[17px]" style={{ color: 'var(--ink-2)' }}>
              {intro}
            </p>
          )}
          {scrawl && <span className="ew-scrawl text-lg">{scrawl}</span>}
        </div>
        {children}
      </div>
    </header>
  );
}
