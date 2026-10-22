import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

// The routine from Telegram. The bot sends the day's best collision; Alex replies with what
// he thinks; the Desk drafts it and sends it back with Keep / Redo / Kill buttons.
// Telegram calls this as a webhook (set up with dailyNudge { telegram_webhook: true }) and
// signs every call with TELEGRAM_WEBHOOK_SECRET. dailyNudge calls it with { internal: 'pick' }.
// Only messages from TELEGRAM_CHAT_ID are acted on.

const APP = 'https://owl-farm-notes.base44.app';
const FORMATS = {
  dispatch: 'Dispatch',
  hey_rube: 'Hey Rube',
  expense_report: 'Expense Report',
  essay: 'Essay',
  routine: 'Routine',
};
// "rube: ..." at the start of a reply picks the shape; plain replies become a Dispatch.
const PREFIXES = { rube: 'hey_rube', 'hey rube': 'hey_rube', dispatch: 'dispatch', expense: 'expense_report', essay: 'essay', routine: 'routine' };

const items = (res) => (Array.isArray(res) ? res : res?.items || []);
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const clip = (s, n) => (String(s || '').length > n ? `${String(s).slice(0, n - 1)}…` : String(s || ''));

async function telegram(method, body) {
  const token = Deno.env.get('TELEGRAM_BOT_TOKEN');
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body || {}),
  });
  return res.json();
}

const send = (chat_id, text, reply_markup) =>
  telegram('sendMessage', { chat_id, text, parse_mode: 'HTML', disable_web_page_preview: true, ...(reply_markup ? { reply_markup } : {}) });

// Owl Farm's own functions, called with the shared key (the same way the workflows call them).
async function owl(name, payload) {
  const res = await fetch(`${APP}/functions/${name}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ ...payload, key: Deno.env.get('OWL_WIRE_KEY') }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.error) throw new Error(data?.error || `${name} HTTP ${res.status}`);
  return data;
}

// --- The day's pick ---

async function nextPick(db, skipId) {
  const fresh = items(await db.Collision.filter({ status: 'new' }, { sort: '-created_date', limit: 50 })).filter((c) => c.id !== skipId);
  if (!fresh.length) return null;
  // Never-sent first, newest first; then the one sent longest ago.
  const unsent = fresh.filter((c) => !c.picked_at);
  if (unsent.length) return unsent[0];
  return fresh.sort((a, b) => String(a.picked_at).localeCompare(String(b.picked_at)))[0];
}

async function sendPick(db, chatId, skipId) {
  const c = await nextPick(db, skipId);
  if (!c) {
    return send(chatId, `Nothing waiting on the Wire. Write about anything instead: <a href="${APP}/desk">open the Desk</a> and start from a Spark.`);
  }
  const [s, p] = await Promise.all([c.source_item ? db.SourceItem.get(c.source_item) : null, c.position ? db.Position.get(c.position) : null]);
  await db.Collision.update(c.id, { picked_at: new Date().toISOString() });
  const text = [
    `<b>Today's pick</b> · it ${esc(c.relation)} your Position #${esc(p?.number ?? '?')}`,
    '',
    `<b>${esc(s?.title || 'Untitled')}</b>${s?.thinker ? ` by ${esc(s.thinker)}` : ''}`,
    s?.summary ? esc(clip(s.summary, 600)) : '',
    '',
    p ? `<i>Your position:</i> ${esc(p.statement)}` : '',
    c.why ? `<i>Why it collides:</i> ${esc(c.why)}` : '',
    s?.url ? `<a href="${s.url}">Read it</a>` : '',
    '',
    'Reply to this message with what you think, in a line or two, and the Desk will draft it. Start with "rube:" for a Hey Rube.',
    `<code>#c${c.id}</code>`,
  ]
    .filter((l, i, all) => l !== '' || all[i - 1] !== '')
    .join('\n');
  return send(chatId, text, {
    inline_keyboard: [
      [{ text: '🗑 Kill', callback_data: `ckill:${c.id}` }, { text: '↪ Another one', callback_data: `cnext:${c.id}` }],
      [{ text: 'Open the Wire', url: `${APP}/` }],
    ],
  });
}

// --- Drafting ---

const draftButtons = (id) => ({
  inline_keyboard: [
    [{ text: '✅ Keep', callback_data: `keep:${id}` }, { text: '🔁 Redo', callback_data: `redo:${id}` }, { text: '🗑 Kill', callback_data: `kill:${id}` }],
    [{ text: 'As Hey Rube', callback_data: `fmt:hey_rube:${id}` }, { text: 'As Dispatch', callback_data: `fmt:dispatch:${id}` }, { text: 'As Expense', callback_data: `fmt:expense_report:${id}` }],
    [{ text: 'Edit in the Desk', url: `${APP}/archive?draft=${id}` }],
  ],
});

