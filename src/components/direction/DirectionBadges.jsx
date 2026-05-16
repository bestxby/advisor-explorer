import {
  getCompetitionHeatClassName,
  getDifficultyDotClassName,
  getRecommendationClassName,
} from '../../utils/directionPresentation';

export function DifficultyDots({ level, max = 5 }) {
  return (
    <div className="flex items-center gap-1" role="img" aria-label={`难度 ${level}/${max}`}>
      {Array.from({ length: max }, (_, index) => (
        <div
          key={index}
          className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${getDifficultyDotClassName(
            index,
            level,
          )}`}
        />
      ))}
    </div>
  );
}

export function RecommendationBadge({ level }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getRecommendationClassName(
        level,
      )}`}
      aria-label={`推荐 ${level}/5`}
    >
      {'★'.repeat(level)}
    </span>
  );
}

export function CompetitionHeatBadge({ heat, prefix = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getCompetitionHeatClassName(
        heat,
      )}`}
    >
      {prefix}
      {heat}
    </span>
  );
}
