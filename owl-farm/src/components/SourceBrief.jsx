import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { button, hint, label, textarea } from '@/lib/ui';

// The piece behind a collision: synopsis, a link to the original, suggested lines to
// keep and Alex's own pasted highlights. Used on The Wire and on The Desk.
export default function SourceBrief({ source, onUpdated }) {
  const [highlights, setHighlights] = useState(source?.highlights || []);
  const [pasted, setPasted] = useState('');
  const [reading, setReading] = useState(false);
  const [readError, setReadError] = useState('');

  useEffect(() => {
    setHighlights(source?.highlights || []);
  }, [source?.id, source?.highlights]);

  if (!source) return null;

  const saveHighlights = async (next) => {
    setHighlights(next);
    await base44.entities.SourceItem.update(source.id, { highlights: next });
    onUpdated?.({ ...source, highlights: next });
  };

  const toggleLine = (line) => saveHighlights(highlights.includes(line) ? highlights.filter((h) => h !== line) : [...highlights, line]);

  const addPasted = () => {
    const extra = pasted.split(/\n+/).map((l) => l.trim().replace(/^["“]|["”]$/g, '')).filter(Boolean).filter((l) => !highlights.includes(l));
    if (!extra.length) return;
    saveHighlights([...highlights, ...extra]);
    setPasted('');
  };

  const reread = async () => {
    setReading(true);
    setReadError('');
    try {
      const res = await base44.functions.invoke('readSource', { source_item_id: source.id });
      if (res?.data?.source) onUpdated?.(res.data.source);
      if (res?.data?.full === false) setReadError('Could not open the full article (paywall or blocked), so this is from the feed excerpt.');
    } catch (err) {
      setReadError(err?.response?.data?.error || err.message);
    } finally {
      setReading(false);
    }
  };

  const lines = source.lines || [];
  const yours = highlights.filter((h) => !lines.includes(h));

  return (
    <div className="space-y-3">
      <div>
        <p className="ew-label">The piece</p>
        <p className="ew-type text-lg font-bold leading-snug">{source.title}</p>
        <p className={hint}>
          {[source.thinker, source.published_at].filter(Boolean).join(' · ')}
          {source.read_full === false && ' · read from the feed excerpt only'}
        </p>
      </div>
      {source.summary && <p className="ew-type leading-relaxed">{source.summary}</p>}
      {source.core_claim && (
        <p className="ew-type leading-relaxed">
          <span className="ew-label mr-2">Core claim</span>
          {source.core_claim}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {source.url && (
          <a className={`${button} inline-flex items-center`} href={source.url} target="_blank" rel="noreferrer">Read the original ↗</a>
        )}
        <button className={button} disabled={reading} onClick={reread}>
          {reading ? 'Reading…' : lines.length ? 'Re-read the piece' : 'Read it properly'}
        </button>
      </div>
      {readError && <p className={hint}>{readError}</p>}

      {lines.length > 0 && (
        <div>
          <p className={label}>Lines worth stealing · tap to keep</p>
          <div className="space-y-2">
            {lines.map((line) => {
              const on = highlights.includes(line);
              return (
                <button key={line} onClick={() => toggleLine(line)} className={`ew-type block w-full text-left leading-relaxed ${on ? 'ew-hl' : 'opacity-70 hover:opacity-100'}`}>
                  {on ? '✓ ' : '+ '}“{line}”
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <p className={label}>Your highlights · paste lines from the article, one per line</p>
        {yours.map((h) => (
          <p key={h} className="ew-type mb-1 leading-relaxed">
            <span className="ew-hl">“{h}”</span>
            <button className="ml-2 text-xs underline" onClick={() => toggleLine(h)}>remove</button>
          </p>
        ))}
        <textarea className={textarea} rows={2} value={pasted} onChange={(e) => setPasted(e.target.value)} placeholder="Paste a phrase you'd underline…" />
        <button className={`${button} mt-2`} disabled={!pasted.trim()} onClick={addPasted}>Add highlight</button>
      </div>
    </div>
  );
}
