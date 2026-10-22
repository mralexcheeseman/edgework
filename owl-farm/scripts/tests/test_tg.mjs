import { state } from './mock.mjs';
import hook from './telegramHook.mjs';
const assert = (c, m) => { if (!c) { console.log('FAIL', m); process.exitCode = 1; } else console.log('ok  ', m); };
state.env = { TELEGRAM_WEBHOOK_SECRET: 's3', TELEGRAM_CHAT_ID: '42', TELEGRAM_BOT_TOKEN: 't', OWL_WIRE_KEY: 'k' };
const T = (b, secret = 's3') => hook(new Request('https://x/functions/telegramHook', { method: 'POST', headers: { 'x-telegram-bot-api-secret-token': secret }, body: JSON.stringify(b) }));
const db = (await import('./mock.mjs')).createClientFromRequest().asServiceRole.entities;
const pos = await db.Position.create({ number: 7, statement: 'Brands are promises.' });
const src = await db.SourceItem.create({ title: 'Piece', thinker: 'Seth Godin', summary: 'Sum', url: 'https://s.example' });
const c1 = await db.Collision.create({ source_item: src.id, position: pos.id, relation: 'challenges', why: 'Because', status: 'new' });
const c2 = await db.Collision.create({ source_item: src.id, position: pos.id, relation: 'supports', why: 'Other', status: 'new' });

let r = await T({ internal: 'pick' }, 'wrong');
assert(r.status === 403, 'wrong secret refused');
r = await T({ update_id: 1, message: { chat: { id: 99 }, text: 'hi' } });
assert((await r.json()).ignored && state.sent.length === 0, 'stranger ignored');

await T({ internal: 'pick' });
const pick = state.sent.at(-1);
assert(pick.text.includes("Today's pick") && pick.text.includes('#c') && pick.reply_markup.inline_keyboard[0].length === 2, 'pick sent with buttons');
const pickedId = pick.text.match(/#c([a-f0-9]+)/)[1];
assert((await db.Collision.get(pickedId)).picked_at, 'pick marked');

state.sent.length = 0;
await T({ update_id: 2, message: { chat: { id: 42 }, text: 'rube: brands are just promises with a logo', reply_to_message: { text: pick.text } } });
const drafts = (await db.Draft.list()).items;
assert(drafts.length === 1 && drafts[0].format === 'hey_rube' && drafts[0].original_body.includes('promises with a logo'), 'reply drafted as Hey Rube with original kept');
assert((await db.Collision.get(pickedId)).status === 'kept', 'collision kept');
const draftMsg = state.sent.at(-1);
assert(draftMsg.text.includes('#d' + drafts[0].id) && draftMsg.reply_markup.inline_keyboard.length === 3, 'draft sent with buttons');
const genCall = state.calls.filter((c) => c.url.includes('generateDraft')).at(-1);
assert(genCall.body.key === 'k' && genCall.body.collision_id === pickedId, 'generateDraft called with key and collision');

// Telegram retry of same update must not draft twice.
await T({ update_id: 2, message: { chat: { id: 42 }, text: 'rube: brands are just promises with a logo', reply_to_message: { text: pick.text } } });
assert((await db.Draft.list()).items.length === 1, 'retry ignored');

// Format switch via button.
await T({ update_id: 3, callback_query: { id: 'q', data: `fmt:dispatch:${drafts[0].id}`, message: { message_id: 5, chat: { id: 42 } } } });
const d1 = await db.Draft.get(drafts[0].id);
assert(d1.format === 'dispatch' && d1.body.startsWith('Body for dispatch'), 'redrafted as dispatch');

// Reply to a draft with a note.
await T({ update_id: 4, message: { chat: { id: 42 }, text: 'shorter please', reply_to_message: { text: state.sent.filter(s=>s.text?.includes('#d')).at(-1).text } } });
const d2 = await db.Draft.get(drafts[0].id);
assert(d2.reaction.includes('Also: shorter please') && d2.format === 'dispatch', 'note redraft keeps format');

await T({ update_id: 5, callback_query: { id: 'q', data: `keep:${drafts[0].id}`, message: { message_id: 6, chat: { id: 42 } } } });
assert((await db.Draft.get(drafts[0].id)).status === 'edited', 'keep marks edited');

// Plain message goes to latest pick.
await T({ update_id: 6, message: { chat: { id: 42 }, text: 'a plain thought' } });
assert((await db.Draft.list()).items.length === 2, 'plain message drafts latest pick');

const other = (await db.Collision.list()).items.find((c) => c.id !== pickedId);
await T({ update_id: 7, callback_query: { id: 'q', data: `ckill:${other.id}`, message: { message_id: 7, chat: { id: 42 } } } });
assert((await db.Collision.get(other.id)).status === 'killed', 'kill collision');
assert(state.sent.at(-1).text.includes('Nothing waiting'), 'no more picks message');

await T({ update_id: 8, callback_query: { id: 'q', data: `kill:${drafts[0].id}`, message: { message_id: 8, chat: { id: 42 } } } });
assert((await db.Draft.list()).items.length === 1, 'kill deletes draft');

const vn = await db.VoiceNote.create({ rule: 'r', status: 'proposed' });
await T({ update_id: 9, callback_query: { id: 'q', data: `vadopt:${vn.id}`, message: { message_id: 9, chat: { id: 42 } } } });
assert((await db.VoiceNote.get(vn.id)).status === 'adopted', 'voice note adopted');

await T({ update_id: 10, message: { chat: { id: 42 }, text: '/status' } });
assert(state.sent.at(-1).text === 'status text', '/status relays nudge');
const bad = state.sent.filter((s) => s.text && /Something broke/.test(s.text));
assert(bad.length === 0, 'no errors reported: ' + bad.map((b) => b.text).join('|'));
