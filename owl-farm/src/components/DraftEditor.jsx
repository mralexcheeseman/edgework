import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { button, buttonRed, hint, h2, input, label, panel, textarea } from '@/lib/ui';

export default function DraftEditor({ draft, onSaved }) {
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
