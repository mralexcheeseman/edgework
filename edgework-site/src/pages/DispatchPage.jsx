import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Scatter from '@/components/ew/Scatter';
import Loading from '@/components/ew/Loading';
import { TypedText, TypeOn } from '@/components/ew/Typed';
import { FORMATS, getDispatch, longDate } from '@/lib/content';
import { hash } from '@/lib/marks';

export default function DispatchPage() {
  const { slug } = useParams();
  const { data: d, isLoading } = useQuery({ queryKey: ['dispatch', slug], queryFn: () => getDispatch(slug) });
  if (isLoading) return <div className="mx-auto max-w-[900px] px-4"><Loading /></div>;
  if (!d)
    return (
      <div className="mx-auto max-w-[900px] px-4 py-32">
        <p className="ew-shout ew-lp text-[64px]">Not on file.</p>
        <Link to="/dispatches" className="ew-btn mt-8">Back to the wire</Link>
      </div>
    );
  const seed = hash(slug.length * 17 + 3);
  const paras = String(d.body || '').split(/\n{2,}/).filter(Boolean);
  // "Title | URL | why" lines are links; "Look up: ..." lines are ideas to search for.
  const deeper = String(d.go_deeper || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [title, url, why] = l.split('|').map((s) => s?.trim());
      return url?.startsWith('http') ? { title, url, why } : { text: l.replace(/^look up:\s*/i, '') };
    });
  return (
    <article className="mx-auto max-w-[980px] px-4 pb-32 pt-14 md:px-10 md:pb-44 md:pt-24">
      <p className="ew-label" style={{ color: 'var(--ink-3)' }}>
        {FORMATS[d.format] || 'Dispatch'} · {longDate(d.published_on)}
      </p>
      <TypeOn as="h1" text={d.title} className="ew-shout mt-5 block text-[48px] md:text-[96px]" />
      {d.deck && (
        <p className="ew-type mt-6 max-w-[48ch] text-[19px] leading-[1.6]" style={{ color: 'var(--ink-2)' }}>
          {d.deck}
        </p>
      )}
      <div className="ew-sheet relative mt-14 overflow-hidden px-6 py-12 md:-rotate-[.6deg] md:px-16 md:py-16">
        <Scatter
          seed={seed}
          slots={[
            { t: ['tape'], p: { width: 170, top: -22, left: '42%' }, r: -2, j: 0.4 },
            { t: ['coffee'], p: { width: 300, right: -150, bottom: -150 }, o: 0.75 },
          ]}
        />
        {d.pull && (
          <p className="ew-above mb-10 text-[24px] leading-[1.45] md:text-[30px]">
            <TypedText text={d.pull} salt={seed} />
          </p>
        )}
        <div className="ew-above ew-type max-w-[var(--measure)] space-y-6 text-[17px] leading-[1.75] md:text-[19px]">
          {paras.map((p, i) => (
            <p key={i} style={{ whiteSpace: 'pre-line' }}>{p}</p>
          ))}
        </div>
        <p className="ew-above ew-label mt-12" style={{ color: 'var(--ink-3)' }}>— Alex Cheeseman</p>
      </div>
      {deeper.length > 0 && (
        <section className="mt-16 max-w-[var(--measure)]" aria-labelledby="go-deeper">
          <h2 id="go-deeper" className="ew-label">Go deeper</h2>
          <ul className="mt-4 space-y-5">
            {deeper.map((g, i) => (
              <li key={i} className="ew-type text-[17px] leading-[1.6]">
                {g.url ? (
                  <>
                    <a href={g.url} target="_blank" rel="noreferrer" className="underline decoration-[var(--red)] decoration-2 underline-offset-4">
                      {g.title}
                    </a>
                    {g.why && <span className="block" style={{ color: 'var(--ink-2)' }}>{g.why}</span>}
                  </>
                ) : (
                  <span style={{ color: 'var(--ink-2)' }}>Look up: {g.text}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
      <Link to="/dispatches" className="ew-btn mt-12">← Back to the wire</Link>
    </article>
  );
}