async function sendDraft(chatId, draft, notes) {
  const warn = (notes?.warnings || []).map((w) => `⚠️ ${esc(w)}`);
  // Telegram caps a message at 4,096 characters; long essays are cut and finished in the app.
  const body = esc(clip(draft.body, 3000));
  const text = [
    `<b>${esc(draft.title)}</b>`,
    draft.deck ? `<i>${esc(draft.deck)}</i>` : '',
    '',
    body,
    '',
    ...warn,
    notes?.biggest_fix ? `<i>Editor's note: ${esc(clip(notes.biggest_fix, 300))}</i>` : '',
    `${FORMATS[draft.format] || draft.format} · reply to this message to redraft with a note · <code>#d${draft.id}</code>`,
  ]
    .filter((l, i, all) => l !== '' || all[i - 1] !== '')
    .join('\n');
  return send(chatId, text, draftButtons(draft.id));
}

function goDeeperText(data) {
  return [...(data.go_deeper || []).map((g) => `${g.title} | ${g.url} | ${g.why}`), ...(data.look_up || []).map((l) => `Look up: ${l}`)].join('\n');
}

function draftFields(data, format) {
  return {
    format,
    title: data.title || '',
    deck: data.deck || '',
    pull: data.pull || '',
    body: data.body || '',
    go_deeper: goDeeperText(data),
    caption: data.caption || '',
    original_title: data.title || '',
    original_body: data.body || '',
    status: 'drafted',
  };
}

async function draftFromCollision(db, chatId, collision, reaction, format, updateId) {
  // Mark first: if Telegram retries this update while the Desk is still writing, it's skipped.
  await db.Collision.update(collision.id, { reaction, status: 'kept', tg_update: updateId });
  await send(chatId, `Drafting a ${FORMATS[format]} from that. About a minute.`);
  await telegram('sendChatAction', { chat_id: chatId, action: 'typing' });
  const data = await owl('generateDraft', { collision_id: collision.id, reaction, format });
  const draft = await db.Draft.create({ ...draftFields(data, format), reaction, collision: collision.id, tg_update: updateId });
  await sendDraft(chatId, draft, data);
}

async function redraft(db, chatId, draft, format, extraNote, updateId) {
  if (draft.tg_update === updateId) return;
  await db.Draft.update(draft.id, { tg_update: updateId });
  await send(chatId, `Redrafting as a ${FORMATS[format]}. About a minute.`);
  await telegram('sendChatAction', { chat_id: chatId, action: 'typing' });
  const reaction = extraNote ? `${draft.reaction || ''}\n\nAlso: ${extraNote}`.trim() : draft.reaction || '';
  let payload = { collision_id: draft.collision };
  if (!draft.collision) {
    const spark = draft.spark ? await db.Spark.get(draft.spark) : null;
    payload = { origin_type: 'spark', origin_text: spark ? `SPARK (Alex's own note${spark.source ? `, after ${spark.source}` : ''}): ${spark.body}` : draft.body };
  }
  const data = await owl('generateDraft', { ...payload, reaction, format });
  const updated = await db.Draft.update(draft.id, { ...draftFields(data, format), reaction });
  await sendDraft(chatId, { ...draft, ...updated, ...draftFields(data, format), id: draft.id }, data);
}

function parseReaction(text) {
  const m = text.match(/^\s*(hey rube|rube|dispatch|expense|essay|routine)\s*[:\-]\s*/i);
  if (!m) return { format: null, reaction: text.trim() };
  return { format: PREFIXES[m[1].toLowerCase()], reaction: text.slice(m[0].length).trim() };
}

const HELP = `This is Owl Farm. Each morning I send the best collision from the Wire.

<b>Reply</b> to it with what you think, in a line or two, and the Desk drafts it. Start with "rube:" for a Hey Rube, "expense:" for an Expense Report, "essay:" or "routine:" for the longer shapes.
<b>Under a draft:</b> Keep, Redo, Kill, or try another shape. Reply to a draft with a note ("shorter, open on the pit gate") to redraft with it.

/pick · the best collision waiting now
/status · what's done today`;

