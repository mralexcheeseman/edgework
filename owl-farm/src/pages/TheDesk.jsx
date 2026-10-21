import { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import DraftEditor from '@/components/DraftEditor';
import SourceBrief from '@/components/SourceBrief';
import { button, buttonRed, hint, h1, h2, label, page, panel, textarea } from '@/lib/ui';

const FORMATS = [
  { key: 'hey_rube', name: 'Hey Rube', what: 'One line people will argue with. A single sentence, 25 words at most.' },
  { key: 'dispatch', name: 'Dispatch', what: 'A short filed column, 250 to 400 words. One argument, ends on the line worth repeating.' },
  { key: 'routine', name: 'Routine', what: 'A 60 to 90 second talk script for camera. Hook first, one idea, short spoken lines.' },
  { key: 'expense_report', name: 'Expense report', what: 'The argument as a list: four to six wry line items and a total.' },
  { key: 'essay', name: 'Essay', what: 'The long one, 800 to 1,200 words: claim, evidence, the best objection, what to do.' },
];

const RELATION = { supports: 'supports', challenges: 'challenges', extends: 'extends' };

const PROMPTS = [
  'Do you agree, or is it wrong? Why?',
  'What has everyone in your industry got wrong about this?',
  'Where have you seen this happen yourself?',
];

function Step({ n, title, children }) {
  return (
    <section className={`${panel} mt-6`}>
      <p className="ew-label">
        <span className="mr-2 text-[#c4211a]">{n}</span>
        {title}
      </p>
      {children}
    </section>
  );
}

export default function TheDesk() {
  const [sparks, setSparks] = useState([]);
  const [collisions, setCollisions] = useState([]);
  const [sources, setSources] = useState([]);
  const [positions, setPositions] = useState([]);
  const [thinkers, setThinkers] = useState([]);
  const [pickType, setPickType] = useState('collision');
  const [pickId, setPickId] = useState('');
  const [reaction, setReaction] = useState('');
  const [format, setFormat] = useState('hey_rube');
  const [lensIds, setLensIds] = useState([]);
  const [showAllLenses, setShowAllLenses] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState(null);
  const [notes, setNotes] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const [sparkResult, collisionResult, positionResult, thinkerResult] = await Promise.all([
      base44.entities.Spark.list({ sort: '-created_date', limit: 100 }),
      base44.entities.Collision.filter({ status: { $in: ['kept', 'new'] } }, { sort: '-updated_date', limit: 50 }),
      base44.entities.Position.list({ sort: 'number', limit: 100 }),
      base44.entities.Thinker.filter({ active: true }, { sort: 'name', limit: 200 }),
    ]);
    const kept = collisionResult.items.sort((a, b) => (a.status === 'kept' ? -1 : 1) - (b.status === 'kept' ? -1 : 1));
    setSparks(sparkResult.items);
    setCollisions(kept);
    setPositions(positionResult.items);
    setThinkers(thinkerResult.items);

    const ids = [...new Set(kept.map((c) => c.source_item).filter(Boolean))];
    if (ids.length) {
      const res = await base44.entities.SourceItem.filter({ id: { $in: ids } }, { limit: 100 });
      setSources(res.items);
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('collision')) choose('collision', params.get('collision'), kept);
    else if (params.get('spark')) choose('spark', params.get('spark'));
  };

  const positionOf = (id) => positions.find((p) => p.id === id);
  const sourceOf = (id) => sources.find((s) => s.id === id);
  const collision = pickType === 'collision' ? collisions.find((c) => c.id === pickId) : null;
  const spark = pickType === 'spark' ? sparks.find((s) => s.id === pickId) : null;
  const source = collision ? sourceOf(collision.source_item) : null;
  const position = collision ? positionOf(collision.position) : null;

  // The piece's own writer is the natural first lens; suggest a contrast from another camp.
  const suggestedLenses = useMemo(() => {
    const own = source ? thinkers.find((t) => t.name === source.thinker) : null;
    const contrasts = thinkers
      .filter((t) => t.tier <= 2 && t.id !== own?.id && t.cluster !== own?.cluster && (t.tags || []).some((tag) => ['contrarian', 'behaviourist', 'empiricist'].includes(tag)))
      .slice(0, 6);
    return { own, contrasts };
  }, [source, thinkers]);

  function choose(type, id, list = collisions) {
    setPickType(type);
    setPickId(id);
    setDraft(null);
    setError('');
    setLensIds([]);
    setReaction(type === 'collision' ? list.find((x) => x.id === id)?.reaction || '' : '');
  }

  useEffect(() => {
    // Default the first lens to the piece's own writer whenever a collision is picked.
    if (collision && suggestedLenses.own && lensIds.length === 0) setLensIds([suggestedLenses.own.id]);
  }, [collision?.id, suggestedLenses.own?.id]);

  const toggleLens = (id) => {
    setLensIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return prev.length >= 3 ? prev : [...prev, id];
    });
  };

  const briefingText = () => {
    if (spark) return `SPARK (Alex's own note${spark.source ? `, after ${spark.source}` : ''}): ${spark.body}`;
    if (!collision) return '';
    const parts = [];
    if (position) parts.push(`ALEX'S POSITION #${position.number}: ${position.statement}`);
    parts.push(`HOW THE PIECE COLLIDES WITH IT: it ${RELATION[collision.relation] || collision.relation} the position. ${collision.why}`);
    if (source) {
      parts.push(`THE PIECE: "${source.title}" by ${source.thinker || 'unknown'}${source.url ? ` (${source.url})` : ''}`);
      if (source.summary) parts.push(`SYNOPSIS: ${source.summary}`);
      if (source.core_claim) parts.push(`CORE CLAIM: ${source.core_claim}`);
      if (source.highlights?.length) parts.push(`LINES ALEX HIGHLIGHTED FROM THE PIECE:\n${source.highlights.map((h) => `- "${h}"`).join('\n')}`);
      else if (source.quote) parts.push(`A LINE FROM THE PIECE: "${source.quote}"`);
      if (source.lines?.length) parts.push(`OTHER LINES FROM THE PIECE (exact quotes):\n${source.lines.map((h) => `- "${h}"`).join('\n')}`);
    }
    return parts.join('\n\n');
  };

  const generate = async () => {
    setError('');
    if (!pickId || !reaction.trim()) {
      setError('Pick something to write about and say what you think first.');
      return;
    }
    setBusy(true);
    try {
      if (collision && reaction !== (collision.reaction || '')) {
        await base44.entities.Collision.update(collision.id, { reaction, status: 'kept' });
      }
      const res = await base44.functions.invoke('generateDraft', {
        origin_type: pickType,
        origin_text: briefingText(),
        reaction,
        format,
        lens_ids: lensIds,
      });
      const data = res?.data || {};
      if (data.error) {
        setError(data.error);
        return;
      }
      const payload = {
        format,
        title: data.title || '',
        deck: data.deck || '',
        pull: data.pull || '',
        body: data.body || '',
        reaction,
        lenses: thinkers.filter((t) => lensIds.includes(t.id)).map((t) => t.name),
        status: 'drafted',
      };
      if (spark) payload.spark = spark.id;
      if (collision) payload.collision = collision.id;
      setNotes({ alternatives: data.alternatives || [], warnings: data.warnings || [], biggest_fix: data.biggest_fix || '' });
      setDraft(await base44.entities.Draft.create(payload));
      setTimeout(() => document.getElementById('the-draft')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Drafting failed.');
    } finally {
      setBusy(false);
    }
  };

  const lensName = (id) => thinkers.find((t) => t.id === id)?.name || '';

  return (
    <div className={page}>
      <h1 className={h1}>The Desk</h1>
      <p className={`${hint} mt-2`}>Four steps: pick the material, read the briefing, say what you think, choose the shape. The draft is built on your reaction, not the other way round.</p>

      <Step n="1" title="What are you writing about?">
        <div className="flex gap-2">
          <button className={pickType === 'collision' ? buttonRed : button} onClick={() => { setPickType('collision'); setPickId(''); }}>From the Wire ({collisions.length})</button>
          <button className={pickType === 'spark' ? buttonRed : button} onClick={() => { setPickType('spark'); setPickId(''); }}>Your Sparks ({sparks.length})</button>
        </div>
        <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
          {pickType === 'collision' && collisions.length === 0 && <p className="ew-type">Nothing kept from the Wire yet.</p>}
          {pickType === 'collision' && collisions.map((c) => {
            const p = positionOf(c.position);
            const s = sourceOf(c.source_item);
            const on = c.id === pickId;
            return (
              <button key={c.id} onClick={() => choose('collision', c.id)} className={`block w-full border-2 p-3 text-left ${on ? 'border-[#c4211a] bg-white/60' : 'border-[#121110]/25 hover:border-[#121110]'}`}>
                <span className="ew-label">{s?.thinker || 'Piece'} {RELATION[c.relation]} #{p?.number}{c.status === 'kept' ? ' · kept' : ''}</span>
                <span className="ew-type mt-1 block font-bold leading-snug">{s?.title || 'Untitled piece'}</span>
                {p && <span className="ew-type block text-sm opacity-80">“{p.statement}”</span>}
              </button>
            );
          })}
          {pickType === 'spark' && sparks.map((s) => {
            const on = s.id === pickId;
            return (
              <button key={s.id} onClick={() => choose('spark', s.id)} className={`block w-full border-2 p-3 text-left ${on ? 'border-[#c4211a] bg-white/60' : 'border-[#121110]/25 hover:border-[#121110]'}`}>
                <span className="ew-type block leading-snug">{s.body.length > 180 ? `${s.body.slice(0, 180)}…` : s.body}</span>
                <span className={hint}>{s.origin}{s.source ? ` · ${s.source}` : ''}</span>
              </button>
            );
          })}
        </div>
      </Step>

      {(collision || spark) && (
        <Step n="2" title="The briefing">
          {spark && (
            <>
              <p className="ew-type text-xl leading-relaxed">{spark.body}</p>
              {spark.source && <p className={hint}>{spark.source}</p>}
            </>
          )}
          {collision && (
            <>
              {position && (
                <div>
                  <p className={label}>Your position #{position.number}</p>
                  <p className="ew-type text-lg leading-snug">“{position.statement}”</p>
                </div>
              )}
              <div>
                <p className={label}>Why it {RELATION[collision.relation]} it</p>
                <p className="ew-type leading-relaxed text-[#c4211a]">{collision.why}</p>
              </div>
              {source && (
                <div className="border-t-2 border-[#121110] pt-3">
                  <SourceBrief source={source} onUpdated={(s) => s && setSources((prev) => prev.map((x) => (x.id === s.id ? s : x)))} />
                </div>
              )}
            </>
          )}
        </Step>
      )}

      {(collision || spark) && (
        <Step n="3" title="What do you think?">
          <p className={hint}>A sentence or two in your own words. If you're stuck, answer one of these:</p>
          <ul className="ew-type list-inside list-disc text-sm opacity-80">
            {PROMPTS.map((p) => <li key={p}>{p}</li>)}
          </ul>
          <textarea className={textarea} rows={4} value={reaction} onChange={(e) => setReaction(e.target.value)} placeholder="Say it the way you'd say it across a table." />
        </Step>
      )}

      {(collision || spark) && (
        <Step n="4" title="What shape should it take?">
          <div className="grid gap-2 sm:grid-cols-2">
            {FORMATS.map((f) => (
              <button key={f.key} onClick={() => setFormat(f.key)} className={`border-2 p-3 text-left ${format === f.key ? 'border-[#c4211a] bg-white/60' : 'border-[#121110]/25 hover:border-[#121110]'}`}>
                <span className={`ew-label block ${format === f.key ? 'text-[#c4211a]' : ''}`}>{f.name}</span>
                <span className="ew-type mt-1 block text-sm leading-snug">{f.what}</span>
              </button>
            ))}
          </div>

          <div className="border-t-2 border-[#121110] pt-3">
            <p className="ew-label">Lenses · optional</p>
            <p className="ew-type mt-1 text-sm leading-relaxed">
              A lens is a way of seeing, borrowed from a thinker you rate. It shapes the angle of the draft (for example, Rory Sutherland pushes it toward the irrational, Byron Sharp toward the evidence). It never quotes or imitates them. The first lens gives the argument its shape; a second from a different camp adds tension. Leave it empty and the draft is pure you.
            </p>
            {lensIds.length > 0 && (
              <p className="ew-type mt-2">
                Using: {lensIds.map((id, i) => (
                  <button key={id} className="ew-hl mr-2" onClick={() => toggleLens(id)}>{i === 0 ? 'shape' : 'contrast'}: {lensName(id)} ✕</button>
                ))}
              </p>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestedLenses.own && !lensIds.includes(suggestedLenses.own.id) && (
                <button className={button} onClick={() => toggleLens(suggestedLenses.own.id)}>+ {suggestedLenses.own.name} (wrote the piece)</button>
              )}
              {suggestedLenses.contrasts.filter((t) => !lensIds.includes(t.id)).slice(0, 4).map((t) => (
                <button key={t.id} className={button} disabled={lensIds.length >= 3} onClick={() => toggleLens(t.id)}>+ {t.name}</button>
              ))}
              <button className={button} onClick={() => setShowAllLenses((v) => !v)}>{showAllLenses ? 'Hide the list' : 'Choose another…'}</button>
            </div>
            {showAllLenses && (
              <div className="mt-2 max-h-56 overflow-y-auto border-2 border-[#121110]/40">
                {thinkers.map((t) => (
                  <label key={t.id} className="ew-type flex items-start gap-2 border-b border-[#121110]/15 p-2">
                    <input type="checkbox" className="mt-1" checked={lensIds.includes(t.id)} disabled={!lensIds.includes(t.id) && lensIds.length >= 3} onChange={() => toggleLens(t.id)} />
                    <span>
                      {t.name} <span className={hint}>{t.cluster}</span>
                      {t.core_position && <span className="block text-sm opacity-75">{t.core_position}</span>}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {error && <p className="ew-type text-[#c4211a]">{error}</p>}
          <button className={buttonRed} disabled={busy || !reaction.trim()} onClick={generate}>
            {busy ? 'Drafting, then editing… (about a minute)' : reaction.trim() ? 'Write the draft' : 'Say what you think first (step 3)'}
          </button>
        </Step>
      )}

      {draft && (
        <div id="the-draft">
          <DraftEditor key={draft.id} draft={draft} notes={notes} />
        </div>
      )}

      {!collision && !spark && (
        <section className="mt-8">
          <h2 className={h2}>How the Desk works</h2>
          <p className="ew-type mt-2 leading-relaxed">Pick a collision you kept on the Wire, or one of your Sparks. You will see everything behind it: your position, why the piece hits it, the synopsis, a link to the original and the lines you highlighted. Then you say what you think, choose a shape, and the Desk drafts it from your words.</p>
        </section>
      )}
    </div>
  );
}
