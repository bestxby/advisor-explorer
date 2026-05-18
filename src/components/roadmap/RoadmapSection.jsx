import useRoadmap from '../../hooks/useRoadmap';
import RoadmapHeader from './RoadmapHeader';
import RoadmapResources from './RoadmapResources';
import RoadmapTimeline from './RoadmapTimeline';
import ExportButton from '../ExportButton';

export default function RoadmapSection({
  directionId,
  directionName,
  results,
  directions,
  professors,
  onReset,
}) {
  const { roadmap, expandedPhase, togglePhase } = useRoadmap(directionId);
  if (!roadmap) return null;

  return (
    <div className="bg-[#0f1629] rounded-2xl border border-[#2a3550] shadow-sm shadow-black/30 overflow-hidden card-glow">
      <div className="p-8 md:p-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <RoadmapHeader directionName={directionName} />
          <div className="flex flex-wrap items-center gap-3">
            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#111a2e] text-slate-300 rounded-xl font-semibold border border-[#2a3550] hover:bg-[#2a3550] hover:shadow-sm transition-all duration-200 cursor-pointer text-sm select-none"
              >
                <svg
                  className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                重新进行匹配测评
              </button>
            )}
            {results && (
              <ExportButton
                results={results}
                directions={directions}
                professors={professors}
                filename="advisor-explorer-result"
              />
            )}
          </div>
        </div>
        <RoadmapTimeline
          phases={roadmap.phases}
          expandedPhase={expandedPhase}
          onTogglePhase={togglePhase}
        />
        <RoadmapResources resources={roadmap.resources} />
      </div>
    </div>
  );
}
