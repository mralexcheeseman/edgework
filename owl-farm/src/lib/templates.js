// Edgework templates for The Typewriter. Sizes are the exported PNG dimensions.
export const TEMPLATES = [
  { key: 'dispatch', label: 'Dispatch', width: 1080, height: 1350, size: '1080x1350' },
  { key: 'hey_rube', label: 'Hey Rube', width: 1080, height: 1350, size: '1080x1350' },
  { key: 'expense_report', label: 'Expense report', width: 1080, height: 1350, size: '1080x1350' },
  { key: 'essay', label: 'Essay cover', width: 1080, height: 1350, size: '1080x1350' },
  { key: 'routine', label: 'Routine (Reel)', width: 1080, height: 1920, size: '1080x1920' },
];

export const FORMAT_LABELS = {
  dispatch: 'Dispatch',
  hey_rube: 'Hey Rube',
  expense_report: 'Expense report',
  essay: 'Essay',
  routine: 'Routine',
};

export const templateOf = (key) => TEMPLATES.find((t) => t.key === key) || TEMPLATES[0];
