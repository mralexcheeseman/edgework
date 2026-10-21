import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

// Drafting desk. Two passes on a strong model: a writer that plans and drafts in Alex's voice,
// then an editor that scores the draft against the checklist and rewrites what fails.
// Voice and craft rules live in the edgework repo: docs/voice.md and docs/craft-playbook.md.

const MODEL = 'claude_opus_5_5';
const FORMATS = ['dispatch', 'hey_rube', 'expense_report', 'essay', 'routine'];

const VOICE = `ALEX'S VOICE (from his best essays; write like Alex on a good day, never like anyone else):
- Opens cold in a concrete scene or fact, often second person, present tense. The argument comes after the scene, never before.
- Short punch after a long sentence: one to four words on its own line ("Not anymore.").
- The two-beat reframe: old belief, then the sharper picture, in two short sentences ("Trust didn't disappear. It went sideways.").
- History as the lens (the handshake, the pit gate, two hundred thousand years); the body and the machine (technology moves fast, human nature doesn't).
- Names the room where the mistake gets made ("Right now, in a meeting this week, someone is presenting a dashboard.").
- Dry wit through specifics, not jokes. Cites a thinker in one line to borrow a frame, then gets back to his own argument.
- Ends with a callback to the opening image and a short line that lands like a verdict.
- Paragraphs of one to four sentences; mixes long rolling sentences with very short ones. Talks to "you"; "I" for experience, "we" for the industry or the species.
- Plain, physical, British words. UK spelling.

THREE SHORT PASSAGES OF ALEX'S OWN WRITING (for rhythm only; never reuse them):
"It's 2am. You're standing on a corner in a city you don't know. A car pulls up. You don't know the driver. You open the door, you get in, and you tell him where you live. Your mother spent eighteen years telling you never to do exactly this. She was right, by the way."

"Everybody has a community now. Your toothpaste has a community. Your B2B procurement platform has a community, and it's on Slack, and there are 14 people in it, and 11 of them work at the company. That's not a community. That's an audience with a login."

"I keep thinking about that gasket. Not the part. The feeling. How completely ordinary it was to let a machine do the deciding. I didn't think anything of it. Neither will your customers."`;

const FLOURISH = `PERSONALITY (use two or three of these, never all):
1. One sensory, physical detail the reader can see, hear, taste or touch.
2. One outrageous but exact simile, used once.
3. A bracketed aside that says what the sentence was too polite to say.
4. Repetition as rhythm: the same opening words three times, then break the pattern.
5. A one-sentence confession: Alex does this too, or got it wrong.
6. Dry understatement where others would shout.
These are techniques learned from writers Alex reads (Cole Schafer, Zoe Scaman, Nicholas Carr, Morgan Housel). Never imitate a named writer, never reuse their phrasing, never mention them unless the material does.`;

const BANNED = `NEVER: em dashes or en dashes; "It's not X, it's Y" or "Not X, but Y" or "The question isn't X, it's Y"; consultant words (leverage, unlock, navigate, landscape, ecosystem, game-changer, delve, robust, seamless, in today's fast-paced world); stacked rhetorical questions; hype words; exclamation marks; US spelling; any quote, statistic or study that is not in the material word for word (if it isn't there, make it Alex's view and say so).`;

