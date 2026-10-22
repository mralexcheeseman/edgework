import { state, createClientFromRequest } from './mock.mjs';
import wire from './dailyWire.mjs';
import lessons from './editLessons.mjs';
import digest from './weeklyDigest.mjs';
const assert = (c, m) => { if (!c) { console.log('FAIL', m); process.exitCode = 1; } else console.log('ok  ', m); };
const db = createClientFromRequest().asServiceRole.entities;
state.env = { OWL_WIRE_KEY: 'k', TELEGRAM_BOT_TOKEN: 't', TELEGRAM_CHAT_ID: '42', NUDGE_EMAIL: 'a@b.c', READWISE_TOKEN: 'rw' };
const call = (f, b) => f(new Request('https://x', { method: 'POST', body: JSON.stringify({ key: 'k', ...b }) })).then((r) => r.json());
const p = await db.Position.create({ number: 3, statement: 'Distinctiveness beats differentiation.', conviction: 4 });
const recent = new Date(Date.now() - 3600e3).toISOString();
state.readwise = { results: [
  { user_book_id: 11, title: 'How Brands Grow', author: 'Byron Sharp', category: 'books', source_url: null, unique_url: null, highlights: [
    { text: 'Brands compete mainly on mental and physical availability, not on differentiation.', note: 'this is my position 3', highlighted_at: recent, is_deleted: false },
    { text: 'Old one', highlighted_at: '2020-01-01T00:00:00Z' } ] },
  { user_book_id: 12, title: 'Tiny', author: 'X', category: 'articles', source_url: 'https://tiny.example', highlights: [{ text: 'short', highlighted_at: recent }] },
], nextPageCursor: null };
state.llmReply = (a) => a.prompt.includes('highlighted these lines') ? { summary: 'S', core_claim: 'C', quote: 'Q', lines: [], collisions: [{ position_id: p.id, relation: 'supports', why: 'You argue this.', strength: 3 }] } : {};
let r = await call(wire, {});
assert(r.readwise === 1 && !r.readwise_error, 'one Readwise book filed, short one skipped: ' + JSON.stringify(r));
const src = (await db.SourceItem.list()).items;
assert(src.length === 1 && src[0].highlights.length === 1 && src[0].url === 'https://readwise.io/bookreview/11' && src[0].thinker === 'Byron Sharp', 'source item has highlights');
assert(state.llm.at(-1).prompt.includes('HIS NOTES') && state.llm.at(-1).prompt.includes('this is my position 3'), 'notes passed to the reader');
assert((await db.Collision.list()).items.length === 1, 'strength-3 highlight collision kept');
const before = state.llm.length;
r = await call(wire, {});
assert(r.readwise === 0 && state.llm.length === before, 'same highlights not reprocessed');

// editLessons
const mk = (o, f) => db.Draft.create({ format: 'dispatch', status: 'published', original_title: 'a', original_body: o, title: 'b', body: f });
r = await call(lessons, {});
assert(r.proposed === 0 && /Waiting/.test(r.note), 'waits for 0 pairs');
await mk('In today\'s fast moving world brands face a choice. The pit gate closed.', 'The pit gate closed.');
await mk('Let me explain the source first. Then the scene.', 'Then the scene.');
await mk('Throat clearing here. The handshake mattered.', 'The handshake mattered.');
state.llmReply = () => ({ summary: 'You cut the windup.', rules: [{ rule: 'Cut the first sentence when it sets up rather than shows.', evidence: 'before/after' }] });
r = await call(lessons, {});
assert(r.proposed === 1 && r.pairs === 3 && r.kept_average < 100, 'proposes rule: ' + JSON.stringify(r));
assert(state.sent.some((s) => s.reply_markup?.inline_keyboard?.[0]?.[0]?.callback_data?.startsWith('vadopt:')), 'rule sent with Adopt button');
r = await call(lessons, {});
assert(r.pairs === 0, 'pairs not re-read');

// weeklyDigest
state.llmReply = () => ({ opener: 'It is Sunday.\nThe thread is trust.', subjects: ['One', 'Two', 'Three'], preview: 'pv' });
await db.Draft.create({ format: 'hey_rube', status: 'published', title: 'Hey Rube.', body: 'Your dashboard is a mood ring.', go_deeper: 'G | https://g.example | why\nLook up: x' });
r = await call(digest, { dry: true });
assert(r.pieces === 4 && r.body.includes('mood ring') && r.body.includes('https://g.example') && r.subjects.length === 3, 'digest built');
assert(r.body.indexOf('mood ring') > r.body.indexOf('pit gate'), 'Hey Rubes come last');
