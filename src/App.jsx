import { lazy, Suspense } from 'react';
import BackToTop from './components/BackToTop';
import ErrorBoundary from './components/ErrorBoundary';
import FilterBar from './components/FilterBar';
import Footer from './components/Footer';
import Header from './components/Header';
import AppPanels from './components/layout/AppPanels';
import PanelFallback from './components/layout/PanelFallback';
import KPISummary from './components/KPISummary';
import { TAB_DEFINITIONS } from './config/tabs';
import { FilterProvider } from './context/FilterContext';
import { useTheme } from './context/useTheme';
import directions from './data/directions.json';
import professors from './data/professors.json';
import quiz from './data/quiz.json';
import useCursorGlow from './hooks/useCursorGlow';
import useExplorerState from './hooks/useExplorerState';
import useFilteredProfessors from './hooks/useFilteredProfessors';
import useScrollAnimations from './hooks/useScrollAnimations';

const ParticleLayer = lazy(() => import('./components/ParticleLayer'));
const QuizSection = lazy(() => import('./components/QuizSection'));

export default function App() {
  const { theme } = useTheme();
  const explorerState = useExplorerState();
  const filteredProfessors = useFilteredProfessors(
    professors,
    explorerState.selectedDirection,
  );

  useScrollAnimations({ activeTab: explorerState.activeTab });
  useCursorGlow();

  return (
    <div className="min-h-screen bg-surface dark:bg-[#0c1018] overflow-x-hidden">
      <div className="cursor-glow-layer" aria-hidden="true" />

      {theme === 'dark' && (
        <Suspense fallback={null}>
          <ParticleLayer />
        </Suspense>
      )}

      <Header kpiSection={<KPISummary professors={professors} directions={directions} />}>
        <ErrorBoundary fallbackMessage="问卷加载失败">
          <Suspense fallback={<PanelFallback label="正在加载匹配问卷..." />}>
            <QuizSection
              quiz={quiz}
              professors={professors}
              directions={directions}
              onResult={explorerState.handleQuizResult}
            />
          </Suspense>
        </ErrorBoundary>
      </Header>

      <FilterProvider value={explorerState.filterValue}>
        <div
          id="content-wrapper"
          className="min-h-screen bg-surface dark:bg-[#0c1018] overflow-x-hidden"
        >
          <FilterBar
            directions={directions}
            filteredProfessorsLength={filteredProfessors.length}
            directionsLength={directions.length}
            tabs={TAB_DEFINITIONS}
          />
          <AppPanels
            activeTab={explorerState.activeTab}
            directions={directions}
            filteredProfessors={filteredProfessors}
            quizResult={explorerState.quizResult}
            sortBy={explorerState.sortBy}
          />
          <BackToTop />
          <Footer />
        </div>
      </FilterProvider>
    </div>
  );
}