function recipe(format) {
  switch (format) {
    case 'hey_rube':
      return `a HEY RUBE: one provocation of at most 25 words, built on a concrete noun, that a smart reader would argue with or repeat at work. Body: that sentence, plus at most two short sentences that sharpen it. Title: "Hey Rube."`;
    case 'expense_report':
      return `an EXPENSE REPORT: the argument as 4 to 6 line items an organisation has "spent" on the mistake, each "item: cost", the item a real recognisable expense, the cost short and wry (a duration, "the answer", "unaccounted", "£0.00"). Last line "TOTAL: " and a short verdict. Deck: "Claimed against: ..." naming the belief.`;
    case 'essay':
      return `an ESSAY of 800 to 1,200 words: (1) a historical or personal anecdote with exact detail; (2) the consensus, stated fairly; (3) the counter-thesis as a two-beat reframe; (4) the mechanism, with one named thinker's frame in one line; (5) evidence from the material; (6) the strongest objection, answered; (7) what to do on Monday; (8) a callback ending. Short subheads allowed.`;
    case 'routine':
      return `a ROUTINE: a 60 to 90 second talk script, 150 to 220 words, for the ear, one sentence per line, no headings. (1) Cold open, second person, present tense; (2) three short lines of escalation; (3) the turn, one line; (4) the idea in plain words with one image; (5) a callback to the opening, then the line people repeat.`;
    default:
      return `a DISPATCH of 250 to 400 words: (1) a scene from the news or Alex's life, present tense, two to four sentences; (2) the jab, what is really going on (brackets welcome); (3) Alex's position as a two-beat reframe; (4) one specific piece of evidence from the material, quoted exactly and credited; (5) what it means for the reader this week; (6) a callback to the opening scene, landing on the pull line.`;
  }
}

const DRAFT_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    deck: { type: 'string' },
    pull: { type: 'string' },
    body: { type: 'string' },
  },
  required: ['title', 'deck', 'pull', 'body'],
};

// --- v1: the original single-pass prompt, kept for side-by-side tests. ---
async function draftV1(base44, { format, originType, originText, reaction, lensLines }) {
  const brief = {
    hey_rube: 'a HEY RUBE: one provocation, a single sentence of at most 25 words. Title: "Hey Rube."',
    expense_report: 'an EXPENSE REPORT list post: 4 to 6 line items "item — cost" and a TOTAL line.',
    essay: 'an ESSAY of 800 to 1,200 words: one clear claim, the evidence, the strongest objection answered, and a practical next step.',
    routine: 'a ROUTINE: a 60 to 90 second spoken talk script, 150 to 220 words, short sentences, one per line.',
    dispatch: 'a DISPATCH: a short filed column of 250 to 400 words. Open on something concrete, make one argument, end on the line worth repeating.',
  }[format];
  const prompt = `You are the drafting desk inside Owl Farm. Alex's own reaction is the spine of the piece.
THE MATERIAL (${originType}):\n${originText}\n\nALEX'S REACTION: ${reaction}\n${lensLines}\nWrite ${brief}
Voice: Alex Cheeseman. UK English. Plain, concrete. No em dashes, never "Not X, but Y". Never invent quotes or figures.
Return JSON: {"title","deck","pull" (key phrase in *asterisks*),"body"}`;
  return base44.asServiceRole.integrations.Core.InvokeLLM({ prompt, response_json_schema: DRAFT_SCHEMA });
}

