import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import PositionForm from '@/components/PositionForm';
import { button, hint, h1, listBox, page, rowBox } from '@/lib/ui';

export default function Positions() {
  const [positions, setPositions] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const result = await base44.entities.Position.list({ sort: 'number', limit: 200 });
      setPositions(result.items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (position) => {
    if (!window.confirm(`Delete position #${position.number}?`)) return;
    await base44.entities.Position.delete(position.id);
    if (editing?.id === position.id) setEditing(null);
    await load();
  };

  return (
    <div className={page}>
      <h1 className={h1}>Positions</h1>

      <PositionForm
        position={editing}
        onSaved={async () => {
          setEditing(null);
          await load();
        }}
        onCancel={() => setEditing(null)}
      />

      {loading ? (
        <p className={`${hint} mt-4`}>Loading…</p>
      ) : positions.length === 0 ? (
        <p className={`${hint} mt-4`}>No positions recorded yet.</p>
      ) : (
        <div className={`${listBox} mt-4`}>
          {positions.map((position) => (
            <div key={position.id} className={rowBox}>
              <p className="text-sm">
                <span className="font-medium">#{position.number}</span> {position.statement}
              </p>
              <p className={hint}>
                {position.arena} · conviction {position.conviction} · {position.status}
                {position.source_essay ? ` · ${position.source_essay}` : ''}
              </p>
              <div className="flex gap-2">
                <button className={button} onClick={() => setEditing(position)}>Edit</button>
                <button className={button} onClick={() => remove(position)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}