import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

// Learn from edits. Compares what the Desk wrote (original_body) with what Alex kept, finds
// the patterns in his changes, and proposes up to four rules for the Desk. Each rule goes to
// Telegram with Adopt / Reject buttons (handled by telegramHook); adopted rules are added to
// every new draft by generateDraft. Runs on Sundays from the "Learn from edits" workflow.
// Needs three edited drafts it hasn't seen; POST { force: true } runs it on fewer,
// { dry: true } returns the proposals without saving or sending anything.

const MODEL = 'claude_opus_5_5';
const MIN_PAIRS = 3;

const items = (res) => (Array.isArray(res) ? res : res?.items || []);
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const words = (t) => String(t || '').toLowerCase().match(/[a-z'’]+/g) || [];
// Share of the Desk's words still in Alex's version (the same measure the draft editor shows).
function keptShare(original, final) {
  const a = words(original);
  if (!a.length) return 1;
  const left = new Map();
  for (const w of words(final)) left.set(w, (left.get(w) || 0) + 1);
  let same = 0;
  for (const w of a) if (left.get(w)) { same += 1; left.set(w, left.get(w) - 1); }
  return same / a.length;
}

async function telegram(method, body) {
  const token = Deno.env.get('TELEGRAM_BOT_TOKEN');
  if (!token) return { ok: false };
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body || {}),
  });
  return res.json();
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json().catch(() => ({}));
    let allowed = false;
    try {
      allowed = (await base44.auth.me())?.role === 'admin';
    } catch (_) {
      allowed = false;
    }
    const key = Deno.env.get('OWL_WIRE_KEY');
    if (!allowed && !(key && payload?.key === key)) return Response.json({ error: 'Forbidden' }, { status: 403 });

    const db = base44.asServiceRole.entities;
    const drafts = items(await db.Draft.list({ sort: '-updated_date', limit: 100 }));
    const pairs = drafts.filter(
      (d) => d.original_body && !d.lesson_checked && ['edited', 'exported', 'published'].includes(d.status) && d.body && d.body.trim() !== d.original_body.trim(),
    );
    const shares = pairs.map((d) => keptShare(d.original_body, d.body));
    const average = shares.length ? Math.round((100 * shares.reduce((a, b) => a + b, 0)) / shares.length) : null;
    if (pairs.length < MIN_PAIRS && !payload?.force) {
      return Response.json({ proposed: 0, pairs: pairs.length, note: `Waiting for ${MIN_PAIRS} edited drafts; ${pairs.length} so far.` });
    }
    if (!pairs.length) return Response.json({ proposed: 0, pairs: 0, note: 'No edited drafts to learn from.' });

    const known = items(await db.VoiceNote.list({ sort: '-created_date', limit: 100 }));
    const clip = (s) => String(s).slice(0, 3000);
    const examples = pairs
      .slice(0, 8)
      .map((d, i) => `EXAMPLE ${i + 1} (${d.format})\nTHE DESK WROTE:\nTitle: ${d.original_title || ''}\n${clip(d.original_body)}\n\nALEX'S VERSION:\nTitle: ${d.title || ''}\n${clip(d.body)}`)
      .join('\n\n---\n\n');

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      model: MODEL,
      prompt: `You study how a writer edits drafts written for him, so the drafting tool can write closer to what he wants next time.

Below are drafts the tool wrote for Alex Cheeseman, a British writer, and the versions he kept after editing them. Compare each pair closely: what did he cut, add, reorder, soften, sharpen or reword?

Find the PATTERNS that hold across more than one example, not one-off fixes to content. Then write up to four rules for the drafting tool. Each rule:
- is one imperative sentence the tool can follow ("Cut the first paragraph when it explains the source before the scene.");
- is specific to what Alex actually did, with a short before/after taken from the examples as evidence;
- is not already covered by the rules below (adopted or rejected);
- concerns style, structure or word choice, never a particular topic.
Return fewer rules, or none, rather than weak ones.

RULES ALREADY ADOPTED OR REJECTED:
${known.length ? known.map((n) => `- [${n.status}] ${n.rule}`).join('\n') : '(none yet)'}

${examples}

Return JSON: summary (two sentences on how Alex edits, addressed to him as "you"), rules (each {rule, evidence}).`,
      response_json_schema: {
        type: 'object',
        properties: {
          summary: { type: 'string' },
          rules: { type: 'array', items: { type: 'object', properties: { rule: { type: 'string' }, evidence: { type: 'string' } }, required: ['rule', 'evidence'] } },
        },
        required: ['summary', 'rules'],
      },
    });

    const rules = (result?.rules || []).slice(0, 4).map((r) => ({ rule: String(r.rule).slice(0, 300), evidence: String(r.evidence).slice(0, 600) }));
    if (payload?.dry) return Response.json({ dry: true, pairs: pairs.length, kept_average: average, summary: result?.summary, rules });

    const saved = [];
    for (const r of rules) saved.push(await db.VoiceNote.create({ ...r, status: 'proposed' }));
    for (const d of pairs) await db.Draft.update(d.id, { lesson_checked: true });

    const chatId = Deno.env.get('TELEGRAM_CHAT_ID');
    if (chatId) {
      await telegram('sendMessage', {
        chat_id: chatId,
        parse_mode: 'HTML',
        text: `<b>What your edits taught the Desk</b>\n${pairs.length} drafts compared. You kept ${average}% of the Desk's words on average (higher means it's getting closer).\n\n${esc(result?.summary || '')}${saved.length ? '\n\nAdopt the rules you agree with; every new draft follows them.' : '\n\nNo new rules this time.'}`,
      });
      for (const n of saved) {
        await telegram('sendMessage', {
          chat_id: chatId,
          parse_mode: 'HTML',
          text: `<b>${esc(n.rule)}</b>\n<i>${esc(n.evidence)}</i>`,
          reply_markup: { inline_keyboard: [[{ text: '✅ Adopt', callback_data: `vadopt:${n.id}` }, { text: '✖ Reject', callback_data: `vreject:${n.id}` }]] },
        });
      }
    }
    return Response.json({ proposed: saved.length, pairs: pairs.length, kept_average: average, summary: result?.summary });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
