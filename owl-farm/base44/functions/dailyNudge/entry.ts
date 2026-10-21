import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

// The daily nudge: emails Alex the day's routine with links, then checks Owl Farm
// itself to see what's been done and nags until it is. Runs from "The daily nudge"
// workflow at 07:30, 12:30, 18:30 and 21:30 London time. The morning email always
// goes; the later ones only go when a step is still open.
// POST { dry: true } returns the email instead of sending it; { slot } forces a slot.

const APP = 'https://owl-farm-notes.base44.app';
const LINKS = {
  wire: `${APP}/`,
  desk: `${APP}/desk`,
  typewriter: `${APP}/typewriter`,
  cutup: `${APP}/cut-up`,
  archive: `${APP}/archive`,
  positions: `${APP}/positions`,
  thinkers: `${APP}/thinkers`,
  edgework: 'https://edge-work-vault.base44.app',
  lastAnimal: 'https://thelastanimal.base44.app',
  ledger: 'https://app.notion.com/p/3ff58b5148c4816fba94f3d91c7dc351',
  routine: 'https://docs.google.com/document/d/1gikugQ1lH_wYqYDRVcQObTYvu3IeZxAYU5rOnohq720/edit',
};

// Edgework tokens (design repo brands/edgework/tokens.json): ink, ink-2, ink-3, red, sheet, line.
const C = { ink: '#121110', ink2: '#4a4640', ink3: '#6b655b', red: '#c4211a', sheet: '#fbf8f0', line: '#d9d0bd' };

const items = (res) => (Array.isArray(res) ? res : res?.items || []);
const londonDay = (d) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(d);
const londonHour = (d) => Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour: '2-digit', hourCycle: 'h23' }).format(d));
const londonWeekday = (d) => new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'long' }).format(d);
// Entity dates come back as UTC without a zone.
const when = (s) => new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(s || '') ? s : `${s}Z`);
const dayOf = (s) => (s ? londonDay(when(s)) : '');

function slotFor(hour) {
  if (hour < 11) return 'morning';
  if (hour < 16) return 'midday';
  if (hour < 20) return 'evening';
  return 'last';
}

function streakFrom(days, today, doneToday) {
  const set = new Set(days);
  let n = 0;
  const d = new Date(`${today}T12:00:00Z`);
  if (!doneToday) d.setUTCDate(d.getUTCDate() - 1);
  while (set.has(d.toISOString().slice(0, 10))) {
    n += 1;
    d.setUTCDate(d.getUTCDate() - 1);
  }
  return n;
}

