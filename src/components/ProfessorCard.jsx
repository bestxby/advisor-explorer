import { useCallback, useState } from 'react';
import useCardPointerGlow from '../hooks/useCardPointerGlow';
import useMeasuredExpansion from '../hooks/useMeasuredExpansion';
import { COLLEGE_COLORS, DEFAULT_COLLEGE_COLORS } from './professors/collegeColors';
import ProfessorCardBody from './professors/ProfessorCardBody';
import ProfessorDirectionTags from './professors/ProfessorDirectionTags';
import ProfessorHeader from './professors/ProfessorHeader';

function getCollegeColors(professor) {
  const collegeKey = `${professor.university} · ${professor.department}`;
  return COLLEGE_COLORS[collegeKey] || DEFAULT_COLLEGE_COLORS;
}

export default function ProfessorCard({ professor, isHighlighted }) {
  const [expanded, setExpanded] = useState(false);
  const { cardRef, handleMouseMove } = useCardPointerGlow();
  const { contentRef, contentHeight } = useMeasuredExpansion(expanded);
  const colors = getCollegeColors(professor);

  const toggleExpanded = useCallback(() => {
    setExpanded((current) => !current);
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`
        group relative border-2 rounded-2xl transition-all duration-300 ease-out card-glow card-glow-track tech-corner-ticks
        ${
          isHighlighted
            ? 'neon-gradient-border shadow-lg shadow-cyan-500/10 ring-4 ring-cyan-500/10'
            : 'border-[#2a3550] hover:border-blue-500/20 hover:shadow-md shadow-black/30 hover:shadow-blue-500/5'
        }
        bg-[#0f1629] overflow-hidden
      `}
    >
      <div className="corner-tick-bottom" />

      <button
        onClick={toggleExpanded}
        className="w-full text-left p-4 cursor-pointer focus:outline-none group"
        aria-expanded={expanded}
      >
        <ProfessorHeader professor={professor} colors={colors} expanded={expanded} />
        <ProfessorDirectionTags directions={professor.realDirections} />
      </button>

      <div
        ref={contentRef}
        className="overflow-hidden transition-[max-height] duration-500 ease-out"
        style={{ maxHeight: expanded ? `${contentHeight}px` : '0px' }}
      >
        <ProfessorCardBody professor={professor} />
      </div>
    </div>
  );
}
