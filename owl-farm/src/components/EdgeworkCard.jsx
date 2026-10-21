import { forwardRef, useEffect, useState } from 'react';
import { pickMarks, SCRAWLS, typedWords, hash } from '@/lib/marks';

// The five Edgework templates, drawn at export size (1080 wide). The Typewriter shows
// them scaled down and exports this exact node.

const RED = '#c4211a';
const INK = '#121110';

const firstSentence = (text) => (String(text || '').match(/[^.!?]+[.!?]/) || [String(text || '')])[0].trim();
const clip = (text, n) => (text.length > n ? `${text.slice(0, n).replace(/\s+\S*$/, '')}…` : text);
const fit = (text, steps) => steps.find(([max]) => text.length <= max)?.[1] ?? steps[steps.length - 1][1];

function Typed({ text, salt, style }) {
  return (
    <div className="ew-type" style={style}>
      {typedWords(text, salt).map((w, i) => (
        <span key={i} className={w.hot ? 'ew-hl' : ''} style={{ ...w.style, marginRight: w.hot ? 0 : '0.3em', paddingRight: w.hot ? '0.3em' : 0 }}>
          {w.word}
        </span>
      ))}
    </div>
  );
}

function Header({ left, right, size = 22 }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Courier Prime', monospace", fontSize: size, fontWeight: 700, letterSpacing: '0.14em', borderBottom: `3px solid ${INK}`, paddingBottom: 16 }}>
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}

function Marks({ seed, slots }) {
  return pickMarks(seed, slots).map((m) => <img key={m.key} src={m.src} alt="" crossOrigin="anonymous" style={m.style} />);
}

const filedAt = (draft) => {
  const d = new Date(draft.updated_date || draft.created_date || Date.now());
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};
const number = (draft) => {
  const id = String(draft.id || 'draft');
  let sum = 0;
  for (let i = 0; i < id.length; i += 1) sum += id.charCodeAt(i) * (i + 1);
  return String((hash(sum) % 900) + 100);
};

function Sheet({ width = 1080, height = 1350, children, paper = '/marks/paper-45.jpg', pad = '92px 96px', gap = 40 }) {
  return (
    <div
      style={{
        width, height, position: 'relative', overflow: 'hidden', boxSizing: 'border-box', padding: pad,
        display: 'flex', flexDirection: 'column', gap, color: INK, fontFamily: "'Courier Prime', monospace",
        background: `#f1ebdd url(${paper}) center / cover no-repeat`,
      }}
    >
      {children}
    </div>
  );
}

function Dispatch({ draft, mix }) {
  const title = draft.title || 'Untitled dispatch';
  const excerpt = draft.pull || clip(String(draft.body || '').split(/\n+/)[0] || '', 260);
  return (
    <Sheet>
      <Header left={`EDGEWORK · DISPATCH Nº ${number(draft)}`} right={`FILED ${filedAt(draft)}`} />
      <div className="ew-shout ew-lp" style={{ fontSize: fit(title, [[36, 112], [60, 96], [999, 78]]), color: RED, transform: 'rotate(-1.2deg)', marginTop: 12 }}>{title}</div>
      <Typed text={excerpt} salt={15} style={{ fontSize: fit(excerpt, [[140, 44], [220, 40], [999, 34]]), lineHeight: 1.5 }} />
      <div style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: 14, transform: 'rotate(-4deg)', marginTop: -8 }}>
        <img src="/marks/pen-arrow.webp" alt="" style={{ width: 70, height: 'auto', transform: 'scaleX(-1) rotate(-60deg)', mixBlendMode: 'multiply' }} />
        <span className="ew-scrawl" style={{ fontSize: 30 }}>{SCRAWLS[mix % SCRAWLS.length]}</span>
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', fontSize: 24 }}>
        <span>— Alex Cheeseman</span>
        <span style={{ fontWeight: 700, letterSpacing: '0.08em' }}>READ THE FULL DISPATCH ↗</span>
      </div>
      <Marks seed={mix} slots={[
        { t: ['coffee'], p: { left: -160, bottom: -190, width: 560 }, j: 8 },
        { t: ['splat', 'burn'], p: { right: -170, top: -150, width: 500 }, j: 6 },
        { t: ['smudge'], p: { right: 40, bottom: 70, width: 230 }, r: -30, j: 4, o: 0.55 },
        { t: ['tape'], p: { left: -80, top: 26, width: 340 }, r: -34, b: 'normal' },
      ]} />
    </Sheet>
  );
}

