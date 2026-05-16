import { useMemo } from 'react';

export default function useFilteredProfessors(professors, selectedDirection) {
  return useMemo(() => {
    if (selectedDirection === 'all') return professors;
    return professors.filter((professor) => professor.directionId === selectedDirection);
  }, [professors, selectedDirection]);
}
