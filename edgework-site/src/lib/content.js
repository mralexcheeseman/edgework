import { base44 } from '@/api/base44Client';

// The public site only ever reads what has been stamped published.
// Drafts stay in Owl Farm, the private newsroom.
const PUBLISHED = { status: 'published' };

const list = async (entity, sort, limit = 100) => {
  const page = await base44.entities[entity].filter(PUBLISHED, { sort, limit });
  return page.items || [];
};

export const listPositions = () => list('Position', 'number');
export const listEssays = () => list('Essay', '-published_on');
export const listDispatches = () => list('Dispatch', '-published_on');
export const listProjects = () => list('Project', 'order');

export const getDispatch = async (slug) => {
  const page = await base44.entities.Dispatch.filter({ ...PUBLISHED, slug }, { limit: 1 });
  return (page.items || [])[0] || null;
};

export const ARENAS = {
  marketing: { label: 'Marketing orthodoxy', short: 'The marketing machine' },
  ai: { label: 'AI and work', short: 'AI and work' },
  judgement: { label: 'Independent judgement', short: 'Judgement' },
};

export const FORMATS = {
  dispatch: 'Dispatch',
  hey_rube: 'Hey Rube',
  routine: 'Routine',
  expense_report: 'Expense report',
  essay: 'Essay',
};

export const fileNo = (n) => String(n ?? 0).padStart(3, '0');

export const longDate = (iso) =>
  iso
    ? new Date(`${iso}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';
