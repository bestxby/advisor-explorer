import TabIcon from './TabIcon';

function getTabCount(tab, counts) {
  return tab.countKey ? counts[tab.countKey] : undefined;
}

export default function TabBar({
  tabs,
  activeTab,
  onTabChange,
  hasQuizResult,
  counts,
}) {
  const handleTabKeyDown = (event) => {
    const tabIds = tabs.map((tab) => tab.id);
    const currentIndex = tabIds.indexOf(activeTab);
    let nextIndex = -1;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      nextIndex = (currentIndex + 1) % tabIds.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      nextIndex = (currentIndex - 1 + tabIds.length) % tabIds.length;
    } else if (event.key === 'Home') {
      event.preventDefault();
      nextIndex = 0;
    } else if (event.key === 'End') {
      event.preventDefault();
      nextIndex = tabIds.length - 1;
    }

    if (nextIndex >= 0) {
      onTabChange(tabIds[nextIndex]);
      requestAnimationFrame(() => {
        document.getElementById(`${tabIds[nextIndex]}-tab`)?.focus();
      });
    }
  };

  return (
    <div data-animate="tabbar" className="flex justify-center w-full xl:flex-1 min-w-0">
      <div
        className="grid grid-cols-3 w-full max-w-3xl min-w-0 gap-1.5 bg-gray-100/50 dark:bg-[#0c1018]/50 rounded-xl p-1.5 border border-gray-200/50 dark:border-[#2a3550] overflow-hidden"
        role="tablist"
        aria-label="内容视图"
        onKeyDown={handleTabKeyDown}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isLocked = tab.id === 'roadmap' && !hasQuizResult;
          const count = getTabCount(tab, counts);

          return (
            <button
              key={tab.id}
              id={`${tab.id}-tab`}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`
                min-w-0 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 lg:px-4 py-2.5 rounded-lg
                text-sm font-bold transition-all duration-200 cursor-pointer
                ${isActive ? 'bg-primary text-white shadow-md' : 'text-gray-600 dark:text-slate-300 hover:bg-white dark:hover:bg-[#151d2e]'}
                ${isLocked && !isActive ? 'opacity-50' : ''}
              `}
              aria-selected={isActive}
              aria-controls={`${tab.id}-panel`}
              role="tab"
              tabIndex={isActive ? 0 : -1}
            >
              <span className="flex-shrink-0">
                <TabIcon type={tab.icon} />
              </span>
              <span className="hidden sm:inline min-w-0 truncate">{tab.label}</span>
              <span className="sm:hidden min-w-0 truncate">{tab.shortLabel}</span>
              {isLocked && <TabIcon type="lock" className="w-3 h-3 opacity-60" strokeWidth={2} />}
              {count !== undefined && (
                <span
                  className={`
                    flex-shrink-0 text-xs px-1.5 py-0.5 rounded-full font-extrabold
                    ${isActive ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-[#151d2b] text-gray-500 dark:text-slate-400'}
                  `}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
