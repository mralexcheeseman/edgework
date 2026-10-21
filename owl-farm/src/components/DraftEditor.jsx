import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { button, buttonRed, hint, h2, input, label, panel, textarea } from '@/lib/ui';

export default function DraftEditor({ draft, onSaved, notes }) {
  const [title, setTitle] = useState(draft.title || '');
  const [deck, setDeck] = useState(draft.deck || '');
  const [pull, setPull] = useState(draft.pull || '');
  const [body, setBody] = useState(draft.body || '');
  const [status, setStatus] = useState(draft.status || 'drafted');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(draft.title || '');
    setDeck(draft.deck || '');
    setPull(draft.pull || '');
    setBody(draft.body || '');
    setStatus(draft.status || 'drafted');
  }, [draft.id]);

  const save = async (nextStatus) => {
    setSaving(true);
    try {
      const updated = await base44.entities.Draft.update(draft.id, { title, deck, pull, body, status: nextStatus });
      setStatus(nextStatus);
      if (onSaved) onSaved(updated);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={`${panel} mt-8`}>
      <h2 className={h2}>The draft</h2>
      {notes?.warnings?.length > 0 && (
        <ul className="space-y-1 border-l-2 border-[#c4211a] pl-3 text-sm text-[#c4211a]">
          {notes.warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}
      {notes?.biggest_fix && <p className={hint}>Editor's note: {notes.biggest_fix}</p>}
      <p className={hint}>
        {draft.format}
        {draft.lenses?.length ? ` · lenses: ${draft.lenses.join(', ')}` : ''} · status: {status}
      </p>
      <div>
        <label className={label}>Title</label>
        <input className={input} value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label className={label}>Deck · one sentence</label>
        <input className={input} value={deck} onChange={(e) => setDeck(e.target.value)} />
      </div>
      <div>
        <label className={label}>Pull line · *asterisks* mark the highlight</label>
        <input className={input} value={pull} onChange={(e) => setPull(e.target.value)} />
        {notes?.alternatives?.length > 0 && (
          <div className="mt-3">
            <p className={hint}>Other lines the editor tried · tap one to use it</p>
            <ul className="mt-1 space-y-1">
              {notes.alternatives.map((alt) => (
                <li key={alt}>
                  <button
                    type="button"
                    className="ew-type w-full text-left text-[15px] leading-snug underline decoration-[#c4211a]/40 underline-offset-4 hover:decoration-[#c4211a]"
                    onClick={() => {
                      setPull(alt);
                      if (draft.format === 'hey_rube') setBody(alt.replace(/\*/g, ''));
                    }}
                  >
                    {alt.replace(/\*/g, '')}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div>
        <label className={label}>Body</label>
        <textarea className={`${textarea} h-96`} value={body} onChange={(e) => setBody(e.target.value)} />
      </div>
      <div className="flex flex-wrap gap-2">
        <button className={button} disabled={saving} onClick={() => save('edited')}>
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button className={button} disabled={saving} onClick={() => save('published')}>Mark published</button>
        <Link className={`${buttonRed} inline-flex items-center`} to={`/typewriter?draft=${draft.id}`} onClick={() => save('edited')}>
          To the Typewriter →
        </Link>
      </div>
    </section>
  );
}
