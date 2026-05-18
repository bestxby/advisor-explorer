import { useFilter } from '../context/useFilter';
import TabBar from './filter/TabBar';

export default function FilterBar({
  directions,
  filteredProfessorsLength,
  directionsLength,
  tabs,
}) {
  const {
    activeTab,
    setActiveTab,
    hasQuizResult,
  } = useFilter();

  return (
    <div
      data-filterbar
      className="bg-[#070b14]/90 backdrop-blur-xl border-b border-[#2a3550]/40 sticky top-0 z-20 shadow-sm shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)] overflow-hidden"
    >
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 min-h-[4rem] flex items-center justify-center py-3 relative">
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
      </div>
    </div>
  );
}