export default async function (req) {
  try {
    const secret = Deno.env.get('TELEGRAM_WEBHOOK_SECRET');
    if (!secret || req.headers.get('x-telegram-bot-api-secret-token') !== secret) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
    const base44 = createClientFromRequest(req);
    const db = base44.asServiceRole.entities;
    const chatId = Deno.env.get('TELEGRAM_CHAT_ID');
    const update = await req.json().catch(() => ({}));

    if (update?.internal === 'pick') {
      await sendPick(db, chatId);
      return Response.json({ ok: true });
    }

    const msg = update?.message;
    const cb = update?.callback_query;
    const from = String(msg?.chat?.id ?? cb?.message?.chat?.id ?? '');
    // Anyone can find a bot; only Alex's chat gets an answer.
    if (!chatId || from !== String(chatId)) return Response.json({ ok: true, ignored: true });

    if (cb) {
      await telegram('answerCallbackQuery', { callback_query_id: cb.id });
      const [action, a, b] = String(cb.data || '').split(':');
      const id = b || a;
      const clearButtons = () => telegram('editMessageReplyMarkup', { chat_id: chatId, message_id: cb.message.message_id, reply_markup: { inline_keyboard: [] } });

      if (action === 'ckill') {
        await db.Collision.update(id, { status: 'killed' });
        await clearButtons();
        await sendPick(db, chatId, id);
      } else if (action === 'cnext') {
        await clearButtons();
        await sendPick(db, chatId, id);
      } else if (action === 'keep') {
        await db.Draft.update(id, { status: 'edited' });
        await telegram('editMessageReplyMarkup', {
          chat_id: chatId,
          message_id: cb.message.message_id,
          reply_markup: { inline_keyboard: [[{ text: 'Make the card →', url: `${APP}/typewriter?draft=${id}` }]] },
        });
        await send(chatId, 'Kept. Last step: make the card in the Typewriter, post it, then Mark published.');
      } else if (action === 'kill') {
        await db.Draft.delete(id);
        await clearButtons();
        await send(chatId, 'Killed. /pick for another collision.');
      } else if (action === 'redo' || action === 'fmt') {
        const draft = await db.Draft.get(id);
        await clearButtons();
        await redraft(db, chatId, draft, action === 'fmt' ? a : draft.format, '', update.update_id);
      } else if (action === 'vadopt' || action === 'vreject') {
        await db.VoiceNote.update(id, { status: action === 'vadopt' ? 'adopted' : 'rejected' });
        await clearButtons();
        await send(chatId, action === 'vadopt' ? 'Adopted. Every new draft follows it from now on.' : 'Rejected. It won’t come up again.');
      }
      return Response.json({ ok: true });
    }

    const text = String(msg?.text || '').trim();
    if (!text) return Response.json({ ok: true });

    if (/^\/(start|help)\b/.test(text)) {
      await send(chatId, HELP);
    } else if (/^\/(pick|today)\b/.test(text)) {
      await sendPick(db, chatId);
    } else if (/^\/status\b/.test(text)) {
      const r = await owl('dailyNudge', { dry: true });
      await send(chatId, r.tgText);
    } else {
      const quoted = String(msg.reply_to_message?.text || '');
      const draftRef = quoted.match(/#d([a-f0-9]{8,})/);
      const collisionRef = quoted.match(/#c([a-f0-9]{8,})/);
      if (draftRef) {
        const draft = await db.Draft.get(draftRef[1]);
        const { format, reaction } = parseReaction(text);
        await redraft(db, chatId, draft, format || draft.format, reaction, update.update_id);
      } else {
        // A reply to a pick, or a plain message: it's about the most recent pick.
        let collision = collisionRef ? await db.Collision.get(collisionRef[1]) : null;
        if (!collision) collision = items(await db.Collision.list({ sort: '-picked_at', limit: 1 }))[0];
        if (!collision?.picked_at && !collisionRef) {
          await send(chatId, 'Send /pick first, then reply to it with what you think.');
        } else if (collision.tg_update !== update.update_id) {
          const { format, reaction } = parseReaction(text);
          await draftFromCollision(db, chatId, collision, reaction, format || 'dispatch', update.update_id);
        }
      }
    }
    return Response.json({ ok: true });
  } catch (error) {
    // Tell Alex rather than fail silently; always answer 200 so Telegram doesn't retry a broken update forever.
    try {
      const chatId = Deno.env.get('TELEGRAM_CHAT_ID');
      if (chatId) await send(chatId, `Something broke: ${esc(error.message)}. The app still works: ${APP}/desk`);
    } catch (_) { /* nothing more to do */ }
    return Response.json({ ok: false, error: error.message });
  }
}
