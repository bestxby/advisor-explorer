import { useFilter } from '../context/useFilter';
import ActiveDirectionFilter from './filter/ActiveDirectionFilter';
import DirectionFilterControl from './filter/DirectionFilterControl';
import DirectionSortControl from './filter/DirectionSortControl';
import TabBar from './filter/TabBar';

export default function FilterBar({
  directions,
  filteredProfessorsLength,
  directionsLength,
  tabs,
}) {
  const {
    selectedDirection,
    setSelectedDirection,
    sortBy,
    setSortBy,
    activeTab,
    setActiveTab,
    hasQuizResult,
  } = useFilter();
  const isProfTab = activeTab === 'professors';

  return (
    <div
      data-filterbar
      className="bg-white/80 dark:bg-[#0c1018]/90 backdrop-blur-xl border-b border-border dark:border-[#2a3550]/40 sticky top-0 z-20 shadow-sm dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)] overflow-hidden"
    >
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 min-h-[4rem] flex flex-col xl:flex-row xl:items-center gap-3 py-3 relative">
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          hasQuizResult={hasQuizResult}
          counts={{
            professors: filteredProfessorsLength,
            directions: directionsLength,
          }}
        />

        <div className="w-full xl:w-auto xl:absolute xl:right-6 xl:top-1/2 xl:-translate-y-1/2 flex flex-col sm:flex-row sm:items-center sm:justify-center xl:justify-end gap-3">
          {isProfTab ? (
            <>
              <DirectionFilterControl
                directions={directions}
                selectedDirection={selectedDirection}
                onDirectionChange={setSelectedDirection}
              />
              {selectedDirection !== 'all' && (
                <ActiveDirectionFilter
                  directions={directions}
                  selectedDirection={selectedDirection}
                  onClear={() => setSelectedDirection('all')}
                />
              )}
            </>
          ) : (
            <DirectionSortControl sortBy={sortBy} onSortChange={setSortBy} />
          )}
        </div>
      </div>
    </div>
  );
}
