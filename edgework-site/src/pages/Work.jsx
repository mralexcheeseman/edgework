import PageHead from '@/components/ew/PageHead';
import Scatter from '@/components/ew/Scatter';
import Loading from '@/components/ew/Loading';
import { useProjects } from '@/hooks/useContent';
import { tilt } from '@/lib/marks';

export default function Work() {
  const { data: projects = [], isLoading } = useProjects();
  return (
    <>
      <PageHead label="Case files" title="The Work" intro="Brands, tools and publications I've built, mostly at night. Each one is a working argument about how something should be done." seed={41} />
      <section className="mx-auto max-w-[1320px] px-4 pb-32 md:px-10 md:pb-44" aria-label="Projects">
        {isLoading ? (
          <Loading />
        ) : (
          <ol className="grid gap-x-8 gap-y-12 md:grid-cols-2">
            {projects.map((p, i) => {
              const seed = (p.order || i + 1) * 5 + 2;
              return (
                <li key={p.id} className="ew-sheet ew-tilt relative overflow-hidden p-7 md:p-10" style={{ '--r': `${tilt(seed, 1.2)}deg` }}>
                  {i % 2 === 0 && <Scatter seed={seed} slots={[{ t: ['coffee', 'smudge'], p: { width: 240, right: -120, top: -120 }, o: 0.6 }]} />}
                  <div className="ew-above">
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <span className="ew-label">Case {String(i + 1).padStart(2, '0')}</span>
                      {p.status_note && (
                        <span className="ew-label border-2 px-2 py-1" style={{ color: 'var(--red)', borderColor: 'var(--red)', transform: 'rotate(-2deg)' }}>
                          {p.status_note}
                        </span>
                      )}
                    </div>
                    <h2 className="ew-shout mt-5 text-[38px] md:text-[48px]">{p.name}</h2>
                    <p className="ew-type mt-2 text-[20px]" style={{ color: 'var(--red)' }}>{p.line}</p>
                    <p className="ew-type mt-5 text-[16px] leading-[1.7]" style={{ color: 'var(--ink-2)' }}>{p.description}</p>
                    {p.url && (
                      <a className="ew-btn mt-7" href={p.url} target="_blank" rel="noreferrer">
                        Visit <span aria-hidden="true">↗</span><span className="sr-only">(opens in a new tab)</span>
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </>
  );
}
