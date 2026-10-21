import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { button, input, label, panel, select, textarea } from '@/lib/ui';

const blank = {
  name: '',
  cluster: '',
  tier: 1,
  tags: '',
  website: '',
  newsletter: '',
  feed_url: '',
  core_position: '',
  active: true,
};

export default function ThinkerForm({ thinker, onSaved, onCancel }) {
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    setForm(
      thinker
        ? {
            name: thinker.name || '',
            cluster: thinker.cluster || '',
            tier: thinker.tier || 1,
            tags: (thinker.tags || []).join(', '),
            website: thinker.website || '',
            newsletter: thinker.newsletter || '',
            feed_url: thinker.feed_url || '',
            core_position: thinker.core_position || '',
            active: thinker.active !== false,
          }
        : blank
    );
  }, [thinker?.id]);

  const save = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        name: form.name.trim(),
        tier: Number(form.tier) || 1,
        tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      };
      if (thinker) {
        await base44.entities.Thinker.update(thinker.id, payload);
      } else {
        await base44.entities.Thinker.create(payload);
      }
      await onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={`${panel} mt-4`}>
      <h2 className="text-sm font-semibold">{thinker ? `Edit ${thinker.name}` : 'New thinker'}</h2>
      <div className="flex flex-wrap gap-3">
        <div className="min-w-[180px] flex-1">
          <label className={label}>Name</label>
          <input className={input} value={form.name} onChange={(e) => set('name', e.target.value)} />
        </div>
        <div className="min-w-[160px] flex-1">
          <label className={label}>Cluster</label>
          <input className={input} value={form.cluster} onChange={(e) => set('cluster', e.target.value)} />
        </div>
        <div className="min-w-[100px]">
          <label className={label}>Tier</label>
          <select className={select} value={form.tier} onChange={(e) => set('tier', e.target.value)}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>
      </div>
      <div>
        <label className={label}>Tags (comma separated)</label>
        <input className={input} value={form.tags} onChange={(e) => set('tags', e.target.value)} />
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="min-w-[180px] flex-1">
          <label className={label}>Website</label>
          <input className={input} value={form.website} onChange={(e) => set('website', e.target.value)} />
        </div>
        <div className="min-w-[180px] flex-1">
          <label className={label}>Newsletter</label>
          <input className={input} value={form.newsletter} onChange={(e) => set('newsletter', e.target.value)} />
        </div>
      </div>
      <div>
        <label className={label}>Feed URL</label>
        <input className={input} value={form.feed_url} onChange={(e) => set('feed_url', e.target.value)} />
      </div>
      <div>
        <label className={label}>Core position</label>
        <textarea className={textarea} rows={3} value={form.core_position} onChange={(e) => set('core_position', e.target.value)} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.active} onChange={(e) => set('active', e.target.checked)} />
        Active
      </label>
      <div className="flex gap-2">
        <button className={button} disabled={saving || !form.name.trim()} onClick={save}>
          {saving ? 'Saving…' : thinker ? 'Save thinker' : 'Add thinker'}
        </button>
        {thinker && <button className={button} onClick={onCancel}>Cancel</button>}
      </div>
    </section>
  );
}