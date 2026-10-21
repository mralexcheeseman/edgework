import DispatchItem from '@/components/ew/DispatchItem';
import PageHead from '@/components/ew/PageHead';
import Loading from '@/components/ew/Loading';
import Scatter from '@/components/ew/Scatter';
import { TypedText } from '@/components/ew/Typed';
import { useDispatches } from '@/hooks/useContent';

export default function Dispatches() {
  const { data: dispatches = [], isLoading } = useDispatches();
  return (
    <>
      <PageHead label="The wire" title="Dispatches" intro="Short pieces filed from the newsroom: a line, a routine, an expense report, the odd argument that couldn't wait for an essay." seed={31} />
      <section className="mx-auto max-w-[1100px] px-4 pb-32 md:px-10 md:pb-44" aria-label="All dispatches">
        {isLoading ? (
          <Loading />
        ) : dispatches.length ? (
          <ul>
            {dispatches.map((d) => (
              <DispatchItem key={d.id} dispatch={d} />
            ))}
          </ul>
        ) : (
          <div className="ew-sheet relative max-w-[720px] -rotate-1 overflow-hidden p-8 md:p-12">
            <Scatter seed={21} slots={[{ t: ['tape'], p: { width: 140, top: -18, left: 40 }, r: -4, j: 0.4 }]} />
            <p className="ew-label ew-above">Wire status</p>
            <p className="ew-above mt-5 text-[22px] leading-[1.5] md:text-[26px]">
              <TypedText text="Nothing filed yet. The first dispatch goes up the morning *I've got something worth saying.*" salt={21} />
            </p>
          </div>
        )}
      </section>
    </>
  );
}
