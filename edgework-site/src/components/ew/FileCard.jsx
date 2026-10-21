import Scatter from '@/components/ew/Scatter';
import { tilt } from '@/lib/marks';
import { ARENAS, fileNo, longDate } from '@/lib/content';

const TAB = ['left-6', 'left-1/2 -translate-x-1/2', 'right-6'];

// An essay from The Last Animal, filed as a manuscript sliding out of a manila folder.
export default function FileCard({ essay, index = 0 }) {
  const seed = (essay.file_no || index + 1) * 3 + 1;
  const r = tilt(seed, 1.4);
  return (
    <a
      href={essay.url}
      target="_blank"
      rel="noreferrer"
      className="group relative block self-start pt-7"
      style={{ transform: `rotate(${r}deg)` }}
    >
      <span className="sr-only">(opens The Last Animal in a new tab)</span>
      {/* folder */}
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 top-7" style={{ background: '#d8c49a', boxShadow: 'var(--shadow-sheet)' }} />
      <span
        aria-hidden="true"
        className={`ew-label absolute top-0 ${TAB[seed % 3]} px-4 pb-2 pt-[7px]`}
        style={{ background: '#d8c49a', color: '#4a3a1c' }}
      >
        File {fileNo(essay.file_no)}
      </span>
      {/* manuscript */}
      <span className="ew-sheet relative mx-3 -mt-1 mb-3 block overflow-hidden px-6 pb-7 pt-6 group-hover:-translate-y-6 group-focus-visible:-translate-y-6 md:px-8" style={{ transition: 'transform 520ms var(--ease)' }}>
        {index % 3 === 1 && <Scatter seed={seed} slots={[{ t: ['coffee', 'smudge'], p: { width: 200, right: -110, bottom: -120 }, o: 0.7 }]} />}
        <span className="ew-above block">
          <span className="ew-label block" style={{ color: 'var(--ink-3)' }}>
            {ARENAS[essay.arena]?.label}
          </span>
          <span className="ew-shout mt-3 block text-[26px] md:text-[30px]">{essay.title}</span>
          {essay.deck && (
            <span className="ew-type mt-3 line-clamp-3 block text-[15px] leading-[1.6]" style={{ color: 'var(--ink-2)' }}>
              {essay.deck}
            </span>
          )}
          <span className="ew-label mt-5 flex flex-wrap justify-between gap-2" style={{ color: 'var(--ink-3)' }}>
            <span>{[longDate(essay.published_on), essay.read_time && `${essay.read_time} min`].filter(Boolean).join(' · ')}</span>
            <span style={{ color: 'var(--red)' }}>Read ↗</span>
          </span>
        </span>
      </span>
    </a>
  );
}
