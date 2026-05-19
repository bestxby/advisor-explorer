import { lazy, Suspense, useEffect } from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import AppPanels from './components/layout/AppPanels';
import KPISummary from './components/KPISummary';
import { FilterProvider } from './context/FilterContext';
import { DataRepository } from './services/DataRepository';
import useCursorGlow from './hooks/useCursorGlow';

const directions = DataRepository.getDirections();
const professors = DataRepository.getProfessors();
const quiz = DataRepository.getQuiz();
import useExplorerState from './hooks/useExplorerState';
import useFilteredProfessors from './hooks/useFilteredProfessors';
import useScrollAnimations from './hooks/useScrollAnimations';

const Background3D = lazy(() => import('./components/Background3D'));

export default function App() {
  const explorerState = useExplorerState();
  const filteredProfessors = useFilteredProfessors(
    professors,
    explorerState.selectedDirection,
  );

  useScrollAnimations({ activeTab: explorerState.activeTab });
  useCursorGlow();

  // Force scroll to top on initial page mount and disable browser automatic scroll restoration
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-transparent overflow-x-hidden relative">
      <div className="cursor-glow-layer" aria-hidden="true" />

      <Suspense fallback={null}>
        <Background3D activeDirection={explorerState.selectedDirection} />
      </Suspense>

      <Header
        kpiSection={<KPISummary professors={professors} directions={directions} />}
      />

      <FilterProvider value={explorerState.filterValue}>
        <div
          id="content-wrapper"
          data-active-theme={explorerState.selectedDirection}
          className="min-h-screen bg-transparent overflow-x-hidden content-ambient content-grid-texture relative"
        >
          {/* Ambient glow orbs */}
          <div className="content-ambient-orbs" aria-hidden="true">
            <div className="content-ambient-orb content-ambient-orb--1" />
            <div className="content-ambient-orb content-ambient-orb--2" />
            <div className="content-ambient-orb content-ambient-orb--3" />
          </div>
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
          <Footer />
        </div>
      </FilterProvider>
    </div>
  );
}
