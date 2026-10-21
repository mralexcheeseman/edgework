import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

// Reads the full article behind a source item and writes a proper synopsis, its core
// claim and the lines worth highlighting. Called from the Wire's "Re-read the piece".

const decode = (s) =>
  String(s || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;|&#8217;|&rsquo;|&lsquo;/g, "'")
    .replace(/&#8220;|&#8221;|&ldquo;|&rdquo;/g, '"')
    .replace(/&#8212;|&mdash;/g, '—')
    .replace(/&#[0-9a-fx]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export async function articleText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (OwlFarm private reader)' }, redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  let html = await res.text();
  const walled = /(this post is for paid subscribers|subscribe to (continue|read)|paid subscribers only|become a (paid )?member|members[- ]only|log in to read|sign in to read|to continue reading|premium content|unlock this (article|story))/i.test(html);
  html = html.replace(/<(script|style|noscript|nav|header|footer|aside|form)[\s\S]*?<\/\1>/gi, ' ');
  const article = html.match(/<article[\s\S]*?<\/article>/i)?.[0] || html.match(/<main[\s\S]*?<\/main>/i)?.[0] || html;
  const paras = (article.match(/<(p|h2|h3|li|blockquote)[^>]*>[\s\S]*?<\/\1>/gi) || []).map(decode).filter((t) => t.length > 40);
  const text = paras.join('\n');
  if (walled && text.length < 4000) throw new Error('paywalled');
  return text.slice(0, 14000);
}

export const READ_SCHEMA = {
  summary: { type: 'string', description: 'Synopsis in 3 to 5 plain sentences: the argument, the evidence or example it rests on, and what it implies' },
  core_claim: { type: 'string', description: 'The core claim in one sentence' },
  quote: { type: 'string', description: 'The single most quotable sentence, copied exactly from the text' },
  lines: { type: 'array', items: { type: 'string' }, description: 'Up to 5 sentences copied exactly from the text that are worth highlighting: sharp claims, telling facts, memorable phrasing' },
};

export const READ_BRIEF = `Read it like an editor briefing a columnist who hasn't read it.
- summary: 3 to 5 plain sentences. What is the argument, what evidence, example or story does it rest on, and what does it imply? Name specifics (numbers, companies, people) where the piece gives them. No filler like "the author explores".
- core_claim: one sentence.
- quote: the single most quotable sentence, copied exactly.
- lines: up to 5 sentences copied exactly from the text that a columnist would want to underline. Never paraphrase these; if the text is only an excerpt, pick from what is there.`;

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { source_item_id } = await req.json();
    const found = await base44.entities.SourceItem.filter({ id: source_item_id }, { limit: 1 });
    const source = (Array.isArray(found) ? found : found?.items || [])[0];
    if (!source) return Response.json({ error: 'Source item not found' }, { status: 404 });

    let text = '';
    let full = false;
    if (source.url) {
      try {
        text = await articleText(source.url);
        full = text.length >= 800;
      } catch (_) {
        text = '';
      }
    }
    if (!full) text = [source.summary, source.core_claim, source.quote].filter(Boolean).join('\n');

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `A piece by ${source.thinker || 'unknown'}: "${source.title}".\n\n${READ_BRIEF}\n\nTEXT:\n${text}`,
      response_json_schema: { type: 'object', properties: READ_SCHEMA, required: ['summary', 'core_claim', 'lines'] },
    });

    const update = {
      summary: String(result?.summary || source.summary || '').slice(0, 1500),
      core_claim: String(result?.core_claim || source.core_claim || '').slice(0, 500),
      quote: String(result?.quote || source.quote || '').slice(0, 500),
      lines: full ? (result?.lines || []).map((l) => String(l).slice(0, 400)).slice(0, 5) : [],
      read_full: full,
    };
    const updated = await base44.entities.SourceItem.update(source.id, update);
    return Response.json({ source: updated, full });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
