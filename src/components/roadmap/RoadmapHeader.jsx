import RoadmapIcon from './RoadmapIcon';

export default function RoadmapHeader({ directionName }) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
        <RoadmapIcon
          type="roadmap"
          className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
          strokeWidth={1.5}
        />
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 font-heading">
          行动路线图
        </h3>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          针对「{directionName}」方向的个性化时间线
        </p>
      </div>
    </div>
  );
}
