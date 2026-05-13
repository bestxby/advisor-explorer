import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import KPISummary from './components/KPISummary';
import ProfessorCard from './components/ProfessorCard';
import useScrollAnimations from './hooks/useScrollAnimations';
import professors from './data/professors.json';
import directions from './data/directions.json';
import quiz from './data/quiz.json';
import './App.css';

const DirectionTable = lazy(() => import('./components/DirectionTable'));
const QuizSection = lazy(() => import('./components/QuizSection'));

const TAB_DEFINITIONS = [
  {
    id: 'professors',
    label: '导师档案卡',
    shortLabel: '导师',
    countKey: 'professors',
    icon: (
      <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
      </svg>
    ),
  },
  {
    id: 'directions',
    label: '方向对比总表',
    shortLabel: '方向',
    countKey: 'directions',
    icon: (
      <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    id: 'quiz',
    label: '个性化方向匹配',
    shortLabel: '匹配',
    icon: (
      <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
  },
];

function DeferredPanel({ children, onReady }) {
  useEffect(() => {
    onReady();
  }, [onReady]);

  return children;
}

function PanelFallback({ label }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-sm text-gray-500">
      {label}
    </div>
  );
}

function TabBar({ activeTab, onTabChange, professorsCount, directionsCount }) {
  const counts = { professors: professorsCount, directions: directionsCount };

  const handleKeyDown = (event) => {
    const currentIndex = TAB_DEFINITIONS.findIndex(tab => tab.id === activeTab);
    let nextIndex = currentIndex;

    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % TAB_DEFINITIONS.length;
    if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + TAB_DEFINITIONS.length) % TAB_DEFINITIONS.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = TAB_DEFINITIONS.length - 1;

    if (nextIndex !== currentIndex) {
      event.preventDefault();
      const nextTabId = TAB_DEFINITIONS[nextIndex].id;
      onTabChange(nextTabId);
      window.requestAnimationFrame(() => {
        document.getElementById(`${nextTabId}-tab`)?.focus();
      });
    }
  };

  return (
    <div
      data-animate="tabbar"
      className="flex gap-1.5 bg-white rounded-xl p-1.5 border border-gray-100 shadow-sm"
      role="tablist"
      aria-label="内容视图"
      onKeyDown={handleKeyDown}
    >
      {TAB_DEFINITIONS.map(tab => {
        const isActive = activeTab === tab.id;
        const count = counts[tab.countKey];
        return (
          <button
            key={tab.id}
            id={`${tab.id}-tab`}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg
              text-sm font-semibold transition-all duration-200 cursor-pointer
              ${isActive
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
              }
            `}
            aria-selected={isActive}
            aria-controls={`${tab.id}-panel`}
            role="tab"
            tabIndex={isActive ? 0 : -1}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.shortLabel}</span>
            {count !== undefined && (
              <span className={`
                text-xs px-1.5 py-0.5 rounded-full font-bold
                ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}
              `}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default function App() {
  const [selectedDirection, setSelectedDirection] = useState('all');
  const [sortBy, setSortBy] = useState('recommendation');
  const [quizResult, setQuizResult] = useState(null);
  const [activeTab, setActiveTab] = useState('professors');
  const [animationRefreshKey, setAnimationRefreshKey] = useState(0);

  useScrollAnimations({ activeTab, refreshKey: animationRefreshKey });

  const handlePanelReady = useCallback(() => {
    setAnimationRefreshKey(key => key + 1);
  }, []);

  const filteredProfessors = useMemo(() => {
    if (selectedDirection === 'all') return professors;
    return professors.filter(p => p.directionId === selectedDirection);
  }, [selectedDirection]);

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />

      <FilterBar
        directions={directions}
        selectedDirection={selectedDirection}
        onDirectionChange={setSelectedDirection}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* KPI Summary Row */}
        <section>
          <KPISummary professors={professors} directions={directions} />
        </section>

        {/* Tab Bar */}
        <TabBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          professorsCount={filteredProfessors.length}
          directionsCount={directions.length}
        />

        {/* Tab Content */}
        {activeTab === 'professors' && (
          <div
            id="professors-panel"
            className="grid gap-3"
            data-animate="professor-list"
            role="tabpanel"
            aria-labelledby="professors-tab"
          >
            {filteredProfessors.map(p => (
              <div key={p.id} data-animate="professor-card">
                <ProfessorCard
                  professor={p}
                  isHighlighted={quizResult?.professors?.includes(p.id)}
                />
              </div>
            ))}
            {filteredProfessors.length === 0 && (
              <div className="text-center py-10 bg-white rounded-xl border border-gray-100">
                <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <p className="text-gray-500 text-sm">该方向暂无导师数据</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'directions' && (
          <div
            id="directions-panel"
            data-animate="directions"
            role="tabpanel"
            aria-labelledby="directions-tab"
          >
            <Suspense fallback={<PanelFallback label="正在加载方向对比..." />}>
              <DeferredPanel onReady={handlePanelReady}>
                <DirectionTable
                  directions={directions}
                  highlightedDirection={quizResult?.direction}
                  sortBy={sortBy}
                />
              </DeferredPanel>
            </Suspense>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div
            id="quiz-panel"
            data-animate="quiz"
            role="tabpanel"
            aria-labelledby="quiz-tab"
          >
            <Suspense fallback={<PanelFallback label="正在加载匹配问卷..." />}>
              <DeferredPanel onReady={handlePanelReady}>
                <QuizSection quiz={quiz} onResult={setQuizResult} />
              </DeferredPanel>
            </Suspense>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 bg-white mt-8">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>调研日期：2026年5月12日</span>
            </div>
            <div className="flex items-center gap-3">
              <span>数据来源：</span>
              <div className="flex gap-1.5">
                {['Semantic Scholar', 'arXiv', 'B站', '与非网'].map(source => (
                  <span key={source} className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">{source}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
