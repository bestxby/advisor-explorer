import ProfessorCard from '../ProfessorCard';

function EmptyProfessorList() {
  return (
    <div className="text-center py-10 bg-[#0f1629] rounded-xl border border-[#2a3550]">
      <svg
        className="w-10 h-10 text-[#475569] mx-auto mb-3"
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
      <p className="text-slate-400 text-sm">该方向暂无导师数据</p>
    </div>
  );
}

export default function ProfessorList({ professors, highlightedProfessorIds = [] }) {
  return (
    <div
      id="professors-panel"
      className="grid grid-cols-1 gap-3"
      data-animate="professor-list"
      role="tabpanel"
      aria-labelledby="professors-tab"
    >
      {professors.map((professor) => (
        <div key={professor.id} data-animate="professor-card">
          <ProfessorCard
            professor={professor}
            isHighlighted={highlightedProfessorIds.includes(professor.id)}
          />
        </div>
      ))}
      {professors.length === 0 && <EmptyProfessorList />}
    </div>
  );
}
