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

function SectionHeader({ icon, title, subtitle, count }) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-heading">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
      {count !== undefined && (
        <span className="hidden sm:inline-flex items-center px-4 py-2 bg-gray-100 text-gray-600 text-sm font-semibold rounded-full">
          {count} 个
        </span>
      )}
    </div>
  );
}

export default function App() {
  const [selectedDirection, setSelectedDirection] = useState('all');
  const [sortBy, setSortBy] = useState('recommendation');
  const [quizResult, setQuizResult] = useState(null);

  const filteredProfessors = selectedDirection === 'all'
    ? professors
    : professors.filter(p => p.directionId === selectedDirection);

  return (
    <div className="min-h-screen bg-surface">
      <Header />

      <FilterBar
        directions={directions}
        selectedDirection={selectedDirection}
        onDirectionChange={setSelectedDirection}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* Professors Section */}
        <section>
          <SectionHeader
            icon={
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
              </svg>
            }
            title="导师档案卡"
            subtitle="点击展开查看论文解读、方向评价、技术栈"
            count={filteredProfessors.length}
          />
          <div className="grid gap-5">
            {filteredProfessors.map(p => (
              <ProfessorCard
                key={p.id}
                professor={p}
                isHighlighted={quizResult?.professors?.includes(p.id)}
              />
            ))}
            {filteredProfessors.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <p className="text-gray-500">该方向暂无导师数据</p>
              </div>
            )}
          </div>
        </section>

        {/* Directions Section */}
        <section>
          <SectionHeader
            icon={
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
            }
            title="方向对比总表"
            subtitle="点击行展开查看5维深度拆解"
            count={directions.length}
          />
          <DirectionTable
            directions={directions}
            highlightedDirection={quizResult?.direction}
            sortBy={sortBy}
          />
        </section>

        {/* Quiz Section */}
        <section>
          <SectionHeader
            icon={
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            }
            title="个性化方向匹配"
            subtitle="5个问题，找到最适合你的研究方向"
          />
          <QuizSection quiz={quiz} onResult={setQuizResult} />
        </section>
      </main>

      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>调研日期：2026年5月12日</span>
            </div>
            <div className="flex items-center gap-4">
              <span>数据来源：</span>
              <div className="flex gap-2">
                {['Semantic Scholar', 'arXiv', 'B站', '与非网'].map(source => (
                  <span key={source} className="px-2 py-0.5 bg-gray-100 rounded text-xs">{source}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