// Telegram: TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID secrets. Messages use Telegram's HTML subset.
async function telegram(method, body) {
  const token = Deno.env.get('TELEGRAM_BOT_TOKEN');
  if (!token) return { ok: false, description: 'No TELEGRAM_BOT_TOKEN secret.' };
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body || {}),
  });
  return res.json();
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function row(done, label, minutes, href, how) {
  const mark = done
    ? `<span style="color:${C.ink3}">&#10003;</span>`
    : `<span style="color:${C.red}">&#9744;</span>`;
  const title = done
    ? `<s style="color:${C.ink3}">${esc(label)}</s>`
    : `<a href="${href}" style="color:${C.ink};font-weight:700">${esc(label)}</a> <span style="color:${C.ink3}">(${minutes})</span>`;
  return `<tr><td style="padding:10px 12px 10px 0;vertical-align:top;font-size:18px">${mark}</td><td style="padding:10px 0;border-bottom:1px solid ${C.line}">${title}${done ? '' : `<div style="color:${C.ink2};font-size:14px;margin-top:4px">${how}</div>`}</td></tr>`;
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

    // Setup: after Alex messages the bot, list the chats it has seen so TELEGRAM_CHAT_ID can be set.
    if (payload?.telegram_setup) {
      const updates = await telegram('getUpdates', {});
      const chats = new Map();
      for (const u of updates?.result || []) {
        const chat = u.message?.chat;
        if (chat?.type === 'private') chats.set(chat.id, [chat.first_name, chat.last_name, chat.username && `@${chat.username}`].filter(Boolean).join(' '));
      }
      const me = await telegram('getMe', {});
      return Response.json({ bot: me?.result?.username || null, ok: updates?.ok, error: updates?.description, chats: [...chats].map(([id, name]) => ({ id, name })) });
    }

    const db = base44.asServiceRole.entities;
    const now = new Date();
    const today = londonDay(now);
    const weekday = londonWeekday(now);
    const isFriday = weekday === 'Friday';
    const slot = payload?.slot || slotFor(londonHour(now));

    const [collisions, drafts, assets, sparks] = await Promise.all([
      db.Collision.list({ sort: '-updated_date', limit: 200 }),
      db.Draft.list({ sort: '-updated_date', limit: 200 }),
      db.Asset.list({ sort: '-created_date', limit: 200 }),
      db.Spark.list({ sort: '-created_date', limit: 50 }),
    ]).then((all) => all.map(items));

    // What's been done today, read from Owl Farm itself.
    const draftedToday = drafts.filter((d) => dayOf(d.created_date) === today);
    const desk = draftedToday.length > 0;
    const wire = desk || collisions.some((c) => dayOf(c.updated_date) === today && (c.status === 'kept' || c.status === 'killed'));
    const shippedDays = [
      ...assets.map((a) => dayOf(a.created_date)),
      ...drafts.filter((d) => d.status === 'exported' || d.status === 'published').map((d) => dayOf(d.updated_date)),
    ];
    const typewriter = shippedDays.includes(today);
    const waiting = collisions.filter((c) => c.status === 'new').length;
    const filedRecently = collisions.filter((c) => now.getTime() - when(c.created_date).getTime() < 48 * 3600 * 1000).length;
    const streak = streakFrom(shippedDays, today, typewriter);

    // Friday extras: one longer piece this week, and a cut-up session today.
    const weekStart = new Date(now.getTime() - 4 * 86400 * 1000);
    const longPiece = drafts.some((d) => (d.format === 'essay' || d.format === 'routine') && when(d.created_date) >= weekStart);
    const cutUp = sparks.some((s) => s.origin === 'cut-up' && dayOf(s.created_date) === today);

    const open = [!wire && 'the Wire', !desk && 'the Desk', !typewriter && 'the Typewriter', isFriday && !longPiece && 'the longer piece'].filter(Boolean);
    const doneCount = [wire, desk, typewriter].filter(Boolean).length;

    if (slot !== 'morning' && open.length === 0) {
      return Response.json({ sent: false, reason: 'All done today.', slot, streak });
    }

    const streakLine = streak > 0 ? `${streak} day${streak === 1 ? '' : 's'} in a row` : 'no streak yet';
    const subjects = {
      morning: isFriday ? `Edgework · Friday: the daily three, then the weekly thirty` : `Edgework · today's three steps, about 15 minutes`,
      midday: doneCount === 0 ? `Edgework · not started yet, 15 minutes will do it` : `Edgework · ${doneCount} of 3 done, next: ${open[0]}`,
      evening: `Edgework · still to do: ${open.join(', ')}`,
      last: `Edgework · last call today (${streakLine})`,
    };
    const intros = {
      morning: `${waiting} collision${waiting === 1 ? '' : 's'} waiting on the Wire. One reaction, one draft, one card.`,
      midday: doneCount === 0 ? 'Nothing done yet today. Start with the Wire: one collision, one line.' : `Good start. Next up is ${open[0]}.`,
      evening: `Still open: ${open.join(', ')}. A Hey Rube is the quickest way through the Desk.`,
      last: `This is the last reminder today. ${open.length === 1 ? `Only ${open[0]} left.` : `Still open: ${open.join(', ')}.`} A Hey Rube and one card keeps the streak.`,
    };

    const warnings = [];
    if (filedRecently === 0) {
      warnings.push(`The Wire hasn't filed anything in 48 hours. Press <a href="${LINKS.wire}" style="color:${C.red}">Run the wire now</a>; if it stays empty, log a piece by hand and ask Claude to check the dailyWire logs.`);
    }

    const steps = [
      row(wire, '1. The Wire', '5 min', LINKS.wire, 'Kill, keep, or write one line under "What do you think?" and take one collision to the Desk.'),
      row(desk, '2. The Desk', '7 min', LINKS.desk, 'Say what you think, pick a shape, Write the draft. Check the editor\'s note and any red quote warnings.'),
      row(typewriter, '3. The Typewriter', '3 min', LINKS.typewriter, 'Pick the draft and a template, Export PNG, post it, then Mark published.'),
    ];
    const friday = isFriday
      ? `<h3 style="font-size:13px;letter-spacing:.16em;text-transform:uppercase;margin:28px 0 4px">Friday, 30 minutes</h3><table style="border-collapse:collapse;width:100%">${[
          row(longPiece, 'One longer piece', '15 min', LINKS.desk, 'An Essay or Routine from the week\'s best collision. Essays go on The Last Animal.'),
          row(cutUp, 'Cut-up', '5 min', LINKS.cutup, 'Cut it up a few times and keep any line that surprises you as a Spark.'),
          row(false, 'Publish to Edgework', '5 min', LINKS.edgework, 'Ask Claude to publish this week\'s published drafts as Dispatches.'),
          row(false, 'Positions', '5 min', LINKS.ledger, 'Rewrite one Position marked "edit" in the ledger.'),
        ].join('')}</table>`
      : '';

    const body = `<div style="background:${C.sheet};color:${C.ink};font-family:'Courier Prime','Courier New',monospace;font-size:16px;line-height:1.55;padding:28px;max-width:560px">
<div style="font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:${C.ink3}">Owl Farm · ${esc(weekday)} ${esc(today)} · ${esc(streakLine)}</div>
<p style="margin:16px 0 8px">${esc(intros[slot])}</p>
${warnings.map((w) => `<p style="margin:8px 0;color:${C.red}">${w}</p>`).join('')}
<table style="border-collapse:collapse;width:100%">${steps.join('')}</table>
${friday}
<p style="margin:28px 0 0;font-size:13px;color:${C.ink2}">The full routine: <a href="${LINKS.routine}" style="color:${C.ink2}">Edgework: the daily routine</a> · <a href="${LINKS.archive}" style="color:${C.ink2}">Archive</a> · <a href="${LINKS.edgework}" style="color:${C.ink2}">Edgework</a></p>
<p style="margin:8px 0 0;font-size:13px;color:${C.ink3}">Reminders stop for the day once all three steps are done.</p>
</div>`;

    const subject = subjects[slot];

    const tgRow = (done, label, minutes, href) => (done ? `✅ <s>${esc(label)}</s>` : `⬜ <a href="${href}"><b>${esc(label)}</b></a> (${minutes})`);
    const tgLines = [
      `<b>${esc(subject)}</b>`,
      esc(intros[slot]),
      ...(filedRecently === 0 ? [`⚠️ The Wire hasn't filed anything in 48 hours. <a href="${LINKS.wire}">Run the wire now</a>.`] : []),
      '',
      tgRow(wire, '1. The Wire', '5 min', LINKS.wire),
      tgRow(desk, '2. The Desk', '7 min', LINKS.desk),
      tgRow(typewriter, '3. The Typewriter', '3 min', LINKS.typewriter),
      ...(isFriday
        ? ['', '<b>Friday</b>', tgRow(longPiece, 'One longer piece', '15 min', LINKS.desk), tgRow(cutUp, 'Cut-up', '5 min', LINKS.cutup), tgRow(false, 'Publish to Edgework', '5 min', LINKS.edgework), tgRow(false, 'Positions', '5 min', LINKS.ledger)]
        : []),
      '',
      `<i>${esc(streakLine)}</i>`,
    ];
    const tgText = tgLines.join('\n');

    if (payload?.dry) return Response.json({ sent: false, dry: true, slot, subject, body, tgText, wire, desk, typewriter, streak, waiting });

    // Telegram first; a failure there must never stop the email.
    let telegramStatus = 'not set up';
    const chatId = Deno.env.get('TELEGRAM_CHAT_ID');
    if (chatId && Deno.env.get('TELEGRAM_BOT_TOKEN')) {
      try {
        const r = await telegram('sendMessage', { chat_id: chatId, text: tgText, parse_mode: 'HTML', disable_web_page_preview: true });
        telegramStatus = r?.ok ? 'sent' : `failed: ${r?.description}`;
      } catch (err) {
        telegramStatus = `failed: ${err.message}`;
      }
    }

    const to = Deno.env.get('NUDGE_EMAIL') || admin?.email;
    if (!to) return Response.json({ error: 'Set the NUDGE_EMAIL secret.' }, { status: 500 });

    await base44.asServiceRole.integrations.Core.SendEmail({ to, subject, body, from_name: 'Owl Farm' });
    return Response.json({ sent: true, telegram: telegramStatus, slot, subject, open, streak });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
