import { TypedText } from '@/components/ew/Typed';

// The full-bleed night band: letterpress "HEY RUBE." over one provocation.
export default function HeyRube({ line, salt = 9, cite }) {
  return (
    <section className="ew-night relative overflow-hidden" aria-label="Hey Rube">
      <img src="/marks/splat-1.webp" alt="" aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-20 w-[320px] opacity-80 md:w-[460px]" />
      <img src="/marks/splat-4.webp" alt="" aria-hidden="true" className="pointer-events-none absolute -right-16 -top-10 hidden w-[260px] opacity-60 md:block" />
      <div className="relative mx-auto max-w-[1320px] px-4 py-24 md:px-10 md:py-36">
        <img src="/marks/heyrube-letterpress.webp" alt="Hey Rube." className="w-[280px] -rotate-2 md:w-[520px]" />
        <p className="mt-10 max-w-[24ch] text-[26px] leading-[1.4] md:text-[44px] md:leading-[1.32]" style={{ color: 'var(--on-night)' }}>
          <TypedText text={line} salt={salt} />
        </p>
        {cite && (
          <p className="ew-label mt-8" style={{ color: 'var(--on-night-2)' }}>
            {cite}
          </p>
        )}
      </div>
    </section>
  );
}
