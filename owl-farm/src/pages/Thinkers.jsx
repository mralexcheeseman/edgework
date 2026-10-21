import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import ThinkerForm from '@/components/ThinkerForm';
import { button, hint, h1, listBox, page, rowBox } from '@/lib/ui';

export default function Thinkers() {
  const [thinkers, setThinkers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const result = await base44.entities.Thinker.list({ sort: 'name', limit: 200 });
      setThinkers(result.items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (thinker) => {
    if (!window.confirm(`Delete ${thinker.name}?`)) return;
    await base44.entities.Thinker.delete(thinker.id);
    if (editing?.id === thinker.id) setEditing(null);
    await load();
  };

  return (
    <div className={page}>
      <h1 className={h1}>Thinkers</h1>

      <ThinkerForm
        thinker={editing}
        onSaved={async () => {
          setEditing(null);
          await load();
        }}
        onCancel={() => setEditing(null)}
      />

      {loading ? (
        <p className={`${hint} mt-4`}>Loading…</p>
      ) : thinkers.length === 0 ? (
        <p className={`${hint} mt-4`}>No thinkers yet.</p>
      ) : (
        <div className={`${listBox} mt-4`}>
          {thinkers.map((thinker) => (
            <div key={thinker.id} className={rowBox}>
              <p className="text-sm">
                <span className="font-medium">{thinker.name}</span>
                {thinker.active ? '' : ' (inactive)'}
              </p>
              <p className={hint}>
                {[thinker.cluster, `tier ${thinker.tier}`, (thinker.tags || []).join(', ')].filter(Boolean).join(' · ')}
              </p>
              {thinker.core_position && <p className="text-sm">{thinker.core_position}</p>}
              <div className="flex gap-2">
                <button className={button} onClick={() => setEditing(thinker)}>Edit</button>
                <button className={button} onClick={() => remove(thinker)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}