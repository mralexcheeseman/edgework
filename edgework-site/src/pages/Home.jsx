import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import IndexCard from '@/components/ew/IndexCard';
import Dossier from '@/components/ew/Dossier';
import FileCard from '@/components/ew/FileCard';
import HeyRube from '@/components/ew/HeyRube';
import DispatchItem from '@/components/ew/DispatchItem';
import SectionHead from '@/components/ew/SectionHead';
import Scatter from '@/components/ew/Scatter';
import Loading from '@/components/ew/Loading';
import { TypedText } from '@/components/ew/Typed';
import { useDispatches, useEssays, usePositions, useProjects } from '@/hooks/useContent';
import { plain } from '@/lib/marks';

function Hero({ pile, total, essayCount }) {
  const top = pile[0];
  return (
    <section className="relative overflow-hidden">
      <Scatter
        seed={4}
        slots={[
          { t: ['coffee'], p: { width: 420, left: -170, top: 260 }, o: 0.55, j: 4 },
          { t: ['burn'], p: { width: 300, right: -120, bottom: -80 }, o: 0.45 },
        ]}
      />
      <div className="relative mx-auto grid max-w-[1320px] gap-14 px-4 pb-24 pt-14 md:grid-cols-[1.1fr_1fr] md:px-10 md:pb-36 md:pt-24">
        <div className="ew-above">
          <p className="ew-label" style={{ color: 'var(--ink-3)' }}>
            Edgework · Alex Cheeseman · Filed 04:12
          </p>
          <h1 className="ew-shout ew-lp mt-6 text-[76px] md:text-[150px]">
            Filed
            <br />
            at 4am.
          </h1>
          <p className="mt-8 max-w-[30ch] text-[22px] leading-[1.45] md:text-[28px]">
            <TypedText text={`${total || 'Thirty'} things I think about marketing, AI and judgement. *The essays that argue them.* And whatever got filed last night.`} salt={3} />
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link to="/positions" className="ew-btn ew-btn-red">
              Read the wall <span aria-hidden="true">→</span>
            </Link>
            <Link to="/essays" className="ew-btn">
              {essayCount ? `${essayCount} essays` : 'The essays'}
            </Link>
            <span className="ew-scrawl ml-2 text-lg">argue with me.</span>
          </div>
        </div>
        <div className="relative self-center pt-6 md:pt-0" aria-label="Pinned position">
          {top && (
            <div className="relative mx-auto max-w-[560px]">
              {pile.slice(1, 3).map((p, i) => (
                <div
                  key={p.id}
                  aria-hidden="true"
                  className="ew-card ew-drop absolute"
                  style={{ '--r': i ? '-5deg' : '4deg', '--r0': i ? '-14deg' : '12deg', '--d': `${0.1 + i * 0.15}s`, transform: `rotate(${i ? -5 : 4}deg)`, position: 'absolute', top: i ? 8 : 26, left: i ? -18 : 20, right: i ? 18 : -20, bottom: i ? 112 : 100 }}
                >
                  <span className="ew-above flex justify-between p-6 md:p-8" style={{ height: 26 }}>
                    <span className="ew-label">No. {String(p.number).padStart(2, '0')}</span>
                  </span>
                </div>
              ))}
              <div className="ew-drop relative" style={{ '--r0': '-12deg', '--r': '0deg', '--d': '0.45s' }}>
                <Link to="/positions" className="ew-card ew-tilt block overflow-visible" style={{ '--r': '-1.5deg' }} aria-label={`Position ${top.number}: ${plain(top.statement)}`}>
                  <Scatter seed={top.number} slots={[{ t: ['tape'], p: { width: 130, top: -30, left: -52 }, r: -38, j: 0.4 }]} />
                  <span className="absolute inset-0 overflow-hidden" aria-hidden="true">
                    <Scatter seed={top.number} slots={[{ t: ['coffee'], p: { width: 260, right: -150, bottom: -150 }, o: 0.75 }]} />
                  </span>
                  <span className="ew-above flex flex-col p-6 pb-9 md:p-10 md:pb-12">
                    <span className="flex justify-between" style={{ height: 26 }}>
                      <span className="ew-label">No. {String(top.number).padStart(2, '0')}</span>
                      <span className="ew-label" style={{ color: 'var(--ink-3)' }}>Conviction: all in</span>
                    </span>
                    <span className="mt-9 block text-[21px] leading-[1.55] md:text-[28px] md:leading-[1.5]">
                      <TypedText text={top.statement} salt={top.number} />
                    </span>
                  </span>
                </Link>
              </div>
              <div className="mt-8 flex items-center justify-end gap-3 pr-2">
                <img src="/marks/pen-arrow.webp" alt="" aria-hidden="true" className="w-[70px] -scale-x-100 rotate-[200deg]" />
                <span className="ew-scrawl text-base md:text-lg">the one I&apos;d bet the house on.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { data: positions = [], isLoading: lp } = usePositions();
  const { data: essays = [], isLoading: le } = useEssays();
  const { data: dispatches = [], isLoading: ld } = useDispatches();
  const { data: projects = [] } = useProjects();
  const [open, setOpen] = useState(null);

  const pile = useMemo(() => {
    const five = positions.filter((p) => p.conviction === 5);
    const lead = five.find((p) => p.number === 3) || five[0];
    return lead ? [lead, ...five.filter((p) => p !== lead)].slice(0, 3) : [];
  }, [positions]);
  const wall = useMemo(() => {
    const strong = positions.filter((p) => p.conviction >= 4 && !pile.includes(p));
    return strong.slice(0, 6);
  }, [positions, pile]);
  const rube = positions.find((p) => p.number === 11) || positions[0];
  const bySlug = useMemo(() => Object.fromEntries(essays.map((e) => [e.slug, e])), [essays]);
  const featured = useMemo(() => {
    const f = essays.filter((e) => e.featured);
    return (f.length >= 6 ? f : essays).slice(0, 6);
  }, [essays]);

  return (
    <>
      <Hero pile={pile} total={positions.length} essayCount={essays.length} />

      <section aria-labelledby="h-positions" className="mx-auto max-w-[1320px] px-4 pb-28 md:px-10 md:pb-40">
        <SectionHead
          id="h-positions"
          label="The wall · positions on the record"
          title="The Positions"
          intro="Each one is the thesis of an essay, typed on a card and taped up where I can't avoid it. Open a card for the argument behind it."
          to="/positions"
          toLabel={positions.length ? `All ${positions.length}` : 'All positions'}
          scrawl="pick a fight."
        />
        {lp ? (
          <Loading />
        ) : (
          <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
            {wall.map((p, i) => (
              <IndexCard key={p.id} position={p} index={i} onOpen={() => setOpen(p)} />
            ))}
          </div>
        )}
      </section>

      {rube && <HeyRube line={rube.statement} salt={rube.number} cite={`Position ${rube.number} · ${rube.source_essay || ''}`} />}

      <section aria-labelledby="h-essays" className="mx-auto max-w-[1320px] px-4 py-28 md:px-10 md:py-40">
        <SectionHead
          id="h-essays"
          label="The cabinet · The Last Animal"
          title="Filed essays"
          intro="The long arguments, kept at The Last Animal. Pull a file to read it there."
          to="/essays"
          toLabel={essays.length ? `All ${essays.length} files` : 'The cabinet'}
        />
        {le ? (
          <Loading />
        ) : (
          <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((e, i) => (
              <FileCard key={e.id} essay={e} index={i} />
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="h-dispatches" className="relative mx-auto max-w-[1320px] px-4 pb-28 md:px-10 md:pb-40">
        <SectionHead id="h-dispatches" label="The wire · short and recent" title="Dispatches" to={dispatches.length ? '/dispatches' : undefined} toLabel="All dispatches" />
        {ld ? (
          <Loading />
        ) : dispatches.length ? (
          <ul>
            {dispatches.slice(0, 4).map((d) => (
              <DispatchItem key={d.id} dispatch={d} />
            ))}
          </ul>
        ) : (
          <div className="ew-sheet relative max-w-[720px] -rotate-1 overflow-hidden p-8 md:p-12">
            <Scatter seed={21} slots={[{ t: ['tape'], p: { width: 140, top: -18, left: 40 }, r: -4, j: 0.4 }, { t: ['coffee'], p: { width: 220, right: -110, bottom: -120 }, o: 0.7 }]} />
            <p className="ew-label ew-above">Wire status</p>
            <p className="ew-above mt-5 text-[22px] leading-[1.5] md:text-[26px]">
              <TypedText text="Nothing filed yet. The first dispatch goes up the morning *I've got something worth saying.*" salt={21} />
            </p>
          </div>
        )}
      </section>

      {projects.length > 0 && (
        <section aria-labelledby="h-work" className="mx-auto max-w-[1320px] px-4 pb-28 md:px-10 md:pb-40">
          <SectionHead id="h-work" label="Case files · things I've built" title="The Work" intro="Brands, tools and publications, mostly built at night." to="/work" toLabel="All case files" />
          <ul className="grid gap-8 md:grid-cols-3">
            {projects.slice(0, 3).map((p, i) => (
              <li key={p.id} className="ew-sheet ew-tilt p-7" style={{ '--r': `${[-1.2, 0.8, -0.5][i]}deg` }}>
                <p className="ew-label" style={{ color: 'var(--ink-3)' }}>Case {String(i + 1).padStart(2, '0')}</p>
                <p className="ew-shout mt-4 text-[32px]">{p.name}</p>
                <p className="ew-type mt-2 text-[17px]" style={{ color: 'var(--red)' }}>{p.line}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Dossier position={open} essay={open && bySlug[open.essay_slug]} onClose={() => setOpen(null)} />
    </>
  );
}
