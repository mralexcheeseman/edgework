import { useRef } from 'react';
import { useInView } from 'framer-motion';
import Scatter from '@/components/ew/Scatter';
import Conviction from '@/components/ew/Conviction';
import { TypedText } from '@/components/ew/Typed';
import { tilt } from '@/lib/marks';
import { ARENAS } from '@/lib/content';

const TAPE = [
  { t: ['tape'], p: { width: 140, top: -26, right: -44 }, r: 34, j: 0.6 },
  { t: ['tape'], p: { width: 140, top: -26, left: -44 }, r: -34, j: 0.6 },
  { t: ['tape'], p: { width: 150, top: -34, left: '34%' }, r: -3, j: 0.6 },
];
const STAIN = [
  { t: ['coffee'], p: { width: 240, left: -150, bottom: -150 }, o: 0.8 },
  { t: ['coffee', 'smudge'], p: { width: 220, right: -130, bottom: -140 }, o: 0.7 },
  { t: ['smudge', 'coffee'], p: { width: 200, left: -120, bottom: -130 }, o: 0.55 },
];

// A Position typed on a ruled index card and taped to the desk.
export default function IndexCard({ position, onOpen, size = 'md', still = false, index = 0 }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, margin: '0px 0px -8% 0px' });
  const seed = position.number || 1;
  const r = tilt(seed, 2.5);
  const slots = [TAPE[seed % 3], ...(seed % 3 === 1 ? [] : [STAIN[seed % 3]])];
  const big = size === 'lg';
  return (
    <button
      ref={ref}
      type="button"
      onClick={onOpen}
      className={`ew-card ew-tilt group block w-full overflow-visible text-left ${still ? '' : seen ? 'ew-drop' : 'opacity-0'}`}
      style={{ '--r': `${r}deg`, '--r0': `${r - 6}deg`, '--d': `${(index % 6) * 0.06}s` }}
      aria-label={`Position ${position.number}. ${position.statement.replace(/\*/g, '')}`}
    >
      <span className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <Scatter seed={seed} slots={slots.filter((s) => s.t[0] !== 'tape')} />
      </span>
      <Scatter seed={seed} slots={slots.filter((s) => s.t[0] === 'tape')} />
      <span className={`ew-above flex h-full flex-col ${big ? 'min-h-[360px] p-8 md:p-12' : 'min-h-[300px] p-6 md:p-8'}`}>
        <span className="flex items-baseline justify-between gap-4" style={{ height: big ? 30 : 26 }}>
          <span className="ew-label">No. {String(position.number).padStart(2, '0')}</span>
          <span className="ew-label text-right" style={{ color: 'var(--ink-3)' }}>
            {ARENAS[position.arena]?.short}
          </span>
        </span>
        <span className={`mt-9 block ${big ? 'text-[24px] leading-[1.45] md:text-[32px] md:leading-[1.38]' : 'text-[19px] leading-[1.6] md:text-[21px]'}`}>
          <TypedText text={position.statement} salt={seed} />
        </span>
        <span className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-6">
          <Conviction value={position.conviction} />
          <span className="ew-label opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" style={{ color: 'var(--red)' }}>
            Open the file →
          </span>
        </span>
      </span>
    </button>
  );
}
