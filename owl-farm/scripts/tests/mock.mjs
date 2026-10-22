// Mock Base44 SDK + Deno + fetch for running Owl Farm functions under node.
export const state = globalThis.__state ||= { tables: {}, sent: [], calls: [], llm: [], emails: [], env: {}, llmReply: () => ({}) };
globalThis.__n ||= 0; const nextN = () => ++globalThis.__n;
const id = () => (nextN()).toString(16).padStart(24, 'a');
function table(name) {
  const rows = (state.tables[name] ||= []);
  const match = (r, q) => Object.entries(q).every(([k, v]) => (v && typeof v === 'object' && v.$in ? v.$in.includes(r[k]) : r[k] === v));
  const sortBy = (arr, sort) => {
    if (!sort) return arr;
    const desc = sort.startsWith('-'); const k = sort.replace('-', '');
    return [...arr].sort((a, b) => String(a[k] ?? '').localeCompare(String(b[k] ?? '')) * (desc ? -1 : 1));
  };
  return {
    list: async (o = {}) => ({ items: sortBy(rows, o.sort).slice(0, o.limit || 999) }),
    filter: async (q, o = {}) => ({ items: sortBy(rows.filter((r) => match(r, q)), o.sort).slice(0, o.limit || 999) }),
    get: async (i) => { const r = rows.find((x) => x.id === i); if (!r) throw new Error(`${name} ${i} not found`); return r; },
    create: async (d) => { const r = { id: id(), created_date: new Date().toISOString().slice(0, 19), updated_date: new Date().toISOString().slice(0, 19), ...d }; rows.push(r); return r; },
    bulkCreate: async (ds) => Promise.all(ds.map((d) => table(name).create(d))),
    update: async (i, d) => { const r = rows.find((x) => x.id === i); Object.assign(r, d, { updated_date: new Date().toISOString().slice(0, 19) }); return r; },
    delete: async (i) => { const k = rows.findIndex((x) => x.id === i); rows.splice(k, 1); },
  };
}
const entities = new Proxy({}, { get: (_, k) => table(k) });
export function createClientFromRequest() {
  return {
    auth: { me: async () => { throw new Error('no user'); } },
    entities,
    asServiceRole: {
      entities,
      integrations: { Core: {
        InvokeLLM: async (a) => { state.llm.push(a); return state.llmReply(a); },
        SendEmail: async (a) => { state.emails.push(a); return {}; },
      } },
    },
  };
}
globalThis.Deno = { env: { get: (k) => state.env[k] } };
globalThis.fetch = async (url, init = {}) => {
  url = String(url);
  const body = init.body ? JSON.parse(init.body) : null;
  state.calls.push({ url, body, headers: init.headers });
  const json = (d, ok = true) => ({ ok, status: ok ? 200 : 500, json: async () => d, text: async () => JSON.stringify(d) });
  if (url.includes('api.telegram.org')) { state.sent.push({ method: url.split('/').pop(), ...body }); return json({ ok: true, result: { message_id: 1 } }); }
  if (url.includes('/functions/generateDraft')) return json({ title: 'T', deck: 'D', pull: '*p*', body: `Body for ${body.format}: ${body.reaction}`, go_deeper: [{ title: 'G', url: 'https://g.example', why: 'w' }], look_up: ['X: y'], caption: 'cap', warnings: [] });
  if (url.includes('/functions/dailyNudge')) return json({ tgText: 'status text' });
  if (url.includes('readwise.io')) return json(state.readwise);
  if (state.pages && state.pages[url]) return { ok: true, status: 200, text: async () => state.pages[url], json: async () => ({}) };
  return { ok: false, status: 404, text: async () => '', json: async () => ({}) };
};
