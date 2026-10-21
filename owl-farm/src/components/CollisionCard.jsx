import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SourceBrief from '@/components/SourceBrief';
import { button, buttonRed, hint, input, label, rowBox } from '@/lib/ui';
import { hash, markUrl, MARKS } from '@/lib/marks';

const RELATION = {
  supports: 'Supports',
  challenges: 'Challenges',
  extends: 'Extends',
};

export default function CollisionCard({ collision, source, position, pinned, onStatus, onReaction, onPin, onSourceUpdated }) {
  const navigate = useNavigate();
  const [reaction, setReaction] = useState(collision.reaction || '');

  let seed = 0;
  for (const ch of String(collision.id)) seed += ch.charCodeAt(0);
  const ring = MARKS.coffee[hash(seed) % MARKS.coffee.length];

  const takeToDesk = async () => {
    await onReaction(collision, reaction);
    await onStatus(collision, 'kept');
    navigate(`/desk?collision=${collision.id}`);
  };

  return (
    <article className={`${rowBox} overflow-hidden`}>
      <img src={markUrl(ring)} alt="" className="pointer-events-none absolute -right-16 -top-16 w-48 opacity-40 mix-blend-multiply" style={{ transform: `rotate(${hash(seed + 3) % 360}deg)` }} />

      <div className="flex flex-wrap items-baseline gap-x-3">
        <span className={`ew-label ${collision.relation === 'challenges' ? 'text-[#c4211a]' : ''}`}>{RELATION[collision.relation] || collision.relation} your position</span>
        {position && <span className={hint}>#{position.number} · conviction {position.conviction || 3}/5</span>}
      </div>
      {position && <p className="ew-type text-lg leading-snug">“{position.statement}”</p>}
      <p className="ew-type leading-relaxed text-[#c4211a]">{collision.why}</p>

      {source && (
        <div className="border-t-2 border-[#121110] pt-3">
          <SourceBrief source={source} onUpdated={onSourceUpdated} />
        </div>
      )}

      <div className="border-t-2 border-[#121110] pt-3">
        <p className={label}>What do you think? One line, your words</p>
        <input className={input} value={reaction} onChange={(e) => setReaction(e.target.value)} onBlur={() => onReaction(collision, reaction)} placeholder="Agree? Wrong? What has everyone missed?" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button className={buttonRed} onClick={takeToDesk}>Keep · take to the Desk →</button>
        <button className={button} onClick={() => { onReaction(collision, reaction); onStatus(collision, 'kept'); }}>Keep for later</button>
        <button className={button} onClick={() => onStatus(collision, 'killed')}>Kill</button>
        <button className={button} disabled={pinned || !reaction.trim()} onClick={() => onPin(collision, reaction)}>
          {pinned ? 'Pinned' : 'Pin as spark'}
        </button>
      </div>
    </article>
  );
}
