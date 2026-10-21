import { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import TemplatePreview from '@/components/TemplatePreview';
import { downloadBlob, renderNodePng } from '@/lib/exportPng';
import { TEMPLATES, templateOf } from '@/lib/templates';
import { button, buttonRed, hint, h1, h2, label, listBox, page, panel, select } from '@/lib/ui';

export default function TheTypewriter() {
  const [drafts, setDrafts] = useState([]);
  const [assets, setAssets] = useState([]);
  const [draftId, setDraftId] = useState('');
  const [templateKey, setTemplateKey] = useState(TEMPLATES[0].key);
  const [mix, setMix] = useState(1);
  const [replay, setReplay] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const cardRef = useRef(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const [draftResult, assetResult] = await Promise.all([
      base44.entities.Draft.list({ sort: '-created_date', limit: 100 }),
      base44.entities.Asset.list({ sort: '-created_date', limit: 20 }),
    ]);
    setDrafts(draftResult.items);
    setAssets(assetResult.items);
    const wanted = new URLSearchParams(window.location.search).get('draft');
    const first = draftResult.items.find((d) => d.id === wanted) || draftResult.items[0];
    if (first) {
      setDraftId(first.id);
      if (templateOf(first.format).key === first.format) setTemplateKey(first.format);
    }
  };

  const template = templateOf(templateKey);
  const draft = drafts.find((d) => d.id === draftId) || null;

  const exportPng = async () => {
    if (!draft || !cardRef.current) return;
    setBusy(true);
    setError('');
    try {
      const blob = await renderNodePng(cardRef.current, template.width, template.height);
      const filename = `edgework-${template.key}-${(draft.title || 'draft').replace(/[^a-z0-9-_]+/gi, '-').slice(0, 50)}-${mix}.png`;
      downloadBlob(blob, filename);

      const file = new File([blob], filename, { type: 'image/png' });
      const upload = await base44.integrations.Core.UploadPrivateFile({ file });
      const asset = await base44.entities.Asset.create({
        draft: draft.id,
        template: templateKey,
        mark_mix: String(mix),
        size: template.size,
        image_url: upload.file_uri,
      });
      setAssets((prev) => [asset, ...prev]);

      if (draft.status !== 'published') {
        await base44.entities.Draft.update(draft.id, { status: 'exported' });
        setDrafts((prev) => prev.map((d) => (d.id === draft.id ? { ...d, status: 'exported' } : d)));
      }
    } catch (err) {
      setError(`Export failed: ${err.message || err}`);
    } finally {
      setBusy(false);
    }
  };

  const openAsset = async (asset) => {
    const res = await base44.integrations.Core.CreateFileSignedUrl({ file_uri: asset.image_url, expires_in: 600 });
    window.open(res.signed_url, '_blank');
  };

  return (
    <div className={page}>
      <h1 className={h1}>The Typewriter</h1>
      <p className={`${hint} mt-2`}>Drop a draft onto paper. Shuffle the marks until it looks like it was filed at 4am, then export.</p>

      <section className={`${panel} mt-6`}>
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map((item) => (
            <button key={item.key} className={item.key === templateKey ? buttonRed : button} onClick={() => setTemplateKey(item.key)}>
              {item.label}
            </button>
          ))}
        </div>
        <div>
          <label className={label}>Draft</label>
          <select className={select} value={draftId} onChange={(e) => setDraftId(e.target.value)}>
            <option value="">—</option>
            {drafts.map((item) => (
              <option key={item.id} value={item.id}>{item.title || 'Untitled'} · {item.format}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className={button} onClick={() => setMix((m) => (m % 99) + 1)}>Shuffle marks</button>
          <span className={hint}>Mark mix Nº {mix}</span>
          {templateKey === 'routine' && (
            <button className={button} onClick={() => setReplay((r) => r + 1)}>Replay typing</button>
          )}
          <button className={`${buttonRed} ml-auto`} disabled={busy || !draft} onClick={exportPng}>
            {busy ? 'Exporting…' : `Export PNG · ${template.size}`}
          </button>
        </div>
        {error && <p className="ew-type text-[#c4211a]">{error}</p>}
      </section>

      {draft ? (
        <section className="mt-6">
          <TemplatePreview
            key={`${templateKey}-${replay}`}
            ref={cardRef}
            draft={draft}
            template={template}
            mix={mix}
            animate={templateKey === 'routine' && replay > 0}
          />
        </section>
      ) : (
        <p className={`${hint} mt-6`}>No drafts yet. Write one on The Desk.</p>
      )}

      <section className="mt-10">
        <h2 className={h2}>Recent exports</h2>
        {assets.length === 0 ? (
          <p className={`${hint} mt-2`}>Nothing exported yet.</p>
        ) : (
          <div className={`${listBox} mt-3`}>
            {assets.map((asset) => (
              <div key={asset.id} className="ew-sheet flex flex-wrap items-center justify-between gap-2 p-4">
                <div>
                  <p className="ew-type">{templateOf(asset.template).label} · mix Nº {asset.mark_mix}</p>
                  <p className={hint}>{asset.size} · {String(asset.created_date).slice(0, 10)}</p>
                </div>
                <button className={button} onClick={() => openAsset(asset)}>Open</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
