import { useState } from 'react';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import ProfessorCard from './components/ProfessorCard';
import DirectionTable from './components/DirectionTable';
import QuizSection from './components/QuizSection';
import professors from './data/professors.json';
import directions from './data/directions.json';
import quiz from './data/quiz.json';
import './App.css';

export default function App() {
  const [selectedDirection, setSelectedDirection] = useState('all');
  const [sortBy, setSortBy] = useState('recommendation');
  const [quizResult, setQuizResult] = useState(null);

  const filteredProfessors = selectedDirection === 'all'
    ? professors
    : professors.filter(p => p.directionId === selectedDirection);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <FilterBar
        directions={directions}
        selectedDirection={selectedDirection}
        onDirectionChange={setSelectedDirection}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-12">
        {/* Professors Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">导师档案卡</h2>
          <div className="space-y-4">
            {filteredProfessors.map(p => (
              <ProfessorCard
                key={p.id}
                professor={p}
                isHighlighted={quizResult?.professors?.includes(p.id)}
              />
            ))}
          </div>
        </section>

        {/* Directions Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">方向对比总表</h2>
          <DirectionTable
            directions={directions}
            highlightedDirection={quizResult?.direction}
            sortBy={sortBy}
          />
        </section>

        {/* Quiz Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">个性化方向匹配</h2>
          <QuizSection quiz={quiz} onResult={setQuizResult} />
        </section>
      </main>

      <footer className="text-center py-8 text-gray-500 text-sm">
        调研日期：2026年5月12日 · 数据来源：Semantic Scholar、arXiv、B站、与非网
      </footer>
    </div>
  );
}
