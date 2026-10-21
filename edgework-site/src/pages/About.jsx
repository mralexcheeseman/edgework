import { Link } from 'react-router-dom';
import Scatter from '@/components/ew/Scatter';
import { TypedText } from '@/components/ew/Typed';

export default function About() {
  return (
    <article className="mx-auto max-w-[1100px] px-4 pb-32 pt-14 md:px-10 md:pb-44 md:pt-24">
      <p className="ew-label" style={{ color: 'var(--ink-3)' }}>About · the writer</p>
      <h1 className="ew-shout ew-lp mt-5 text-[64px] md:text-[136px]">Who files this</h1>
      <div className="ew-sheet ew-ruled relative mt-14 overflow-hidden px-6 py-12 md:rotate-[.5deg] md:px-16 md:py-16">
        <Scatter
          seed={51}
          slots={[
            { t: ['tape'], p: { width: 160, top: -20, left: -30 }, r: -30, j: 0.4 },
            { t: ['tape'], p: { width: 160, top: -20, right: -30 }, r: 30, j: 0.4 },
            { t: ['coffee'], p: { width: 280, right: -140, bottom: -140 }, o: 0.7 },
          ]}
        />
        <div className="ew-above max-w-[var(--measure)] text-[18px] leading-[1.75] md:text-[20px]">
          <p className="text-[24px] leading-[1.5] md:text-[30px]">
            <TypedText text="I'm Alex Cheeseman, a strategist and advisor in London. I write about *what the machine is doing to judgement.*" salt={51} />
          </p>
          <p className="ew-type mt-8">
            I've spent my career where marketing meets technology, working with founders and operators to cut through orthodoxy and make better decisions under uncertainty. The long arguments live at The Last Animal. This is where I keep the positions those arguments add up to, and the shorter things I file in between.
          </p>
          <p className="ew-type mt-6">
            Three arenas, mostly: why marketing orthodoxy is breaking, how AI is rewiring knowledge work, and how to keep your own judgement when everyone around you agrees.
          </p>
          <p className="ew-type mt-6">
            Every piece here starts from my own reaction to something I read. A private newsroom collects the reading each morning; I keep what hits a nerve and throw the rest away. The machine supplies the accident. I supply the argument.
          </p>
          <span className="ew-scrawl mt-10 block text-xl">no edits. no refunds.</span>
        </div>
      </div>
      <div className="mt-12 flex flex-wrap gap-4">
        <Link to="/positions" className="ew-btn ew-btn-red">Read the wall <span aria-hidden="true">→</span></Link>
        <a href="https://thelastanimal.base44.app/contact" target="_blank" rel="noreferrer" className="ew-btn">
          Get in touch <span aria-hidden="true">↗</span><span className="sr-only">(opens The Last Animal in a new tab)</span>
        </a>
      </div>
    </article>
  );
}
