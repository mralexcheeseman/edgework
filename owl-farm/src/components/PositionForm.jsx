import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { button, input, label, panel, select, textarea } from '@/lib/ui';

const ARENAS = ['marketing-machine', 'ai-work', 'judgement'];

const blank = {
  number: '',
  statement: '',
  arena: ARENAS[0],
  source_essay: '',
  conviction: 3,
  status: 'keep',
};

export default function PositionForm({ position, onSaved, onCancel }) {
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    setForm(
      position
        ? {
            number: position.number ?? '',
            statement: position.statement || '',
            arena: position.arena || ARENAS[0],
            source_essay: position.source_essay || '',
            conviction: position.conviction || 3,
            status: position.status || 'keep',
          }
        : blank
    );
  }, [position?.id]);

  const save = async () => {
    if (!form.statement.trim()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        number: Number(form.number) || 0,
        conviction: Number(form.conviction) || 0,
      };
      if (position) {
        await base44.entities.Position.update(position.id, payload);
      } else {
        await base44.entities.Position.create(payload);
      }
      await onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={`${panel} mt-4`}>
      <h2 className="text-sm font-semibold">{position ? `Edit position #${position.number}` : 'New position'}</h2>
      <div className="flex flex-wrap gap-3">
        <div className="min-w-[100px] flex-1">
          <label className={label}>Number</label>
          <input type="number" className={input} value={form.number} onChange={(e) => set('number', e.target.value)} />
        </div>
        <div className="min-w-[160px] flex-1">
          <label className={label}>Arena</label>
          <select className={select} value={form.arena} onChange={(e) => set('arena', e.target.value)}>
            {ARENAS.map((arena) => (
              <option key={arena} value={arena}>{arena}</option>
            ))}
          </select>
        </div>
        <div className="min-w-[120px] flex-1">
          <label className={label}>Conviction (1-5)</label>
          <input
            type="number"
            min="1"
            max="5"
            className={input}
            value={form.conviction}
            onChange={(e) => set('conviction', e.target.value)}
          />
        </div>
        <div className="min-w-[120px] flex-1">
          <label className={label}>Status</label>
          <select className={select} value={form.status} onChange={(e) => set('status', e.target.value)}>
            <option value="keep">keep</option>
            <option value="edit">edit</option>
          </select>
        </div>
      </div>
      <div>
        <label className={label}>Statement</label>
        <textarea className={textarea} rows={2} value={form.statement} onChange={(e) => set('statement', e.target.value)} />
      </div>
      <div>
        <label className={label}>Source essay</label>
        <input className={input} value={form.source_essay} onChange={(e) => set('source_essay', e.target.value)} />
      </div>
      <div className="flex gap-2">
        <button className={button} disabled={saving || !form.statement.trim()} onClick={save}>
          {saving ? 'Saving…' : position ? 'Save position' : 'Add position'}
        </button>
        {position && <button className={button} onClick={onCancel}>Cancel</button>}
      </div>
    </section>
  );
}