function HeyRube({ draft, mix }) {
  const line = draft.pull || firstSentence(draft.body) || draft.title || '';
  return (
    <Sheet>
      <Header left={`EDGEWORK · HEY RUBE Nº ${number(draft)}`} right="NO EDITS" />
      <img src="/marks/heyrube-letterpress.webp" alt="Hey Rube." style={{ width: 780, height: 'auto', transform: 'rotate(-2.5deg)', margin: '18px 0 0 -14px', mixBlendMode: 'multiply' }} />
      <Typed text={line} salt={7} style={{ fontSize: fit(line, [[80, 66], [130, 58], [999, 48]]), lineHeight: 1.32 }} />
      <div className="ew-scrawl" style={{ alignSelf: 'flex-end', fontSize: 34, transform: 'rotate(-6deg)' }}>discuss. or don&apos;t.</div>
      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', fontSize: 24 }}>
        <span>— Alex Cheeseman</span>
        <span style={{ fontWeight: 700, letterSpacing: '0.08em' }}>EDGEWORK</span>
      </div>
      <Marks seed={mix} slots={[
        { t: ['coffee'], p: { right: -180, top: 330, width: 520 }, j: 8 },
        { t: ['burn'], p: { left: -60, bottom: 120, width: 260 }, j: 6, o: 0.95 },
        { t: ['splat'], p: { right: -120, bottom: -140, width: 460 }, j: 6 },
        { t: ['tape'], p: { right: -60, top: 20, width: 320 }, r: 30, b: 'normal' },
      ]} />
    </Sheet>
  );
}

function ExpenseReport({ draft, mix }) {
  const lines = String(draft.body || '').split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const parse = (l) => {
    const parts = l.replace(/^[-•*\d.)\s]+/, '').split(/\s+[—–-]\s+|\s*\|\s*/);
    return parts.length > 1 ? [parts[0], parts.slice(1).join(' — ')] : [parts[0], ''];
  };
  const totalLine = lines.find((l) => /^total\b/i.test(l));
  const rows = lines.filter((l) => l !== totalLine).slice(0, 6).map(parse);
  const total = totalLine ? parse(totalLine)[1] || totalLine.replace(/^total\W*/i, '') : 'more than you think';
  const sub = draft.deck || 'Claimed against: the five-year plan.';
  return (
    <Sheet gap={34}>
      <Header left={`EDGEWORK · EXPENSE REPORT Nº ${number(draft)}`} right={`SUBMITTED ${filedAt(draft)}`} />
      <div className="ew-shout ew-lp" style={{ fontSize: 132, color: RED, marginTop: 8 }}>Expense report</div>
      <Typed text={sub} salt={3} style={{ fontSize: 32, lineHeight: 1.4 }} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {rows.map(([item, cost], i) => (
          <div key={i} className="ew-type" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 24, borderBottom: '2px dashed rgba(18,17,16,0.45)', padding: '12px 0', fontSize: rows.length > 5 ? 30 : 34, lineHeight: 1.25 }}>
            <span>{item}</span>
            <span style={{ whiteSpace: 'nowrap' }}>{cost}</span>
          </div>
        ))}
        <div className="ew-type" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '20px 0 0', fontSize: 40, fontWeight: 700 }}>
          <span>TOTAL</span>
          <span className="ew-hl" style={{ padding: '0 10px' }}>{total}</span>
        </div>
      </div>
      <div className="ew-shout ew-lp" style={{ position: 'absolute', right: 96, bottom: 120, fontSize: 58, color: RED, border: `7px solid ${RED}`, padding: '8px 22px', transform: 'rotate(-13deg)' }}>Not approved</div>
      <div style={{ marginTop: 'auto', fontSize: 24 }}>Claimant: Alex Cheeseman</div>
      <Marks seed={mix} slots={[
        { t: ['coffee'], p: { left: -140, top: 420, width: 480 }, j: 8, o: 0.9 },
        { t: ['smudge'], p: { right: 120, top: 640, width: 220 }, r: 20, j: 5, o: 0.5 },
        { t: ['tape'], p: { right: -70, top: 24, width: 330 }, r: 32, b: 'normal' },
        { t: ['burn', 'splat'], p: { left: -90, bottom: -110, width: 380 }, j: 6 },
      ]} />
    </Sheet>
  );
}

