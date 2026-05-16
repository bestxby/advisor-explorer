const JOB_COUNT_TONE_CLASSES = {
  strong: {
    mobile: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
    table:
      'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800',
  },
  medium: {
    mobile: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    table:
      'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800',
  },
  default: {
    mobile: 'bg-gray-50 dark:bg-[#111a2e]/50 text-gray-600 dark:text-slate-400',
    table:
      'bg-gray-50 dark:bg-[#111a2e]/50 text-gray-600 dark:text-slate-400 border border-gray-100 dark:border-[#2a3550]',
  },
};

const STRONG_JOB_COUNTS = new Set(['较多', '丰富']);
const MEDIUM_JOB_COUNTS = new Set(['中等', '增长快']);

const COMPETITION_HEAT_CLASSES = {
  极高: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
  高: 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800',
  中高: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  中: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  低: 'bg-gray-50 dark:bg-[#111a2e]/50 text-gray-600 dark:text-slate-400 border-gray-200 dark:border-[#2a3550]',
};

const RECOMMENDATION_CLASSES = {
  5: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  4: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  3: 'bg-gray-100 dark:bg-[#111a2e] text-gray-600 dark:text-slate-400 border-gray-200 dark:border-[#2a3550]',
  2: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800',
  1: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
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
  if (index >= level) return 'bg-gray-200 dark:bg-[#2a3550]';
  if (level >= 4) return 'bg-red-400';
  if (level >= 3) return 'bg-orange-400';
  return 'bg-emerald-400';
}

export function getRecommendationClassName(level) {
  return RECOMMENDATION_CLASSES[level] || RECOMMENDATION_CLASSES[3];
}
