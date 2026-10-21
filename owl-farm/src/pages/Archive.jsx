import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { FORMAT_LABELS } from '@/lib/templates';
import { button, hint, h1, h2, input, label, listBox, page, rowBox, select } from '@/lib/ui';

const STATUSES = ['idea', 'drafted', 'edited', 'exported', 'published'];
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export default function Archive() {
  const [status, setStatus] = useState('all');
  const [format, setFormat] = useState('all');
  const [term, setTerm] = useState('');
  const [applied, setApplied] = useState('');
  const [drafts, setDrafts] = useState([]);
  const [assets, setAssets] = useState([]);
  const [draftTitles, setDraftTitles] = useState({});
  const [openId, setOpenId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDrafts();
  }, [status, format, applied]);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadDrafts = async () => {
    setLoading(true);
    try {
      const query = {};
      if (status !== 'all') query.status = status;
      if (format !== 'all') query.format = format;
      if (applied) query.title = { $regex: escapeRegex(applied), $options: 'i' };
      const result = await base44.entities.Draft.filter(query, { sort: '-created_date', limit: 50 });
      setDrafts(result.items);
    } finally {
      setLoading(false);
    }
  };

  const loadAssets = async () => {
    const result = await base44.entities.Asset.list({ sort: '-created_date', limit: 20 });
    setAssets(result.items);
    const ids = [...new Set(result.items.map((a) => a.draft).filter(Boolean))];
    if (!ids.length) {
      setDraftTitles({});
      return;
    }
    const draftsResult = await base44.entities.Draft.filter({ id: { $in: ids } }, { limit: 20 });
    const map = {};
    draftsResult.items.forEach((d) => {
      map[d.id] = d.title || 'Untitled';
    });
    setDraftTitles(map);
  };

  const openAsset = async (asset) => {
    const res = await base44.integrations.Core.CreateFileSignedUrl({ file_uri: asset.image_url, expires_in: 600 });
    window.open(res.signed_url, '_blank');
  };

  return (
    <div className={page}>
      <h1 className={h1}>Archive</h1>

      <section className="mt-4 space-y-2">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[140px]">
            <label className={label}>Status</label>
            <select className={select} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">all</option>
              {STATUSES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="min-w-[140px]">
            <label className={label}>Format</label>
            <select className={select} value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="all">all</option>
              {Object.entries(FORMAT_LABELS).map(([value, text]) => (
                <option key={value} value={value}>{text}</option>
              ))}
            </select>
          </div>
          <form
            className="flex min-w-[200px] flex-1 items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              setApplied(term.trim());
            }}
          >
            <div className="flex-1">
              <label className={label}>Title contains</label>
              <input className={input} value={term} onChange={(e) => setTerm(e.target.value)} />
            </div>
            <button className={button} type="submit">Search</button>
          </form>
        </div>
      </section>

      <section className="mt-6">
        <h2 className={h2}>Drafts</h2>
        {loading ? (
          <p className={`${hint} mt-2`}>Loading…</p>
        ) : drafts.length === 0 ? (
          <p className={`${hint} mt-2`}>No drafts match.</p>
        ) : (
          <div className={`${listBox} mt-2`}>
            {drafts.map((draft) => (
              <div key={draft.id} className={rowBox}>
                <button
                  className="text-left text-sm"
                  onClick={() => setOpenId(openId === draft.id ? '' : draft.id)}
                >
                  {draft.title || 'Untitled'}
                </button>
                <p className={hint}>
                  {draft.format} · {draft.status} · {String(draft.created_date).slice(0, 10)}
                  {draft.lenses?.length ? ` · lenses: ${draft.lenses.join(', ')}` : ''}
                </p>
                {openId === draft.id && (
                  <div>
                    <p className={`${hint} whitespace-pre-wrap`}>{draft.reaction}</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm">{draft.body}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-6">
        <h2 className={h2}>Assets</h2>
        {assets.length === 0 ? (
          <p className={hint}>No assets yet.</p>
        ) : (
          <div className={`${listBox} mt-2`}>
            {assets.map((asset) => (
              <div key={asset.id} className="flex flex-wrap items-center justify-between gap-2 p-3">
                <div>
                  <p className="text-sm">{draftTitles[asset.draft] || 'Unknown draft'}</p>
                  <p className={hint}>
                    {asset.template} · {asset.mark_mix} · {asset.size} · {String(asset.created_date).slice(0, 10)}
                  </p>
                </div>
                <button className={button} onClick={() => openAsset(asset)}>Open PNG</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}