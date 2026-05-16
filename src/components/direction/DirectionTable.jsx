import { useMemo, useState } from 'react';
import { sortFunctions } from '../../utils/sorting';
import DirectionDesktopTable from './DirectionDesktopTable';
import DirectionMobileList from './DirectionMobileList';

/**
 * Stateful container for direction comparison. Rendering is delegated to
 * viewport-specific children so table behavior and markup can evolve separately.
 */
export default function DirectionTable({ directions, highlightedDirection, sortBy }) {
  const [expandedId, setExpandedId] = useState(null);

  const sortedDirections = useMemo(
    () => [...directions].sort(sortFunctions[sortBy] || sortFunctions.recommendation),
    [directions, sortBy],
  );

  const toggleDirection = (id) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  const handleDirectionKeyDown = (event, id) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleDirection(id);
    }
  };

  return (
    <div className="bg-white dark:bg-[#131a2b] rounded-2xl border border-gray-100 dark:border-[#2a3550] shadow-sm dark:shadow-black/30 overflow-hidden card-glow">
      <DirectionMobileList
        directions={sortedDirections}
        expandedId={expandedId}
        highlightedDirection={highlightedDirection}
        onToggle={toggleDirection}
        onKeyDown={handleDirectionKeyDown}
      />
      <DirectionDesktopTable
        directions={sortedDirections}
        expandedId={expandedId}
        highlightedDirection={highlightedDirection}
        onToggle={toggleDirection}
        onKeyDown={handleDirectionKeyDown}
      />
    </div>
  );
}
