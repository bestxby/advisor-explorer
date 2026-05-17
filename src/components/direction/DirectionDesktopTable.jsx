import DirectionDetail from './DirectionDetail';
import { CompetitionHeatBadge, DifficultyDots, RecommendationBadge } from './DirectionBadges';

function DirectionDesktopRow({
  direction,
  expanded,
  highlighted,
  onToggle,
  onKeyDown,
}) {
  return (
    <>
      <tr
        data-animate="direction-row"
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        aria-controls={`direction-detail-desktop-${direction.id}`}
        onClick={() => onToggle(direction.id)}
        onKeyDown={(event) => onKeyDown(event, direction.id)}
        className={`
          cursor-pointer transition-all duration-200
          ${
            highlighted
              ? 'bg-primary/5 hover:bg-primary/10'
              : 'bg-[#0f1629] hover:bg-[#1f2940]/50'
          }
        `}
      >
        <td className="p-4">
          <div className="flex items-center gap-3">
            {highlighted && <div className="w-1 h-10 bg-primary rounded-full" />}
            <div>
              <span className="font-bold text-slate-100 font-heading">
                {direction.code}. {direction.name}
              </span>
              <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                {direction.otherTeams.split('、').slice(0, 2).join('、')}等
              </p>
            </div>
          </div>
        </td>
        <td className="p-4">
          <DifficultyDots level={direction.difficulty} />
        </td>
        <td className="p-4">
          <span className="font-medium text-slate-300">
            {direction.jobMarket}
          </span>
        </td>
        <td className="p-4">
          <span className="font-semibold text-primary">{direction.salaryCeiling}</span>
        </td>
        <td className="p-4">
          <CompetitionHeatBadge heat={direction.competitionHeat} />
        </td>
        <td className="p-4">
          <RecommendationBadge level={direction.recommendation} />
        </td>
      </tr>
      {expanded && (
        <tr>
          <td id={`direction-detail-desktop-${direction.id}`} colSpan="6" className="p-0">
            <DirectionDetail direction={direction} />
          </td>
        </tr>
      )}
    </>
  );
}

export default function DirectionDesktopTable({
  directions,
  expandedId,
  highlightedDirection,
  onToggle,
  onKeyDown,
}) {
  return (
    <div className="hidden lg:block overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-[#111a2e] to-[#0f1629] border-b border-[#2a3550]">
            <th className="text-left p-4 font-semibold text-slate-300 text-xs uppercase tracking-wider">
              方向
            </th>
            <th className="text-left p-4 font-semibold text-slate-300 text-xs uppercase tracking-wider">
              难度
            </th>
            <th className="text-left p-4 font-semibold text-slate-300 text-xs uppercase tracking-wider">
              就业面
            </th>
            <th className="text-left p-4 font-semibold text-slate-300 text-xs uppercase tracking-wider">
              薪资天花板
            </th>
            <th className="text-left p-4 font-semibold text-slate-300 text-xs uppercase tracking-wider">
              竞争热度
            </th>
            <th className="text-left p-4 font-semibold text-slate-300 text-xs uppercase tracking-wider">
              推荐
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1e2a40]">
          {directions.map((direction) => (
            <DirectionDesktopRow
              key={direction.id}
              direction={direction}
              expanded={expandedId === direction.id}
              highlighted={highlightedDirection === direction.id}
              onToggle={onToggle}
              onKeyDown={onKeyDown}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
