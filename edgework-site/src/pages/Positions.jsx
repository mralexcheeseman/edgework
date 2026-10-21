import { useMemo, useState } from 'react';
import IndexCard from '@/components/ew/IndexCard';
import Dossier from '@/components/ew/Dossier';
import PageHead from '@/components/ew/PageHead';
import ArenaFilter from '@/components/ew/ArenaFilter';
import Loading from '@/components/ew/Loading';
import { useEssays, usePositions } from '@/hooks/useContent';

export default function Positions() {
  const { data: positions = [], isLoading } = usePositions();
  const { data: essays = [] } = useEssays();
  const [arena, setArena] = useState('all');
  const [open, setOpen] = useState(null);
  const bySlug = useMemo(() => Object.fromEntries(essays.map((e) => [e.slug, e])), [essays]);
  const counts = useMemo(() => {
    const c = { all: positions.length };
    positions.forEach((p) => (c[p.arena] = (c[p.arena] || 0) + 1));
    return c;
  }, [positions]);
  const shown = arena === 'all' ? positions : positions.filter((p) => p.arena === arena);

  return (
    <>
      <PageHead
        label="The wall"
        title="The Positions"
        intro="Things I believe and will defend in public. Each is the thesis of one of my essays. The red tally is how hard I'd bet on it."
        scrawl="all of it, on the record."
        seed={11}
      />
      <section className="mx-auto max-w-[1320px] px-4 pb-32 md:px-10 md:pb-44" aria-label="All positions">
        <ArenaFilter value={arena} onChange={setArena} counts={counts} />
        {isLoading ? (
          <Loading />
        ) : (
          <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
            {shown.map((p, i) => (
              <IndexCard key={p.id} position={p} index={i} onOpen={() => setOpen(p)} />
            ))}
          </div>
        )}
      </section>
      <Dossier position={open} essay={open && bySlug[open.essay_slug]} onClose={() => setOpen(null)} />
    </>
  );
}
