import { lazy, Suspense } from 'react';
import BackToTop from './components/BackToTop';
import FilterBar from './components/FilterBar';
import Footer from './components/Footer';
import Header from './components/Header';
import AppPanels from './components/layout/AppPanels';
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
const SplineBackground = lazy(() => import('./components/SplineBackground'));

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
    <div className="min-h-screen bg-transparent overflow-x-hidden relative">
      <Suspense fallback={null}>
        <SplineBackground />
      </Suspense>

      <div className="cursor-glow-layer" aria-hidden="true" />

      {theme === 'dark' && (
        <Suspense fallback={null}>
          <ParticleLayer />
        </Suspense>
      )}

      <Header kpiSection={<KPISummary professors={professors} directions={directions} />} />

      <FilterProvider value={explorerState.filterValue}>
        <div
          id="content-wrapper"
          className="min-h-screen bg-transparent overflow-x-hidden"
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
            quiz={quiz}
            professors={professors}
            onQuizResult={explorerState.handleQuizResult}
          />
          <BackToTop />
          <Footer />
        </div>
      </FilterProvider>
    </div>
  );
}
