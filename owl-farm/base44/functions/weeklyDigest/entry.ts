import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

// The Sunday letter. Gathers the week's published pieces into one email Alex can paste into
// Beehiiv (Beehiiv only lets people press send, so this stops at a ready-to-paste letter).
// Also asks for last week's numbers: posts without reach figures are listed with links.
// Runs from "The Sunday letter" workflow at 17:00 London time. { dry: true } returns it unsent.

const APP = 'https://owl-farm-notes.base44.app';
const BEEHIIV = 'https://app.beehiiv.com/posts/new';
// Edgework tokens (design repo brands/edgework/tokens.json): ink, ink-2, ink-3, red, sheet, line.
const C = { ink: '#121110', ink2: '#4a4640', ink3: '#6b655b', red: '#c4211a', sheet: '#fbf8f0', line: '#d9d0bd' };
const LABEL = { dispatch: 'Dispatch', hey_rube: 'Hey Rube', expense_report: 'Expense Report', essay: 'Essay', routine: 'Routine' };

const items = (res) => (Array.isArray(res) ? res : res?.items || []);
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const when = (s) => new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(s || '') ? s : `${s}Z`);
const paras = (t) => String(t || '').split(/\n{2,}|\n(?=\S)/).map((p) => p.trim()).filter(Boolean);

async function telegram(text) {
  const token = Deno.env.get('TELEGRAM_BOT_TOKEN');
  const chat_id = Deno.env.get('TELEGRAM_CHAT_ID');
  if (!token || !chat_id) return;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id, text, parse_mode: 'HTML', disable_web_page_preview: true }),
  });
}

function links(goDeeper) {
  return String(goDeeper || '')
    .split('\n')
    .map((l) => l.split('|').map((x) => x.trim()))
    .filter((p) => p[1]?.startsWith('http'))
    .map(([title, url, why]) => ({ title, url, why }));
}

