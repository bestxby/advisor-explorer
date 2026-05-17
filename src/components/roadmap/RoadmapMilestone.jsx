import RoadmapIcon from './RoadmapIcon';

export default function RoadmapMilestone({ milestone, colors }) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg ${colors.light} border ${colors.border} mt-4 min-w-0 overflow-hidden`}
    >
      <RoadmapIcon
        type="milestone"
        className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`}
      />
      <div className="min-w-0 overflow-hidden">
        <span className={`text-xs font-bold ${colors.text} uppercase tracking-wide`}>
          阶段目标
        </span>
        <p className="text-slate-300 text-sm mt-1 leading-relaxed break-words">
          {milestone}
        </p>
      </div>
    </div>
  );
}