function EssayCover({ draft, mix }) {
  const words = String(draft.title || 'Untitled essay').trim().split(/\s+/);
  const last = words.pop();
  const head = words.join(' ');
  const deck = draft.deck || firstSentence(draft.body);
  const minutes = Math.max(3, Math.round(String(draft.body || '').split(/\s+/).length / 230));
  const size = fit(draft.title || '', [[18, 214], [32, 170], [50, 134], [999, 104]]);
  return (
    <Sheet>
      <Header left="AN EDGEWORK DISPATCH" right={`${minutes} MIN READ`} />
      <div className="ew-shout ew-lp" style={{ fontSize: size, marginTop: 30, transform: 'rotate(-1deg)' }}>
        {head && <span style={{ color: INK }}>{head} </span>}
        <span style={{ color: RED }}>{last}</span>
      </div>
      <Typed text={deck} salt={21} style={{ fontSize: fit(deck, [[90, 46], [150, 40], [999, 34]]), lineHeight: 1.38, maxWidth: 820 }} />
      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: 24 }}>
        <span style={{ fontWeight: 700, letterSpacing: '0.14em' }}>ALEX CHEESEMAN</span>
        <span>Filed under: {draft.format === 'essay' ? 'essays' : draft.format}</span>
      </div>
      <Marks seed={mix} slots={[
        { t: ['burn'], p: { right: 40, top: 150, width: 240 }, j: 8 },
        { t: ['coffee'], p: { right: -200, bottom: -160, width: 620 }, j: 8 },
        { t: ['tape'], p: { left: -70, top: 24, width: 330 }, r: -32, b: 'normal' },
        { t: ['splat', 'smudge'], p: { left: -140, bottom: 200, width: 380 }, j: 6, o: 0.85 },
      ]} />
    </Sheet>
  );
}

function Routine({ draft, mix, animate }) {
  const lines = String(draft.body || '').split(/\n+/).map((l) => l.trim()).filter(Boolean).slice(0, 4);
  const full = lines.join('|');
  const [n, setN] = useState(animate ? 0 : full.length);

  useEffect(() => {
    if (!animate) {
      setN(full.length);
      return undefined;
    }
    setN(0);
    let i = 0;
    let t;
    const step = () => {
      i += 1;
      setN(i);
      if (i >= full.length) return;
      const ch = full[i - 1];
      t = setTimeout(step, ch === '|' ? 650 : '.,'.includes(ch) ? 420 : ch === ' ' ? 75 : 46);
    };
    t = setTimeout(step, 600);
    return () => clearTimeout(t);
  }, [animate, full]);

  let left = n;
  const shown = lines.map((l) => {
    const s = l.slice(0, Math.max(0, left));
    left -= l.length + 1;
    return s;
  });
  const done = n >= full.length;
  return (
    <Sheet height={1920} paper="/marks/paper-916.jpg" pad="140px 100px 160px" gap={48}>
      <Header left={`EDGEWORK · ROUTINE Nº ${number(draft)}`} right="60 SEC" size={26} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 44 }}>
        {shown.map((s, i) => (
          <div key={i} style={{ minHeight: '1.3em' }}>
            {s && <Typed text={s} salt={40 + i * 9} style={{ display: 'inline', fontSize: fit(full, [[160, 74], [260, 62], [999, 52]]), lineHeight: 1.3 }} />}
            {!done && left < 0 && s.length < lines[i].length && s.length > 0 && <span className="ew-cursor" />}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', opacity: done ? 1 : 0, transition: 'opacity 400ms' }}>
        <div className="ew-shout ew-lp" style={{ fontSize: 150, color: RED, transform: 'rotate(-2deg)' }}>Edgework</div>
        <span className="ew-scrawl" style={{ fontSize: 34, transform: 'rotate(-6deg)' }}>follow, or don&apos;t.</span>
      </div>
      <Marks seed={mix} slots={[
        { t: ['coffee'], p: { right: -200, top: 260, width: 600 }, j: 8 },
        { t: ['tape'], p: { left: -80, top: 40, width: 360 }, r: -30, b: 'normal' },
        { t: ['smudge', 'splat'], p: { left: -120, bottom: 300, width: 420 }, j: 6, o: 0.8 },
      ]} />
    </Sheet>
  );
}

const RENDER = { dispatch: Dispatch, hey_rube: HeyRube, expense_report: ExpenseReport, essay: EssayCover, routine: Routine };

const EdgeworkCard = forwardRef(function EdgeworkCard({ draft, templateKey, mix = 1, animate = false }, ref) {
  const Render = RENDER[templateKey] || Dispatch;
  return (
    <div ref={ref} style={{ display: 'inline-block' }}>
      <Render draft={draft} mix={Number(mix) || 1} animate={animate} />
    </div>
  );
});

export default EdgeworkCard;
