import { useMemo, useState } from 'react';
import FileCard from '@/components/ew/FileCard';
import PageHead from '@/components/ew/PageHead';
import ArenaFilter from '@/components/ew/ArenaFilter';
import Loading from '@/components/ew/Loading';
import { useEssays } from '@/hooks/useContent';

export default function Essays() {
  const { data: essays = [], isLoading } = useEssays();
  const [arena, setArena] = useState('all');
  const counts = useMemo(() => {
    const c = { all: essays.length };
    essays.forEach((e) => (c[e.arena] = (c[e.arena] || 0) + 1));
    return c;
  }, [essays]);
  const shown = arena === 'all' ? essays : essays.filter((e) => e.arena === arena);

  return (
    <>
      <PageHead
        label="The cabinet · The Last Animal"
        title="Filed essays"
        intro="Every essay lives at The Last Animal. This is the filing cabinet: newest on top, pull a file to read it there."
        seed={19}
      />
      <section className="mx-auto max-w-[1320px] px-4 pb-32 md:px-10 md:pb-44" aria-label="All essays">
        <ArenaFilter value={arena} onChange={setArena} counts={counts} />
        {isLoading ? (
          <Loading />
        ) : (
          <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
            {shown.map((e, i) => (
              <FileCard key={e.id} essay={e} index={i} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
