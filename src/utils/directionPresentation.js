const JOB_COUNT_TONE_CLASSES = {
  strong: {
    mobile: 'bg-emerald-900/30 text-emerald-400',
    table:
      'bg-emerald-900/30 text-emerald-400 border border-emerald-800',
  },
  medium: {
    mobile: 'bg-blue-900/30 text-blue-400',
    table:
      'bg-blue-900/30 text-blue-400 border border-blue-800',
  },
  default: {
    mobile: 'bg-[#111a2e]/50 text-slate-400',
    table:
      'bg-[#111a2e]/50 text-slate-400 border border-[#2a3550]',
  },
};

const STRONG_JOB_COUNTS = new Set(['较多', '丰富']);
const MEDIUM_JOB_COUNTS = new Set(['中等', '增长快']);

const COMPETITION_HEAT_CLASSES = {
  极高: 'bg-red-900/30 text-red-400 border-red-800',
  高: 'bg-orange-900/30 text-orange-400 border-orange-800',
  中高: 'bg-amber-900/30 text-amber-400 border-amber-800',
  中: 'bg-emerald-900/30 text-emerald-400 border-emerald-800',
  低: 'bg-[#111a2e]/50 text-slate-400 border-[#2a3550]',
};

const RECOMMENDATION_CLASSES = {
  5: 'bg-emerald-900/30 text-emerald-400 border-emerald-800',
  4: 'bg-blue-900/30 text-blue-400 border-blue-800',
  3: 'bg-[#111a2e] text-slate-400 border-[#2a3550]',
  2: 'bg-orange-900/30 text-orange-400 border-orange-800',
  1: 'bg-red-900/30 text-red-400 border-red-800',
};

export function getJobCountTone(count) {
  if (STRONG_JOB_COUNTS.has(count)) return 'strong';
  if (MEDIUM_JOB_COUNTS.has(count)) return 'medium';
  return 'default';
}

export function getJobCountClassName(count, variant = 'table') {
  const tone = getJobCountTone(count);
  return JOB_COUNT_TONE_CLASSES[tone][variant] || JOB_COUNT_TONE_CLASSES.default[variant];
}

export function getCompetitionHeatClassName(heat) {
  return COMPETITION_HEAT_CLASSES[heat] || COMPETITION_HEAT_CLASSES['中'];
}

export function getDifficultyDotClassName(index, level) {
  if (index >= level) return 'bg-[#2a3550]';
  if (level >= 4) return 'bg-red-400';
  if (level >= 3) return 'bg-orange-400';
  return 'bg-emerald-400';
}

export function getRecommendationClassName(level) {
  return RECOMMENDATION_CLASSES[level] || RECOMMENDATION_CLASSES[3];
}
