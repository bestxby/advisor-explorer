import RoadmapIcon from './RoadmapIcon';
import RoadmapMilestone from './RoadmapMilestone';
import RoadmapTask from './RoadmapTask';

export default function RoadmapPhase({
  phase,
  phaseIndex,
  colors,
  expanded,
  onToggle,
}) {
  return (
    <div className="relative">
      <div
        className={`absolute left-3 top-6 w-5 h-5 rounded-full ${colors.bg} ring-4 ${colors.ring} hidden md:block z-10`}
      />

      <div className="md:ml-14">
        <button
          type="button"
          onClick={() => onToggle(phaseIndex)}
          className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer min-w-0 overflow-hidden ${
            expanded
              ? `${colors.border} ${colors.light}`
              : 'border-[#2a3550] hover:border-[#3d4f6f] hover:bg-[#1f2940]/50'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0 overflow-hidden">
            <span
              className={`flex-shrink-0 w-8 h-8 rounded-lg ${colors.bg} text-white flex items-center justify-center text-sm font-bold`}
            >
              {phaseIndex + 1}
            </span>
            <div className="text-left min-w-0 overflow-hidden">
              <span
                className={`font-bold text-lg ${expanded ? colors.text : 'text-slate-200'} block truncate`}
              >
                {phase.period}
              </span>
              <span className="text-slate-500 text-sm truncate block">
                {phase.subtitle}
              </span>
            </div>
          </div>
          <RoadmapIcon
            type="chevron"
            className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </button>

        {expanded && (
          <div className="mt-3 ml-2 space-y-2 overflow-hidden animate-fadeIn">
            {phase.tasks.map((task, taskIndex) => (
              <RoadmapTask key={`${phase.period}-${taskIndex}`} task={task} />
            ))}
            <RoadmapMilestone milestone={phase.milestone} colors={colors} />
          </div>
        )}
      </div>
    </div>
  );
}
