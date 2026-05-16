import useRoadmap from '../../hooks/useRoadmap';
import RoadmapHeader from './RoadmapHeader';
import RoadmapResources from './RoadmapResources';
import RoadmapTimeline from './RoadmapTimeline';

export default function RoadmapSection({ directionId, directionName }) {
  const { roadmap, expandedPhase, togglePhase } = useRoadmap(directionId);
  if (!roadmap) return null;

  return (
    <div className="bg-white dark:bg-[#0f1629] rounded-2xl border border-gray-100 dark:border-[#2a3550] shadow-sm dark:shadow-black/30 overflow-hidden card-glow">
      <div className="p-8 md:p-10">
        <RoadmapHeader directionName={directionName} />
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
