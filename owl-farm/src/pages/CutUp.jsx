import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { base44 } from '@/api/base44Client';
import { button, buttonRed, hint, h1, h2, input, label, page, panel, textarea } from '@/lib/ui';

// Burroughs and Gysin's cut-up: slice the material into strips, re-paste at random,
// keep the line that surprises you.
const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

// Cut each sentence into two or three strips at natural breaks.
const cutStrips = (text, source) =>
  String(text || '')
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 12)
    .flatMap((sentence) => {
      const words = sentence.split(/\s+/);
      if (words.length < 6) return [{ text: sentence, source }];
      const cuts = words.length > 12 ? [Math.ceil(words.length / 3), Math.ceil((2 * words.length) / 3)] : [Math.ceil(words.length / 2)];
      const parts = [];
      let start = 0;
      [...cuts, words.length].forEach((end) => {
        parts.push({ text: words.slice(start, end).join(' '), source });
        start = end;
      });
      return parts;
    });

const LINES = 5;
const PER_LINE = 3;

export default function CutUp() {
  const [pool, setPool] = useState([]);
  const [lines, setLines] = useState([]);
  const [pinned, setPinned] = useState([]);
  const [sparkBody, setSparkBody] = useState('');
  const [sparkTag, setSparkTag] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const boardRef = useRef(null);

  const deal = (from) => {
    const picked = shuffle(from).slice(0, LINES * PER_LINE);
    const next = [];
    for (let i = 0; i < LINES; i += 1) {
      const strips = picked.slice(i * PER_LINE, (i + 1) * PER_LINE);
      if (strips.length) next.push(strips.map((s) => ({ ...s, rot: (Math.random() - 0.5) * 3.2, lift: (Math.random() - 0.5) * 6 })));
    }
    setLines(next);
  };

  const load = async () => {
    setLoading(true);
    try {
      const [sourceResult, sparkResult, positionResult] = await Promise.all([
        base44.entities.SourceItem.list({ sort: '-created_date', limit: 40 }),
        base44.entities.Spark.list({ sort: '-created_date', limit: 100 }),
        base44.entities.Position.list({ sort: 'number', limit: 100 }),
      ]);
      const collected = [];
      sparkResult.items.forEach((s) => collected.push(...cutStrips(s.body, 'Spark')));
      positionResult.items.forEach((p) => collected.push(...cutStrips(p.statement, `Position #${p.number}`)));
      sourceResult.items.forEach((s) => collected.push(...cutStrips(s.quote || s.core_claim, s.thinker || s.title)));
      setPool(collected);
      deal(collected);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Strips drop onto the board like paper scraps each time the lever is pulled.
  useLayoutEffect(() => {
    if (!boardRef.current) return;
    const strips = boardRef.current.querySelectorAll('.ew-strip');
    gsap.fromTo(
      strips,
      { y: -40, opacity: 0, rotation: () => (Math.random() - 0.5) * 30 },
      { y: 0, opacity: 1, rotation: (i, el) => Number(el.dataset.rot || 0), duration: 0.45, ease: 'back.out(1.6)', stagger: 0.035 }
    );
  }, [lines]);

  const lineText = (line) => line.map((s) => s.text).join(' ');

  const pin = async (line) => {
    const text = lineText(line);
    await base44.entities.Spark.create({
      body: text,
      origin: 'cut-up',
      source: [...new Set(line.map((s) => s.source))].join(' + '),
      tag: '',
    });
    setPinned((prev) => [...prev, text]);
  };

  const saveSpark = async () => {
    if (!sparkBody.trim()) return;
    setSaving(true);
    try {
      await base44.entities.Spark.create({ body: sparkBody.trim(), tag: sparkTag.trim(), origin: 'own', source: '' });
      setSparkBody('');
      setSparkTag('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={page}>
      <h1 className={h1}>Cut-up</h1>
      <p className={`${hint} mt-2`}>{pool.length} strips cut from your Sparks, Positions and the wire. Pull the lever until a line surprises you. The machine supplies the accident; you supply the argument.</p>

      <div className="mt-5 flex flex-wrap gap-2">
        <button className={buttonRed} disabled={!pool.length} onClick={() => deal(pool)}>✂ Cut it up</button>
        <button className={button} onClick={load}>Reload the pile</button>
      </div>

      {loading ? (
        <p className={`${hint} mt-4`}>Loading…</p>
      ) : lines.length === 0 ? (
        <p className="ew-type mt-4 text-lg">Nothing to cut yet.</p>
      ) : (
        <div ref={boardRef} className="mt-5 space-y-6 bg-[#2a2116] p-5 sm:p-8">
          {lines.map((line, li) => {
            const text = lineText(line);
            const done = pinned.includes(text);
            return (
              <div key={li} className="flex flex-wrap items-center gap-2">
                {line.map((strip, si) => (
                  <span
                    key={si}
                    data-rot={strip.rot}
                    className="ew-strip ew-type text-lg sm:text-xl"
                    style={{ transform: `rotate(${strip.rot}deg) translateY(${strip.lift}px)` }}
                  >
                    {strip.text}
                  </span>
                ))}
                <button
                  className="ew-btn ew-btn-light ml-auto"
                  disabled={done}
                  onClick={() => pin(line)}
                >
                  {done ? 'Pinned' : 'Keep'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <section className={`${panel} mt-8`}>
        <h2 className={h2}>Write a spark</h2>
        <div>
          <label className={label}>Body</label>
          <textarea className={textarea} rows={3} value={sparkBody} onChange={(e) => setSparkBody(e.target.value)} />
        </div>
        <div>
          <label className={label}>Tag</label>
          <input className={input} value={sparkTag} onChange={(e) => setSparkTag(e.target.value)} />
        </div>
        <button className={button} disabled={saving || !sparkBody.trim()} onClick={saveSpark}>
          {saving ? 'Saving…' : 'Save spark'}
        </button>
      </section>
    </div>
  );
}
