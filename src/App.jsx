import { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import KPISummary from './components/KPISummary';
import ProfessorCard from './components/ProfessorCard';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import useScrollAnimations from './hooks/useScrollAnimations';
import { loadQuizResult, saveQuizResult, clearQuizResult } from './utils/storage';
import professors from './data/professors.json';
import directions from './data/directions.json';
import quiz from './data/quiz.json';

const DirectionTable = lazy(() => import('./components/DirectionTable'));
const QuizSection = lazy(() => import('./components/QuizSection'));
const RoadmapSection = lazy(() => import('./components/RoadmapSection'));

const TAB_DEFINITIONS = [
  {
    id: 'professors',
    label: '导师档案卡',
    shortLabel: '导师',
    countKey: 'professors',
    icon: (
      <svg
        aria-hidden="true"
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342"
        />
      </svg>
    ),
  },
  {
    id: 'directions',
    label: '方向对比总表',
    shortLabel: '方向',
    countKey: 'directions',
    icon: (
      <svg
        aria-hidden="true"
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
        />
      </svg>
    ),
  },
];

function PanelFallback({ label }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-8 text-center text-sm text-gray-500 dark:text-slate-400">
      {label}
    </div>
  );
}

export default function App() {
  const [selectedDirection, setSelectedDirection] = useState('all');
  const [sortBy, setSortBy] = useState('recommendation');
  const [quizResult, setQuizResult] = useState(() => loadQuizResult());

  const handleQuizResult = useCallback((result) => {
    setQuizResult(result);
    if (result) {
      saveQuizResult(result);
    } else {
      clearQuizResult();
    }
  }, []);
  const [activeTab, setActiveTab] = useState('professors');

  useScrollAnimations({ activeTab });

  const filteredProfessors = useMemo(() => {
    if (selectedDirection === 'all') return professors;
    return professors.filter((p) => p.directionId === selectedDirection);
  }, [selectedDirection]);

  return (
    <div className="min-h-screen bg-surface dark:bg-slate-900">
      <Header kpiSection={<KPISummary professors={professors} directions={directions} />}>
        <ErrorBoundary fallbackMessage="问卷加载失败">
          <Suspense fallback={<PanelFallback label="正在加载匹配问卷..." />}>
            <QuizSection
              quiz={quiz}
              professors={professors}
              directions={directions}
              onResult={handleQuizResult}
            />
          </Suspense>
        </ErrorBoundary>
      </Header>

      <FilterBar
        directions={directions}
        selectedDirection={selectedDirection}
        onDirectionChange={setSelectedDirection}
        sortBy={sortBy}
        onSortChange={setSortBy}
        activeTab={activeTab}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Tab Bar */}
        <div
          data-animate="tabbar"
          className="flex gap-1.5 bg-white dark:bg-slate-800 rounded-xl p-1.5 border border-gray-100 dark:border-slate-700 shadow-sm dark:shadow-slate-900/50"
          role="tablist"
          aria-label="内容视图"
        >
          {TAB_DEFINITIONS.map((tab) => {
            const isActive = activeTab === tab.id;
            const count =
              tab.countKey === 'professors'
                ? filteredProfessors.length
                : tab.countKey === 'directions'
                  ? directions.length
                  : undefined;
            return (
              <button
                key={tab.id}
                id={`${tab.id}-tab`}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg
                  text-sm font-semibold transition-all duration-200 cursor-pointer
                  ${isActive ? 'bg-primary text-white shadow-md' : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'}
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
                  <span
                    className={`
                    text-xs px-1.5 py-0.5 rounded-full font-bold
                    ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400'}
                  `}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'professors' && (
          <ErrorBoundary fallbackMessage="导师列表加载失败">
            <div
              id="professors-panel"
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
              data-animate="professor-list"
              role="tabpanel"
              aria-labelledby="professors-tab"
            >
              {filteredProfessors.map((p) => (
                <div key={p.id} data-animate="professor-card">
                  <ProfessorCard
                    professor={p}
                    isHighlighted={quizResult?.professors?.includes(p.id)}
                  />
                </div>
              ))}
              {filteredProfessors.length === 0 && (
                <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                  <svg
                    className="w-10 h-10 text-gray-300 dark:text-slate-600 mx-auto mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                  <p className="text-gray-500 dark:text-slate-400 text-sm">该方向暂无导师数据</p>
                </div>
              )}
            </div>
          </ErrorBoundary>
        )}

        {activeTab === 'directions' && (
          <ErrorBoundary fallbackMessage="方向对比加载失败">
            <div
              id="directions-panel"
              data-animate="directions"
              role="tabpanel"
              aria-labelledby="directions-tab"
            >
              <Suspense fallback={<PanelFallback label="正在加载方向对比..." />}>
                <DirectionTable
                  directions={directions}
                  highlightedDirection={quizResult?.direction}
                  sortBy={sortBy}
                />
              </Suspense>
            </div>
          </ErrorBoundary>
        )}

        {/* Roadmap — shown when quiz is completed */}
        {quizResult && (
          <ErrorBoundary fallbackMessage="路线图加载失败">
            <Suspense fallback={<PanelFallback label="正在加载路线图..." />}>
              <RoadmapSection
                directionId={quizResult.direction}
                directionName={
                  quizResult.directionName ||
                  directions.find((d) => d.id === quizResult.direction)?.name ||
                  quizResult.direction
                }
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </main>

      <Footer />
    </div>
  );
}
