import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const RELATIONS = ['supports', 'challenges', 'extends'];

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const payload = await req.json();
    const sourceId = typeof payload?.source_item_id === 'string' ? payload.source_item_id.trim() : '';
    if (!sourceId) {
      return Response.json({ error: 'source_item_id is required' }, { status: 400 });
    }

    const sourceRes = await base44.entities.SourceItem.filter({ id: sourceId }, { limit: 1 });
    const source = (sourceRes?.items || [])[0];
    if (!source) {
      return Response.json({ error: 'Source item not found' }, { status: 404 });
    }

    const positionsRes = await base44.entities.Position.list({ sort: 'number', limit: 100 });
    const positions = positionsRes?.items || [];
    if (!positions.length) {
      return Response.json({ created: 0, note: 'No positions recorded yet.' });
    }

    const existingRes = await base44.entities.Collision.filter({ source_item: sourceId }, { limit: 50 });
    const existing = (existingRes?.items || []).map((c) => c.position);

    const catalogue = positions
      .map((p) => `id=${p.id} | #${p.number} [${p.arena}] ${p.statement}${p.status === 'edit' ? ' (under revision)' : ''}`)
      .join('\n');

    const prompt = `You are the collision engine inside Owl Farm, a private newsroom for one writer, Alex.

A source item has arrived:
TITLE: ${source.title || ''}
THINKER: ${source.thinker || 'unknown'}
PUBLISHED: ${source.published_at || 'unknown'}
SUMMARY: ${source.summary || ''}
CORE CLAIM: ${source.core_claim || ''}
QUOTE: ${source.quote || ''}

Alex holds these positions:
${catalogue}

Find the positions this source item genuinely collides with, meaning it SUPPORTS, CHALLENGES or EXTENDS them. Only real, specific collisions about the substance of the position; ignore loose thematic overlap. Return at most 5, most interesting first. Never return a position id from this list of ids already collided: ${existing.join(', ') || 'none'}.

Return JSON only, in this shape:
{"collisions": [{"position_id": "the id from the catalogue", "relation": "supports | challenges | extends", "why": "one or two sentences, addressed to Alex as 'you' (never by name or in the third person), naming the specific friction or reinforcement"}]}`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          collisions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                position_id: { type: 'string' },
                relation: { type: 'string', enum: RELATIONS },
                why: { type: 'string' },
              },
              required: ['position_id', 'relation', 'why'],
            },
          },
        },
        required: ['collisions'],
      },
    });

    const valid = new Map(positions.map((p) => [String(p.id), p]));
    const found = Array.isArray(result?.collisions) ? result.collisions : [];
    const records = [];
    for (const item of found.slice(0, 5)) {
      const position = valid.get(String(item?.position_id || ''));
      if (!position || existing.includes(position.id)) continue;
      records.push({
        source_item: sourceId,
        position: position.id,
        relation: RELATIONS.includes(item?.relation) ? item.relation : 'extends',
        why: String(item?.why || '').slice(0, 1000),
        status: 'new',
      });
    }

    if (!records.length) {
      return Response.json({ created: 0, note: 'No new collisions found.' });
    }

    await base44.entities.Collision.bulkCreate(records);
    return Response.json({ created: records.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}