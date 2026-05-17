export const PRIORITY_LABELS = {
  high: '必做',
  medium: '建议',
  low: '可选',
};

const PRIORITY_CLASSES = {
  high: 'bg-red-900/30 text-red-400 border-red-800',
  medium:
    'bg-amber-900/30 text-amber-400 border-amber-800',
  low: 'bg-[#111a2e]/50 text-slate-400 border-[#2a3550]',
};

const PHASE_COLORS = [
  {
    bg: 'bg-blue-500',
    light: 'bg-blue-900/30',
    text: 'text-blue-400',
    border: 'border-blue-800',
    ring: 'ring-blue-900/50',
  },
  {
    bg: 'bg-indigo-500',
    light: 'bg-indigo-900/30',
    text: 'text-indigo-400',
    border: 'border-indigo-800',
    ring: 'ring-indigo-900/50',
  },
  {
    bg: 'bg-purple-500',
    light: 'bg-purple-900/30',
    text: 'text-purple-400',
    border: 'border-purple-800',
    ring: 'ring-purple-900/50',
  },
];

export function getPriorityClassName(priority) {
  return PRIORITY_CLASSES[priority] || PRIORITY_CLASSES.low;
}

export function getPhaseColors(index) {
  return PHASE_COLORS[index % PHASE_COLORS.length];
}
