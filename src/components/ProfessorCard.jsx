import { useCallback, useState } from 'react';
import useCardPointerGlow from '../hooks/useCardPointerGlow';
import useMeasuredExpansion from '../hooks/useMeasuredExpansion';
import { COLLEGE_COLORS, DEFAULT_COLLEGE_COLORS } from './professor/collegeColors';
import ProfessorCardBody from './professor/ProfessorCardBody';
import ProfessorDirectionTags from './professor/ProfessorDirectionTags';
import ProfessorHeader from './professor/ProfessorHeader';

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
        group relative border-2 rounded-2xl transition-all duration-300 ease-out card-glow card-glow-track
        ${
          isHighlighted
            ? 'border-primary shadow-lg shadow-primary/10 ring-4 ring-primary/10 dark:shadow-blue-500/10'
            : 'border-gray-100 dark:border-[#2a3550] hover:border-gray-200 dark:hover:border-blue-500/20 hover:shadow-md dark:shadow-black/30 dark:hover:shadow-blue-500/5'
        }
        bg-white dark:bg-[#131a2b] overflow-hidden
      `}
    >
      {isHighlighted && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-light to-accent" />
      )}

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
