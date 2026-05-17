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
}) {
  const { roadmap, expandedPhase, togglePhase } = useRoadmap(directionId);
  if (!roadmap) return null;

  return (
    <div className="bg-[#0f1629] rounded-2xl border border-[#2a3550] shadow-sm shadow-black/30 overflow-hidden card-glow">
      <div className="p-8 md:p-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <RoadmapHeader directionName={directionName} />
          {results && (
            <ExportButton
              results={results}
              directions={directions}
              professors={professors}
              filename="advisor-explorer-result"
            />
          )}
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
