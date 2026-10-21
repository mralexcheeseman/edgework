import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import CollisionCard from '@/components/CollisionCard';
import SourceIntake from '@/components/SourceIntake';
import { buttonRed, h1, h2, hint, listBox, page } from '@/lib/ui';

const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString();

export default function TheWire() {
  const [collisions, setCollisions] = useState([]);
  const [sources, setSources] = useState([]);
  const [recentSources, setRecentSources] = useState([]);
  const [positions, setPositions] = useState([]);
  const [thinkers, setThinkers] = useState([]);
  const [busySourceId, setBusySourceId] = useState('');
  const [pinnedId, setPinnedId] = useState('');
  const [notice, setNotice] = useState('');
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [collisionResult, positionResult, thinkerResult, recentResult] = await Promise.all([
        base44.entities.Collision.filter({ created_date: { $gte: daysAgo(3) }, status: 'new' }, { sort: '-created_date', limit: 50 }),
        base44.entities.Position.list({ sort: 'number', limit: 100 }),
        base44.entities.Thinker.filter({ active: true }, { sort: 'name', limit: 200 }),
        base44.entities.SourceItem.list({ sort: '-created_date', limit: 10 }),
      ]);

      setCollisions(collisionResult.items);
      setPositions(positionResult.items);
      setThinkers(thinkerResult.items);
      setRecentSources(recentResult.items);

      const ids = [...new Set(collisionResult.items.map((c) => c.source_item).filter(Boolean))];
      if (ids.length) {
        const referenced = await base44.entities.SourceItem.filter({ id: { $in: ids } }, { limit: 50 });
        setSources(referenced.items);
      } else {
        setSources([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const positionOf = (id) => positions.find((p) => p.id === id);
  const sourceOf = (id) => sources.find((s) => s.id === id);

  const setStatus = async (collision, status) => {
    await base44.entities.Collision.update(collision.id, { status });
    setCollisions((prev) => prev.filter((c) => c.id !== collision.id));
  };

  const saveReaction = async (collision, reaction) => {
    if (reaction === (collision.reaction || '')) return;
    await base44.entities.Collision.update(collision.id, { reaction });
    setCollisions((prev) => prev.map((c) => (c.id === collision.id ? { ...c, reaction } : c)));
  };

  const pinSpark = async (collision, reaction) => {
    const position = positionOf(collision.position);
    await base44.entities.Spark.create({
      body: [reaction, collision.why].filter(Boolean).join('. '),
      origin: 'collision',
      source: sourceOf(collision.source_item)?.title || '',
      tag: position ? `#${position.number}` : '',
    });
    setPinnedId(collision.id);
  };

  const findFor = async (source) => {
    setBusySourceId(source.id);
    setNotice('');
    try {
      const res = await base44.functions.invoke('findCollisions', { source_item_id: source.id });
      const created = res?.data?.created ?? 0;
      setNotice(created ? `Found ${created} new collision${created === 1 ? '' : 's'}.` : 'No new collisions found.');
      await load();
    } finally {
      setBusySourceId('');
    }
  };

  const runWire = async () => {
    setRunning(true);
    setNotice('Reading the feeds. This can take a minute or two…');
    try {
      const res = await base44.functions.invoke('dailyWire', {});
      const d = res?.data || {};
      const errors = d.feed_errors?.length ? ` ${d.feed_errors.length} feed${d.feed_errors.length === 1 ? '' : 's'} failed.` : '';
      setNotice(`Read ${d.feeds ?? 0} feeds, filed ${d.sources ?? 0} new pieces, ${d.collisions ?? 0} collisions${d.skipped_paywalled ? `, skipped ${d.skipped_paywalled} paywalled` : ''}${d.reread ? `, re-read ${d.reread} older pieces` : ''}.${errors}`);
      await load();
    } catch (err) {
      setNotice(`The wire failed: ${err?.response?.data?.error || err.message}`);
    } finally {
      setRunning(false);
    }
  };

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className={page}>
      <h1 className={h1}>The Wire</h1>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <p className="ew-type text-lg">{today}</p>
        <button className={`${buttonRed} ml-auto`} disabled={running} onClick={runWire}>
          {running ? 'Reading…' : 'Run the wire now'}
        </button>
      </div>
      <p className={`${hint} mt-1`}>It runs itself at 6am. Keep what hits, kill what doesn&apos;t, and say what you think.</p>
      {notice && <p className="ew-type mt-3">{notice}</p>}

      <section className="mt-8">
        <h2 className={h2}>On the wire · last three days</h2>
        {loading ? (
          <p className={`${hint} mt-3`}>Loading…</p>
        ) : collisions.length === 0 ? (
          <p className="ew-type mt-3 text-lg">Nothing on the wire. Run it, or log a piece by hand below.</p>
        ) : (
          <div className={`${listBox} mt-4`}>
            {collisions.map((collision) => (
              <CollisionCard
                key={collision.id}
                collision={collision}
                source={sourceOf(collision.source_item)}
                position={positionOf(collision.position)}
                pinned={pinnedId === collision.id}
                onStatus={setStatus}
                onReaction={saveReaction}
                onPin={pinSpark}
                onSourceUpdated={(s) => s && setSources((prev) => prev.map((x) => (x.id === s.id ? s : x)))}
              />
            ))}
          </div>
        )}
      </section>

      <details className="mt-10">
        <summary className="ew-label cursor-pointer">Log a piece by hand</summary>
        <SourceIntake thinkers={thinkers} sources={recentSources} busySourceId={busySourceId} onSaved={load} onFind={findFor} />
      </details>
    </div>
  );
}
