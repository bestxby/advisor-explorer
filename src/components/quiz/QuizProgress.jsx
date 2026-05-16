function ProgressStep({ index, currentQ }) {
  const completed = index < currentQ;
  const current = index === currentQ;

  return (
    <div
      className={`
        flex-shrink-0 w-8 h-8 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300
        ${
          completed
            ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200'
            : current
              ? 'bg-primary text-white shadow-md shadow-primary/30 scale-110'
              : 'bg-gray-100 dark:bg-[#151d2b] text-gray-400 dark:text-slate-500 border-2 border-gray-200 dark:border-[#2a3550]'
        }
      `}
      aria-current={current ? 'step' : undefined}
      aria-label={`第${index + 1}题${completed ? '，已完成' : current ? '，当前' : ''}`}
    >
      {completed ? (
        <svg
          className="w-3.5 h-3.5 sm:w-4 sm:h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      ) : (
        index + 1
      )}
    </div>
  );
}

export default function QuizProgress({ currentQ, totalQuestions }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-8 min-w-0">
      <div
        className="flex items-center gap-1.5 sm:gap-3 overflow-x-auto pb-1"
        role="group"
        aria-label="问卷进度"
      >
        {Array.from({ length: totalQuestions }, (_, index) => (
          <ProgressStep key={index} index={index} currentQ={currentQ} />
        ))}
      </div>
      <span className="text-sm font-medium text-gray-500 dark:text-slate-400 flex-shrink-0 ml-2">
        {currentQ + 1} / {totalQuestions}
      </span>
    </div>
  );
}
