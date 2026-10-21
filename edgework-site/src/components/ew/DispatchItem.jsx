import { Link } from 'react-router-dom';
import { TypeOn } from '@/components/ew/Typed';
import { FORMATS, longDate } from '@/lib/content';

// One published dispatch in a list: the headline types itself on as it arrives.
export default function DispatchItem({ dispatch }) {
  return (
    <li className="border-t-2 border-[var(--ink)] py-8 md:py-10">
      <Link to={`/dispatches/${dispatch.slug}`} className="group grid gap-4 md:grid-cols-[180px_1fr_auto] md:items-baseline md:gap-10">
        <span className="ew-label" style={{ color: 'var(--ink-3)' }}>
          {FORMATS[dispatch.format] || 'Dispatch'} · {longDate(dispatch.published_on)}
        </span>
        <span>
          <TypeOn text={dispatch.title} as="span" className="ew-shout block text-[30px] transition-colors group-hover:text-[var(--red)] md:text-[40px]" />
          {dispatch.deck && (
            <span className="ew-type mt-3 block max-w-[60ch] text-[17px] leading-[1.6]" style={{ color: 'var(--ink-2)' }}>
              {dispatch.deck}
            </span>
          )}
        </span>
        <span className="ew-label" style={{ color: 'var(--red)' }}>
          Read →
        </span>
      </Link>
    </li>
  );
}