function pieceHtml(d) {
  const label = `<div style="font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:${C.red};margin-top:32px">${esc(LABEL[d.format] || d.format)}</div>`;
  if (d.format === 'hey_rube') {
    return `${label}<p style="font-size:22px;line-height:1.35;font-weight:700;margin:8px 0">${esc(d.body)}</p>${d.deck ? `<p style="color:${C.ink2};margin:0">${esc(d.deck)}</p>` : ''}`;
  }
  return `${label}<h2 style="font-size:22px;margin:8px 0 4px">${esc(d.title)}</h2>${d.deck ? `<p style="color:${C.ink2};font-style:italic;margin:0 0 12px">${esc(d.deck)}</p>` : ''}${paras(d.body)
    .map((p) => `<p style="margin:0 0 12px">${esc(p)}</p>`)
    .join('')}`;
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json().catch(() => ({}));
    let admin = null;
    try {
      const user = await base44.auth.me();
      if (user?.role === 'admin') admin = user;
    } catch (_) {
      admin = null;
    }
    const key = Deno.env.get('OWL_WIRE_KEY');
    if (!admin && !(key && payload?.key === key)) return Response.json({ error: 'Forbidden' }, { status: 403 });

    const db = base44.asServiceRole.entities;
    const now = Date.now();
    const drafts = items(await db.Draft.list({ sort: '-updated_date', limit: 200 }));
    const week = drafts.filter((d) => ['published', 'exported'].includes(d.status) && now - when(d.updated_date).getTime() < 7 * 86400 * 1000);
    // Last week's posts that are old enough to have numbers but don't yet.
    const needStats = drafts.filter((d) => d.status === 'published' && d.reach == null && now - when(d.updated_date).getTime() >= 6 * 86400 * 1000).slice(0, 8);
    const to = Deno.env.get('NUDGE_EMAIL') || admin?.email;

    const statsBlock = needStats.length
      ? `<p style="margin:24px 0 6px;font-weight:700">Last week's numbers</p><p style="margin:0 0 6px;color:${C.ink2}">Add reach and reactions to these so the monthly review can see what lands:</p><ul style="margin:0;padding-left:20px">${needStats
          .map((d) => `<li><a href="${APP}/archive?draft=${d.id}" style="color:${C.ink}">${esc(d.title || d.body?.slice(0, 60))}</a></li>`)
          .join('')}</ul>`
      : '';

    if (!week.length) {
      const body = `<div style="background:${C.sheet};color:${C.ink};font-family:'Courier Prime','Courier New',monospace;font-size:16px;line-height:1.55;padding:28px;max-width:600px"><p>Nothing was published this week, so there's no letter to send. One card on Monday restarts it.</p>${statsBlock}</div>`;
      if (payload?.dry) return Response.json({ dry: true, pieces: 0, body });
      if (to) await base44.asServiceRole.integrations.Core.SendEmail({ to, subject: 'Edgework · no Sunday letter this week', body, from_name: 'Owl Farm' });
      await telegram(`No Sunday letter this week: nothing was published. One card on Monday restarts it.${needStats.length ? `\n\n${needStats.length} post${needStats.length === 1 ? '' : 's'} still need their numbers: <a href="${APP}/archive">Archive</a>.` : ''}`);
      return Response.json({ sent: true, pieces: 0 });
    }

    // Longer pieces lead; Hey Rubes close the letter as a run of one-liners.
    const order = { essay: 0, routine: 1, dispatch: 2, expense_report: 3, hey_rube: 4 };
    week.sort((a, b) => (order[a.format] ?? 5) - (order[b.format] ?? 5));

    const intro = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `Write the opening of Alex Cheeseman's weekly Edgework email, in his voice: British, plain, dry, concrete, "I" and "you", no em dashes, no hype, no exclamation marks, no "Not X, but Y". Readers may not have seen any of the pieces, so never refer to things they can't see.

This week's pieces:
${week.map((d) => `- ${LABEL[d.format]}: "${d.title}". ${d.deck || ''} Pull line: ${String(d.pull || '').replace(/\*/g, '')}`).join('\n')}

Return JSON: opener (3 to 5 sentences: one concrete image, then the thread that runs through this week's pieces), subjects (three subject lines under 50 characters, specific, no clickbait), preview (one line of preview text under 90 characters).`,
      response_json_schema: {
        type: 'object',
        properties: { opener: { type: 'string' }, subjects: { type: 'array', items: { type: 'string' } }, preview: { type: 'string' } },
        required: ['opener', 'subjects', 'preview'],
      },
    });

    const seen = new Set();
    const reading = week
      .flatMap((d) => links(d.go_deeper))
      .filter((l) => (seen.has(l.url) ? false : seen.add(l.url)))
      .slice(0, 5);

    const letter = `<div style="font-family:Georgia,serif;font-size:17px;line-height:1.6;color:${C.ink}">
${paras(intro?.opener).map((p) => `<p style="margin:0 0 12px">${esc(p)}</p>`).join('')}
${week.map(pieceHtml).join('\n')}
${reading.length ? `<div style="font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:${C.red};margin-top:32px">Go deeper</div><ul style="padding-left:20px">${reading.map((l) => `<li style="margin-bottom:8px"><a href="${l.url}" style="color:${C.ink}">${esc(l.title)}</a>${l.why ? `. ${esc(l.why)}` : ''}</li>`).join('')}</ul>` : ''}
<p style="margin-top:32px">Reply and tell me where I'm wrong. I read every one.</p>
<p>Alex</p>
</div>`;

    const subjects = (intro?.subjects || []).slice(0, 3);
    const body = `<div style="background:${C.sheet};color:${C.ink};font-family:'Courier Prime','Courier New',monospace;font-size:15px;line-height:1.55;padding:28px;max-width:640px">
<p style="margin:0 0 6px;font-weight:700">Your Sunday letter is ready.</p>
<ol style="margin:0 0 6px;padding-left:20px;color:${C.ink2}">
<li>Open <a href="${BEEHIIV}" style="color:${C.red}">a new Beehiiv post</a>.</li>
<li>Copy everything inside the box below and paste it in.</li>
<li>Pick a subject line, read it once on your phone, then send or schedule it for Monday 07:00.</li>
</ol>
<p style="margin:12px 0 4px"><b>Subject lines:</b></p><ul style="margin:0;padding-left:20px">${subjects.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
<p style="margin:8px 0 0"><b>Preview text:</b> ${esc(intro?.preview || '')}</p>
${statsBlock}
<div style="background:#fff;border:1px solid ${C.line};padding:24px;margin-top:24px">${letter}</div>
</div>`;

    if (payload?.dry) return Response.json({ dry: true, pieces: week.length, subjects, preview: intro?.preview, body });
    if (!to) return Response.json({ error: 'Set the NUDGE_EMAIL secret.' }, { status: 500 });
    await base44.asServiceRole.integrations.Core.SendEmail({ to, subject: `Edgework · your Sunday letter is ready (${week.length} piece${week.length === 1 ? '' : 's'})`, body, from_name: 'Owl Farm' });
    await telegram(
      `<b>Your Sunday letter is ready</b>\n${week.length} piece${week.length === 1 ? '' : 's'} from this week, an opener and the best Go deeper links are in your inbox. Paste it into <a href="${BEEHIIV}">Beehiiv</a> and schedule it for Monday 07:00.${needStats.length ? `\n\n${needStats.length} post${needStats.length === 1 ? '' : 's'} still need their numbers (links in the email).` : ''}`,
    );
    return Response.json({ sent: true, pieces: week.length, subjects });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
