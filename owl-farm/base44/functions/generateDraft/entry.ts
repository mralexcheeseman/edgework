import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const FORMATS = ['dispatch', 'hey_rube', 'expense_report', 'essay', 'routine'];

// What each Edgework format is. These match the Typewriter templates.
function formatBrief(format) {
  switch (format) {
    case 'hey_rube':
      return `a HEY RUBE: one provocation, a single sentence of at most 25 words that a smart reader would argue with or repeat. The body is that sentence plus at most two short sentences that sharpen it. Title: "Hey Rube."`;
    case 'expense_report':
      return `an EXPENSE REPORT list post: the argument told as 4 to 6 line items an organisation has "spent" on the problem, each written as "item — cost", where the cost is a short wry amount (a duration, "the answer", "unaccounted", "£0.00"). Finish with a line "TOTAL — " and a short verdict. One item per line in the body, nothing else. The deck names what the expense was claimed against, for example "Claimed against: the five-year plan."`;
    case 'essay':
      return 'an ESSAY of 800 to 1,200 words: one clear claim, the evidence, the strongest objection answered, and a practical next step for the reader. The deck is the one-sentence argument.';
    case 'routine':
      return 'a ROUTINE: a 60 to 90 second spoken talk script, 150 to 220 words, written for the ear. First line is the hook and must stand alone. One idea only. Short sentences, one per line. No headings. It ends on a line people would repeat.';
    default:
      return 'a DISPATCH: a short filed column of 250 to 400 words. Open on something concrete, make one argument, end on the line worth repeating.';
  }
}

const QUALITY_BAR = `Quality bar (all must hold):
- A clear enemy: the false belief or habit being argued against.
- A clear consequence for the reader, and a reason it matters now.
- A line people would repeat. Return it as "pull" and wrap the 2 to 4 words that carry it in *asterisks* so it can be highlighted.
- Evidence, or say plainly that it is Alex's view; never invent statistics, studies or quotes.

Voice: Alex Cheeseman. UK English. Plain, concrete, first person where natural. A sharp dinner guest who has read widely. No hype, no consultant filler, no rhetorical questions in a row, no lists of three for rhythm, no em dashes, and never the construction "It's not X, it's Y" or "Not X, but Y".`;

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const payload = await req.json();
    const reaction = String(payload?.reaction || '').trim().slice(0, 2000);
    if (!reaction) {
      return Response.json({ error: 'A reaction is required before anything can be drafted.' }, { status: 400 });
    }

    const format = FORMATS.includes(payload?.format) ? payload.format : 'dispatch';
    const originType = payload?.origin_type === 'collision' ? 'collision' : 'spark';
    const originText = String(payload?.origin_text || '').slice(0, 6000);
    const lensIds = Array.isArray(payload?.lens_ids) ? payload.lens_ids.slice(0, 3).map(String) : [];

    let lensLines = '';
    if (lensIds.length) {
      const res = await base44.entities.Thinker.filter({ id: { $in: lensIds } }, { limit: 3 });
      const items = res?.items || [];
      lensLines = items
        .map((t, i) => `- ${['Primary lens (gives the argument its shape)', 'Contrast lens (gives it tension)', 'Third lens'][i]}: ${t.name}${t.cluster ? ` (${t.cluster})` : ''}${t.core_position ? `, known for: ${t.core_position}` : ''}`)
        .join('\n');
    }

    const prompt = `You are the drafting desk inside Owl Farm, the private newsroom behind Edgework, Alex Cheeseman's publication.

Alex's own reaction is the spine of the piece. Build the argument from it; do not replace it with a different argument.
THE MATERIAL (${originType}):
${originText}

ALEX'S REACTION: ${reaction}

Where the material includes lines Alex highlighted from the piece, treat them as the evidence: quote them exactly and credit the writer. Never invent quotes or figures.
${lensLines ? `THINKER LENSES. Use them as ways of seeing, never as people to summarise or imitate:\n${lensLines}\nThe final angle is always Alex's: what this means for marketing, media, AI and how people actually behave.` : 'No thinker lenses selected.'}

Write ${formatBrief(format)}

${QUALITY_BAR}

Return JSON only: {"title": "specific headline, max 70 characters", "deck": "one sentence", "pull": "the repeatable line with *the key phrase* in asterisks", "body": "the piece, paragraphs or lines separated by newlines"}`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          deck: { type: 'string' },
          pull: { type: 'string' },
          body: { type: 'string' },
        },
        required: ['title', 'deck', 'pull', 'body'],
      },
    });

    return Response.json({
      title: String(result?.title || '').slice(0, 200),
      deck: String(result?.deck || '').slice(0, 400),
      pull: String(result?.pull || '').slice(0, 400),
      body: String(result?.body || ''),
      format,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
