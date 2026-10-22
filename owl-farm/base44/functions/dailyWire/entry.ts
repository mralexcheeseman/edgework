import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

// The 6am Wire: pull Alex's new Readwise highlights and new posts from active thinkers'
// feeds, then find where each one collides with Alex's Positions. Keeps at most MAX_COLLISIONS new collisions per run.
// Runs from the scheduled workflow (with the OWL_WIRE_KEY secret) or from an admin's
// "Run the wire now" button.

const RELATIONS = ['supports', 'challenges', 'extends'];
const LOOKBACK_HOURS = 72;
const MAX_PER_FEED = 3;
const MAX_SOURCES = 15;
const MAX_COLLISIONS = 10;

const items = (res) => (Array.isArray(res) ? res : res?.items || []);
const clip = (s, n) => (String(s || '').length > n ? `${String(s).slice(0, n - 1)}…` : String(s || ''));

const decode = (s) =>
  String(s || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#8217;|&rsquo;/g, "'")
    .replace(/&#8220;|&#8221;|&ldquo;|&rdquo;/g, '"')
    .replace(/&#[0-9]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const tag = (block, names) => {
  for (const name of names) {
    const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'i'));
    if (m) return m[1];
  }
  return '';
};

function parseFeed(xml) {
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) || [];
  return blocks.map((block) => {
    let link = decode(tag(block, ['link']));
    if (!link) {
      const href = block.match(/<link[^>]*href="([^"]+)"/i);
      link = href ? href[1] : '';
    }
    const date = decode(tag(block, ['pubDate', 'published', 'updated', 'dc:date']));
    return {
      author: decode(tag(block, ['dc:creator', 'author', 'name'])),
      title: decode(tag(block, ['title'])),
      url: link,
      published: date ? new Date(date) : null,
      text: decode(tag(block, ['content:encoded', 'description', 'summary', 'content'])).slice(0, 1800),
    };
  });
}

