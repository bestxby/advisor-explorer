import DirectionDetail from './DirectionDetail';
import { CompetitionHeatBadge, DifficultyDots, RecommendationBadge } from './DirectionBadges';

function DirectionMobileCard({
  direction,
  expanded,
  highlighted,
  onToggle,
  onKeyDown,
}) {
  return (
    <div
      data-animate="direction-row"
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      aria-controls={`direction-detail-mobile-${direction.id}`}
      className={`
        rounded-xl border-2 transition-all duration-200 cursor-pointer
        ${
          highlighted
            ? 'border-primary shadow-md ring-4 ring-primary/10'
            : 'border-[#2a3550] hover:border-[#3d4f6f] hover:shadow-sm hover:shadow-black/30'
        }
      `}
      onClick={() => onToggle(direction.id)}
      onKeyDown={(event) => onKeyDown(event, direction.id)}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-xs font-bold text-slate-500 mb-1 block">
              {direction.code}
            </span>
            <h3 className="font-bold text-slate-100 font-heading text-lg">
              {direction.name}
            </h3>
          </div>
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
              expanded
                ? 'bg-primary text-white rotate-180'
                : 'bg-[#111a2e] text-slate-400'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-xs text-slate-400 block mb-1">难度</span>
            <DifficultyDots level={direction.difficulty} />
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-1">推荐</span>
            <RecommendationBadge level={direction.recommendation} />
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-1">
              就业面
            </span>
            <span className="font-medium text-slate-100">
              {direction.jobMarket}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-1">薪资</span>
            <span className="font-medium text-primary">{direction.salaryCeiling}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-[#2a3550]">
          <CompetitionHeatBadge heat={direction.competitionHeat} prefix="竞争：" />
        </div>
      </div>

      {expanded && (
        <div id={`direction-detail-mobile-${direction.id}`}>
          <DirectionDetail direction={direction} />
        </div>
      )}
    </div>
  );
}

export default function DirectionMobileList({
  directions,
  expandedId,
  highlightedDirection,
  onToggle,
  onKeyDown,
}) {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 lg:hidden">
      {directions.map((direction) => (
        <DirectionMobileCard
          key={direction.id}
          direction={direction}
          expanded={expandedId === direction.id}
          highlighted={highlightedDirection === direction.id}
          onToggle={onToggle}
          onKeyDown={onKeyDown}
        />
      ))}
    </div>
  );
}
