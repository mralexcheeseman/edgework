import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { button, hint, input, label, panel, textarea } from '@/lib/ui';

const EMPTY = {
  title: '',
  url: '',
  thinker: '',
  published_at: '',
  summary: '',
  core_claim: '',
  quote: '',
};

export default function SourceIntake({ thinkers, sources, busySourceId, onSaved, onFind }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await base44.entities.SourceItem.create({ ...form, title: form.title.trim() });
      setForm(EMPTY);
      await onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={`${panel} mt-4`}>
      <h2 className="text-sm font-semibold">Log a source item</h2>
      <p className={hint}>The wire fills from these. Paste a piece, then ask for collisions.</p>

      <div>
        <label className={label}>Title</label>
        <input className={input} value={form.title} onChange={(e) => set('title', e.target.value)} />
      </div>
      <div>
        <label className={label}>URL</label>
        <input className={input} value={form.url} onChange={(e) => set('url', e.target.value)} />
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="min-w-[180px] flex-1">
          <label className={label}>Thinker</label>
          <input
            className={input}
            list="wire-thinkers"
            value={form.thinker}
            onChange={(e) => set('thinker', e.target.value)}
          />
          <datalist id="wire-thinkers">
            {thinkers.map((t) => (
              <option key={t.id} value={t.name} />
            ))}
          </datalist>
        </div>
        <div className="min-w-[180px] flex-1">
          <label className={label}>Published</label>
          <input
            type="date"
            className={input}
            value={form.published_at}
            onChange={(e) => set('published_at', e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className={label}>Quote</label>
        <textarea className={textarea} rows={2} value={form.quote} onChange={(e) => set('quote', e.target.value)} />
      </div>
      <div>
        <label className={label}>Core claim</label>
        <input className={input} value={form.core_claim} onChange={(e) => set('core_claim', e.target.value)} />
      </div>
      <div>
        <label className={label}>Summary</label>
        <textarea className={textarea} rows={2} value={form.summary} onChange={(e) => set('summary', e.target.value)} />
      </div>

      <button className={button} disabled={saving || !form.title.trim()} onClick={save}>
        {saving ? 'Saving…' : 'Save source item'}
      </button>

      <div>
        <p className={hint}>Recent source items</p>
        <div className="mt-2 border divide-y">
          {sources.length === 0 && <p className={`${hint} p-2`}>Nothing logged yet.</p>}
          {sources.map((source) => (
            <div key={source.id} className="flex items-start justify-between gap-3 p-2">
              <div>
                <p className="text-sm">{source.title}</p>
                <p className={hint}>{source.thinker || 'unknown thinker'}</p>
              </div>
              <button
                className={button}
                disabled={busySourceId === source.id}
                onClick={() => onFind(source)}
              >
                {busySourceId === source.id ? 'Looking…' : 'Find collisions'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}