// Full article text, so the synopsis rests on the piece and not the feed's teaser.
const PAYWALL = /(this post is for paid subscribers|subscribe to (continue|read)|paid subscribers only|become a (paid )?member|members[- ]only|log in to read|sign in to read|to continue reading|premium content|you('|’)ve reached your limit|unlock this (article|story))/i;

async function articleText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (OwlFarm private reader)' }, redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  let html = await res.text();
  const walled = PAYWALL.test(html);
  html = html.replace(/<(script|style|noscript|nav|header|footer|aside|form)[\s\S]*?<\/\1>/gi, ' ');
  const article = html.match(/<article[\s\S]*?<\/article>/i)?.[0] || html.match(/<main[\s\S]*?<\/main>/i)?.[0] || html;
  const paras = (article.match(/<(p|h2|h3|li|blockquote)[^>]*>[\s\S]*?<\/\1>/gi) || []).map(decode).filter((t) => t.length > 40);
  const text = paras.join('\n');
  // A paywall notice with little text in front of it means we only saw the teaser.
  if (walled && text.length < 4000) throw new Error('paywalled');
  return text.slice(0, 14000);
}

const READ_BRIEF = `Read it like an editor briefing a columnist who hasn't read it.
- summary: 3 to 5 plain sentences. What is the argument, what evidence, example or story does it rest on, and what does it imply? Name specifics (numbers, companies, people) where the piece gives them. No filler like "the author explores".
- core_claim: one sentence.
- quote: the single most quotable sentence, copied exactly.
- lines: up to 5 sentences copied exactly from the text that a columnist would want to underline. Never paraphrase these.`;

const READ_SCHEMA = {
  summary: { type: 'string' },
  core_claim: { type: 'string' },
  quote: { type: 'string' },
  lines: { type: 'array', items: { type: 'string' } },
};

async function fullOrFeed(url, fallback) {
  try {
    const text = await articleText(url);
    // Short blogs (Seth Godin) are complete at a few hundred words; paywalls are caught above.
    if (text.length >= 800) return { text, full: true };
  } catch (_) {
    // fall back to the feed text
  }
  return { text: fallback, full: false };
}

// Alex's own Readwise highlights (books, articles, podcasts, anything he saved), via the
// READWISE_TOKEN secret (readwise.io/access_token). The strongest signal the Wire gets,
// because he chose every line, and it covers writers who have no free feed.
const MAX_READWISE = 8;

async function readwiseBooks(sinceMs) {
  const token = Deno.env.get('READWISE_TOKEN');
  if (!token) return [];
  const books = [];
  let cursor = null;
  let pages = 0;
  do {
    const u = new URL('https://readwise.io/api/v2/export/');
    u.searchParams.set('updatedAfter', new Date(sinceMs).toISOString());
    if (cursor) u.searchParams.set('pageCursor', cursor);
    const res = await fetch(u, { headers: { Authorization: `Token ${token}` } });
    if (!res.ok) throw new Error(`Readwise HTTP ${res.status}`);
    const data = await res.json();
    books.push(...(data.results || []));
    cursor = data.nextPageCursor;
    pages += 1;
  } while (cursor && pages < 3);
  return books
    .map((b) => ({
      book: b,
      fresh: (b.highlights || []).filter((h) => !h.is_deleted && h.text && new Date(h.highlighted_at || h.created_at || 0).getTime() >= sinceMs),
    }))
    .filter((x) => x.fresh.length && x.fresh.reduce((n, h) => n + h.text.length, 0) >= 80)
    .slice(0, MAX_READWISE);
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json().catch(() => ({}));

    let allowed = false;
    try {
      const user = await base44.auth.me();
      allowed = user?.role === 'admin';
    } catch (_) {
      allowed = false;
    }
    const key = Deno.env.get('OWL_WIRE_KEY');
    if (!allowed && key && payload?.key === key) allowed = true;
    if (!allowed) return Response.json({ error: 'Forbidden' }, { status: 403 });

    const db = base44.asServiceRole.entities;
    const thinkers = items(await db.Thinker.filter({ active: true }, { limit: 200 })).filter((t) => t.feed_url);
    const positions = items(await db.Position.list({ sort: 'number', limit: 200 }));
    if (!positions.length) return Response.json({ sources: 0, collisions: 0, note: 'No positions yet.' });

    const since = Date.now() - LOOKBACK_HOURS * 3600 * 1000;
    const fresh = [];
    const feedErrors = [];

    for (const thinker of thinkers.sort((a, b) => (a.tier || 3) - (b.tier || 3))) {
      if (fresh.length >= MAX_SOURCES) break;
      try {
        const res = await fetch(thinker.feed_url, { headers: { 'User-Agent': 'OwlFarm/1.0 (+private reader)' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const recent = parseFeed(await res.text())
          .filter((e) => e.title && e.url && (!e.published || isNaN(e.published) || e.published.getTime() >= since));
        // Shared feeds (Collab Fund) carry several writers. When the feed has no author
        // field, read the page's <meta name="author"> byline instead (a plain text match
        // is useless: every Collab Fund page names Housel in its sidebar).
        const entries = [];
        let bylineChecks = 0;
        for (const e of recent) {
          if (entries.length >= MAX_PER_FEED) break;
          const want = (thinker.feed_author || '').toLowerCase();
          if (!want || e.author.toLowerCase().includes(want)) { entries.push(e); continue; }
          if (e.author || bylineChecks >= 12) continue;
          bylineChecks += 1;
          try {
            const page = await fetch(e.url, { headers: { 'User-Agent': 'OwlFarm/1.0 (+private reader)' } });
            const byline = page.ok ? ((await page.text()).match(/<meta\s+name="author"\s+content="([^"]*)"/i)?.[1] || '') : '';
            if (byline.toLowerCase().includes(want)) entries.push(e);
          } catch (_) { /* skip pages that won't load */ }
        }
        for (const entry of entries) {
          if (fresh.length >= MAX_SOURCES) break;
          const seen = items(await db.SourceItem.filter({ url: entry.url }, { limit: 1 }));
          if (seen.length) continue;
          fresh.push({ thinker, entry });
        }
      } catch (err) {
        feedErrors.push(`${thinker.name}: ${err.message}`);
      }
    }

    const catalogue = positions
      .map((p) => `id=${p.id} | #${p.number} [${p.arena}] conviction ${p.conviction || 3}/5 | ${p.statement}`)
      .join('\n');
    const byId = new Map(positions.map((p) => [String(p.id), p]));
    const candidates = [];

    // Read a piece and find where it collides with the Positions. `lead` says what the text is.
    const readAndCollide = (lead, title, text) =>
      base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `You read for Alex Cheeseman, who writes Edgework. ${lead}

TITLE: ${title}
TEXT:
${text}

First, ${READ_BRIEF}

Then, against Alex's positions below, return only real collisions, where the piece genuinely SUPPORTS, CHALLENGES or EXTENDS the substance of a position. Loose topical overlap is not a collision, and nor is a piece that merely mentions the same subject. Rate each one's strength from 1 to 5 honestly; most pieces deserve none. Return at most 2. "why" is one sentence, addressed to Alex as "you", naming the specific friction or reinforcement.

POSITIONS:
${catalogue}`,
        response_json_schema: {
          type: 'object',
          properties: {
            ...READ_SCHEMA,
            collisions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  position_id: { type: 'string' },
                  relation: { type: 'string', enum: RELATIONS },
                  why: { type: 'string' },
                  strength: { type: 'number', description: '1 (weak) to 5 (unmissable)' },
                },
                required: ['position_id', 'relation', 'why'],
              },
            },
          },
          required: ['summary', 'core_claim', 'collisions'],
        },
      });

    const addCandidates = (result, sourceId, minStrength, bonus) => {
      for (const c of (result?.collisions || []).slice(0, 2)) {
        const position = byId.get(String(c?.position_id || ''));
        if (!position || (Number(c?.strength) || 0) < minStrength) continue;
        const relation = RELATIONS.includes(c?.relation) ? c.relation : 'extends';
        const score = (Number(c?.strength) || 3) + (position.conviction || 3) + (relation === 'challenges' ? 1 : 0) + bonus;
        candidates.push({ score, record: { source_item: sourceId, position: position.id, relation, why: String(c?.why || '').slice(0, 600), status: 'new' } });
      }
    };

    // Readwise first: Alex's highlights clear a lower bar (strength 3) and rank higher.
    let highlighted = 0;
    let readwiseError = null;
    try {
      for (const { book, fresh: lines } of await readwiseBooks(since)) {
        const url = book.source_url || book.unique_url || `https://readwise.io/bookreview/${book.user_book_id}`;
        const author = book.author || '';
        const highlightTexts = lines.map((h) => String(h.text).slice(0, 600));
        const notes = lines.filter((h) => h.note).map((h) => `- On "${clip(h.text, 80)}", Alex noted: ${h.note}`);
        const existing = items(await db.SourceItem.filter({ url }, { limit: 1 }))[0];
        const known = new Set(existing?.highlights || []);
        const newLines = highlightTexts.filter((t) => !known.has(t));
        if (!newLines.length) continue;
        // Articles are read in full where possible; books and podcasts rest on the highlights.
        const article = book.category === 'articles' && book.source_url ? await fullOrFeed(book.source_url, '') : { text: '', full: false };
        const text = [
          `LINES ALEX HIGHLIGHTED (he chose these):\n${newLines.map((t) => `- "${t}"`).join('\n')}`,
          notes.length ? `HIS NOTES:\n${notes.join('\n')}` : '',
          article.full ? `THE FULL PIECE:\n${article.text}` : '',
        ].filter(Boolean).join('\n\n');
        const kind = { books: 'a book', articles: 'an article', podcasts: 'a podcast', tweets: 'a post' }[book.category] || 'a piece';
        const result = await readAndCollide(`Alex highlighted these lines in ${kind}${author ? ` by ${author}` : ''} in Readwise. Find collisions in what he highlighted.`, book.title, text);
        const fields = {
          highlights: [...(existing?.highlights || []), ...newLines].slice(-30),
          summary: String(result?.summary || existing?.summary || '').slice(0, 1500),
          core_claim: String(result?.core_claim || existing?.core_claim || '').slice(0, 500),
          quote: String(result?.quote || existing?.quote || '').slice(0, 500),
          lines: article.full ? (result?.lines || []).map((l) => String(l).slice(0, 400)).slice(0, 5) : existing?.lines || [],
          read_full: article.full || !!existing?.read_full,
        };
        const source = existing
          ? { ...existing, ...(await db.SourceItem.update(existing.id, fields)) }
          : await db.SourceItem.create({ title: String(book.title || 'Untitled').slice(0, 300), url, thinker: author.slice(0, 120), ...fields });
        addCandidates(result, existing?.id || source.id, 3, 1);
        highlighted += 1;
      }
    } catch (err) {
      readwiseError = err.message;
    }

    let skipped = 0;
    for (const { thinker, entry } of fresh) {
      const { text, full } = await fullOrFeed(entry.url, entry.text);
      // Only file pieces Alex can actually read: skip paywalled or blocked articles.
      if (!full) {
        // Remember it, so tomorrow's run doesn't fetch it again.
        await db.SourceItem.create({ title: entry.title.slice(0, 300), url: entry.url, thinker: thinker.name, read_full: false, lines: [] });
        skipped += 1;
        continue;
      }
      const result = await readAndCollide(`Here is a new piece by ${thinker.name}.`, entry.title, text);

      const source = await db.SourceItem.create({
        title: entry.title.slice(0, 300),
        url: entry.url,
        thinker: thinker.name,
        published_at: entry.published && !isNaN(entry.published) ? entry.published.toISOString().slice(0, 10) : undefined,
        summary: String(result?.summary || '').slice(0, 1500),
        core_claim: String(result?.core_claim || '').slice(0, 500),
        quote: String(result?.quote || '').slice(0, 500),
        lines: full ? (result?.lines || []).map((l) => String(l).slice(0, 400)).slice(0, 5) : [],
        read_full: full,
      });

      addCandidates(result, source.id, 4, 0);
    }

    const keep = candidates.sort((a, b) => b.score - a.score).slice(0, MAX_COLLISIONS).map((c) => c.record);
    if (keep.length) await db.Collision.bulkCreate(keep);

    // Older items filed from feed teasers get a proper read too (a few per run).
    let reread = 0;
    const older = items(await db.SourceItem.list({ sort: '-created_date', limit: 40 })).filter((s) => s.read_full === undefined || s.read_full === null).filter((s) => s.url);
    for (const s of older.slice(0, 8)) {
      const { text, full } = await fullOrFeed(s.url, [s.summary, s.core_claim, s.quote].filter(Boolean).join('\n'));
      const r = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `A piece by ${s.thinker || 'unknown'}: "${s.title}".\n\n${READ_BRIEF}\n\nTEXT:\n${text}`,
        response_json_schema: { type: 'object', properties: READ_SCHEMA, required: ['summary', 'core_claim', 'lines'] },
      });
      await db.SourceItem.update(s.id, {
        summary: String(r?.summary || s.summary || '').slice(0, 1500),
        core_claim: String(r?.core_claim || s.core_claim || '').slice(0, 500),
        quote: String(r?.quote || s.quote || '').slice(0, 500),
        lines: full ? (r?.lines || []).map((l) => String(l).slice(0, 400)).slice(0, 5) : [],
        read_full: full,
      });
      reread += 1;
    }

    return Response.json({ feeds: thinkers.length, readwise: highlighted, readwise_error: readwiseError, sources: fresh.length - skipped, skipped_paywalled: skipped, collisions: keep.length, reread, feed_errors: feedErrors });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
