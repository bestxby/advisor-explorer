import { getPriorityClassName, PRIORITY_LABELS } from '../../utils/roadmapPresentation';

export default function RoadmapTask({ task }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-[#111a2e]/50 border border-gray-100 dark:border-[#2a3550] min-w-0 overflow-hidden">
      <span
        className={`flex-shrink-0 mt-0.5 px-2 py-0.5 text-xs font-semibold rounded border ${getPriorityClassName(
          task.priority,
        )}`}
      >
        {PRIORITY_LABELS[task.priority]}
      </span>
      <span className="text-gray-700 dark:text-slate-300 text-sm leading-relaxed break-words">
        {task.text}
      </span>
    </div>
  );
}
