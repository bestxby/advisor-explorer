import { getPhaseColors } from '../../utils/roadmapPresentation';
import RoadmapPhase from './RoadmapPhase';

export default function RoadmapTimeline({ phases, expandedPhase, onTogglePhase }) {
  return (
    <div className="mt-8 relative">
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-[#2a3550] hidden md:block" />

      <div className="space-y-4">
        {phases.map((phase, phaseIndex) => (
          <RoadmapPhase
            key={`${phase.period}-${phaseIndex}`}
            phase={phase}
            phaseIndex={phaseIndex}
            colors={getPhaseColors(phaseIndex)}
            expanded={expandedPhase === phaseIndex}
            onToggle={onTogglePhase}
          />
        ))}
      </div>
    </div>
  );
}
