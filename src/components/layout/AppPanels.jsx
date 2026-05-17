import { lazy, Suspense } from 'react';
import ErrorBoundary from '../ErrorBoundary';
import ProfessorList from '../professors/ProfessorList';
import PanelFallback from './PanelFallback';

const DirectionTable = lazy(() => import('../direction/DirectionTable'));
const QuizSection = lazy(() => import('../quiz/QuizSection'));
const RoadmapSection = lazy(() => import('../roadmap/RoadmapSection'));

function ProfessorsPanel({ professors, quizResult }) {
  return (
    <ErrorBoundary fallbackMessage="导师列表加载失败">
      <ProfessorList
        professors={professors}
        highlightedProfessorIds={quizResult?.professors || []}
      />
    </ErrorBoundary>
  );
}

function DirectionsPanel({ directions, quizResult, sortBy }) {
  return (
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
  );
}

function RoadmapPanel({ directions, quizResult, quiz, professors, onQuizResult }) {
  if (!quizResult) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8" aria-label="个性化方向匹配">
        <ErrorBoundary fallbackMessage="问卷加载失败">
          <div
            id="roadmap-panel"
            role="tabpanel"
            aria-labelledby="roadmap-tab"
          >
            <Suspense fallback={<PanelFallback label="正在加载匹配问卷..." />}>
              <QuizSection
                quiz={quiz}
                professors={professors}
                directions={directions}
                onResult={onQuizResult}
              />
            </Suspense>
          </div>
        </ErrorBoundary>
      </section>
    );
  }

  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 py-8 overflow-hidden"
      aria-label="行动路线图"
    >
      <ErrorBoundary fallbackMessage="路线图加载失败">
        <div
          id="roadmap-panel"
          data-animate="roadmap"
          role="tabpanel"
          aria-labelledby="roadmap-tab"
          className="overflow-hidden"
        >
          <Suspense fallback={<PanelFallback label="正在加载路线图..." />}>
            <RoadmapSection
              directionId={quizResult.direction}
              directionName={
                quizResult.directionName ||
                directions.find((direction) => direction.id === quizResult.direction)?.name ||
                quizResult.direction
              }
              results={quizResult.topResults}
              directions={directions}
              professors={professors}
            />
          </Suspense>
        </div>
      </ErrorBoundary>
    </section>
  );
}

export default function AppPanels({
  activeTab,
  directions,
  filteredProfessors,
  quizResult,
  sortBy,
  quiz,
  professors,
  onQuizResult,
}) {
  return (
    <>
      {activeTab !== 'roadmap' && (
        <main
          id="main-content"
          className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10 overflow-hidden"
        >
          {activeTab === 'professors' && (
            <ProfessorsPanel professors={filteredProfessors} quizResult={quizResult} />
          )}
          {activeTab === 'directions' && (
            <DirectionsPanel directions={directions} quizResult={quizResult} sortBy={sortBy} />
          )}
        </main>
      )}

      {activeTab === 'roadmap' && (
        <RoadmapPanel
          directions={directions}
          quizResult={quizResult}
          quiz={quiz}
          professors={professors}
          onQuizResult={onQuizResult}
        />
      )}
    </>
  );
}