// --- v2: plan, draft, edit. ---
async function draftV2(base44, { format, originType, originText, reaction, lensLines }) {
  const writerPrompt = `You are the drafting desk inside Owl Farm, the private newsroom behind Edgework, Alex Cheeseman's publication. You write first drafts that Alex will edit and publish under his own name.

Alex's reaction is the spine. Build HIS argument from it; never swap in a different argument, and never just summarise the material.

THE MATERIAL (${originType}):
${originText}

ALEX'S REACTION:
${reaction}

${lensLines || 'No thinker lenses selected.'}

${VOICE}

${FLOURISH}

${BANNED}

Write ${recipe(format)}

First plan, then write:
- "angle": the argument in one sentence, in Alex's terms.
- "enemy": the belief or habit being argued against.
- "opening": the concrete scene or fact you will open on (from the material, or an everyday scene anyone would recognise; never invent a news event).
- "callback": how the ending returns to the opening.
Then the piece. The pull is the line people would repeat; wrap its 2 to 4 key words in *asterisks*.

Return JSON only.`;

  const plan = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt: writerPrompt,
    model: MODEL,
    response_json_schema: {
      type: 'object',
      properties: {
        angle: { type: 'string' },
        enemy: { type: 'string' },
        opening: { type: 'string' },
        callback: { type: 'string' },
        ...DRAFT_SCHEMA.properties,
      },
      required: ['angle', 'enemy', 'opening', 'callback', 'title', 'deck', 'pull', 'body'],
    },
  });

  const editorPrompt = `You are Alex Cheeseman's editor. Below is a first draft written in his voice, the material it came from, and his reaction. Score it, then rewrite it so every check passes. Keep what works; cut what doesn't. Keep the same format and length limits: ${recipe(format)}

CHECKS (score each 1 to 5, 5 = excellent):
opening (starts in a concrete scene or fact, no throat-clearing); enemy (names the false belief); stakes (why now, and for whom); line (a sentence people would repeat, used as the pull); voice (sounds like Alex, not like the source's writer or a generic AI); flourish (two or three personality moves, not more); specificity (at least one exact detail); ending (callback or short verdict); banned (none of the banned items); truth (every quote is word for word in the material and credited; every figure is in the material or framed as Alex's view).

${VOICE}

${FLOURISH}

${BANNED}

ALEX'S REACTION: ${reaction}

THE MATERIAL:
${originText}

THE DRAFT:
Title: ${plan?.title}
Deck: ${plan?.deck}
Pull: ${plan?.pull}
Body:
${plan?.body}

Also write three alternative pull lines, each a different angle on the same argument (sharper, funnier, colder), each with its key phrase in *asterisks*, each under 20 words. For a Hey Rube, the alternatives are three complete alternative provocations of at most 25 words.

Return JSON only: the scores (of your revised version), one sentence on the biggest fix you made, the revised title, deck, pull (key phrase in *asterisks*) and body, and the alternatives.`;

  const edited = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt: editorPrompt,
    model: MODEL,
    response_json_schema: {
      type: 'object',
      properties: {
        scores: {
          type: 'object',
          properties: Object.fromEntries(['opening', 'enemy', 'stakes', 'line', 'voice', 'flourish', 'specificity', 'ending', 'banned', 'truth'].map((k) => [k, { type: 'number' }])),
        },
        biggest_fix: { type: 'string' },
        alternatives: { type: 'array', items: { type: 'string' } },
        ...DRAFT_SCHEMA.properties,
      },
      required: ['scores', 'title', 'deck', 'pull', 'body', 'alternatives'],
    },
  });

  return { ...edited, angle: plan?.angle, first_draft: plan?.body };
}

