import { useCallback } from 'react';
import { useFilter } from '../../context/useFilter';
import ActTwoPanel from './ActTwoPanel';
import ActThreePanel from './ActThreePanel';

/**
 * AppPanels — pure layout orchestrator.
 *
 * Responsibilities:
 *   1. Wire context values (selectedDirection, setSortBy) to child panels.
 *   2. Stack Act 2 and Act 3 vertically.
 *
 * All business logic lives in ActTwoPanel / ActThreePanel.
 */
export default function AppPanels({
  directions,
  filteredProfessors,
  quizResult,
  sortBy,
  quiz,
  professors,
  onQuizResult,
}) {
  const {
    selectedDirection,
    setSelectedDirection,
    setSortBy,
  } = useFilter();

  const resetFilter = useCallback(() => {
    setSelectedDirection('all');
  }, [setSelectedDirection]);

  const toggleDirection = useCallback(() => {
    setSelectedDirection(
      selectedDirection === 'all' ? quizResult?.direction : 'all',
    );
  }, [selectedDirection, quizResult, setSelectedDirection]);

  return (
    <div className="space-y-16 py-8">
      <ActTwoPanel
        quiz={quiz}
        professors={professors}
        directions={directions}
        quizResult={quizResult}
        onQuizResult={onQuizResult}
        onResetFilter={resetFilter}
      />

      <ActThreePanel
        directions={directions}
        filteredProfessors={filteredProfessors}
        quizResult={quizResult}
        sortBy={sortBy}
        selectedDirection={selectedDirection}
        onDirectionToggle={toggleDirection}
        onSortChange={setSortBy}
      />
    </div>
  );
}