// --- Checks the model can't be trusted to do on its own. ---
const UK = [
  [/\boptimiz/gi, 'optimis'], [/\borganiz/gi, 'organis'], [/\brealiz/gi, 'realis'], [/\brecogniz/gi, 'recognis'],
  [/\bprioritiz/gi, 'prioritis'], [/\bmonetiz/gi, 'monetis'], [/\bcategoriz/gi, 'categoris'], [/\bemphasiz/gi, 'emphasis'],
  [/\banalyz/gi, 'analys'], [/\bbehavior/gi, 'behaviour'], [/\bcolor/gi, 'colour'], [/\bfavorite/gi, 'favourite'],
  [/\bcenter\b/gi, 'centre'], [/\bdefense\b/gi, 'defence'],
];
function tidy(text) {
  let t = String(text || '');
  t = t.replace(/\s*[—–]\s*/g, ', ').replace(/,\s*,/g, ',');
  for (const [re, uk] of UK) t = t.replace(re, (m) => (m[0] === m[0].toUpperCase() ? uk[0].toUpperCase() + uk.slice(1) : uk));
  return t;
}
function quoteWarnings(body, material) {
  const norm = (s) => s.toLowerCase().replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ');
  const src = norm(material);
  const quotes = [...String(body).matchAll(/[“"]([^”"]{25,})[”"]/g)].map((m) => m[1]);
  return quotes.filter((q) => !src.includes(norm(q).replace(/[.,]$/, ''))).map((q) => `Check this quote, it isn't word for word in the source: "${q.slice(0, 90)}${q.length > 90 ? '…' : ''}"`);
}

// Same briefing the Desk builds, for calls that only pass a collision id (tests, workflows).
async function briefingFor(base44, id) {
  const c = await base44.asServiceRole.entities.Collision.get(id);
  const [p, s] = await Promise.all([
    c.position ? base44.asServiceRole.entities.Position.get(c.position) : null,
    c.source_item ? base44.asServiceRole.entities.SourceItem.get(c.source_item) : null,
  ]);
  const parts = [];
  if (p) parts.push(`ALEX'S POSITION #${p.number}: ${p.statement}`);
  parts.push(`HOW THE PIECE COLLIDES WITH IT: it ${c.relation} the position. ${c.why || ''}`);
  if (s) {
    parts.push(`THE PIECE: "${s.title}" by ${s.thinker || 'unknown'}${s.url ? ` (${s.url})` : ''}`);
    if (s.summary) parts.push(`SYNOPSIS: ${s.summary}`);
    if (s.core_claim) parts.push(`CORE CLAIM: ${s.core_claim}`);
    if (s.highlights?.length) parts.push(`LINES ALEX HIGHLIGHTED FROM THE PIECE:\n${s.highlights.map((h) => `- "${h}"`).join('\n')}`);
    if (s.lines?.length) parts.push(`OTHER LINES FROM THE PIECE (exact quotes):\n${s.lines.map((h) => `- "${h}"`).join('\n')}`);
  }
  return parts.join('\n\n');
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json().catch(() => ({}));
    const keyOk = payload?.key && payload.key === Deno.env.get('OWL_WIRE_KEY');
    if (!keyOk) {
      const user = await base44.auth.me();
      if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const reaction = String(payload?.reaction || '').trim().slice(0, 2000);
    if (!reaction) return Response.json({ error: 'A reaction is required before anything can be drafted.' }, { status: 400 });

    const format = FORMATS.includes(payload?.format) ? payload.format : 'dispatch';
    let originType = payload?.origin_type === 'collision' ? 'collision' : 'spark';
    let originText = String(payload?.origin_text || '').slice(0, 9000);
    if (payload?.collision_id) {
      originType = 'collision';
      originText = await briefingFor(base44, String(payload.collision_id));
    }
    const lensIds = Array.isArray(payload?.lens_ids) ? payload.lens_ids.slice(0, 3).map(String) : [];

    let lensLines = '';
    if (lensIds.length) {
      const res = await base44.asServiceRole.entities.Thinker.filter({ id: { $in: lensIds } }, { limit: 3 });
      const items = res?.items || [];
      lensLines =
        'THINKER LENSES (ways of seeing, never people to summarise or imitate):\n' +
        items
          .map((t, i) => `- ${['Primary lens, gives the argument its shape', 'Contrast lens, gives it tension', 'Third lens'][i]}: ${t.name}${t.core_position ? `, known for: ${t.core_position}` : ''}`)
          .join('\n');
    }

    const args = { format, originType, originText, reaction, lensLines };
    const result = payload?.variant === 'v1' ? await draftV1(base44, args) : await draftV2(base44, args);

    const body = tidy(result?.body);
    const warnings = quoteWarnings(body, originText);
    return Response.json({
      title: tidy(result?.title).slice(0, 200),
      deck: tidy(result?.deck).slice(0, 400),
      pull: tidy(result?.pull).slice(0, 400),
      body,
      format,
      scores: result?.scores || null,
      biggest_fix: result?.biggest_fix || '',
      alternatives: (result?.alternatives || []).slice(0, 3).map(tidy),
      angle: result?.angle || '',
      first_draft: payload?.variant === 'v1' ? undefined : result?.first_draft,
      warnings,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
