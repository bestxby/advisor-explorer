export default function ProfessorEvaluation({ evaluation, suitableFor }) {
  return (
    <section className="relative">
      <div className="absolute -left-3 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-orange-400 rounded-full" />
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-100 dark:border-amber-800/50">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-amber-600 dark:text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-slate-100 text-lg font-heading">
            方向犀利评价
          </h4>
        </div>
        <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed mb-4">
          {evaluation}
        </p>
        <div className="flex items-start gap-2 bg-white/60 dark:bg-[#0f1629]/60 rounded-lg p-3 border border-amber-200 dark:border-amber-700/50">
          <svg
            className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
          <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
            适合谁：{suitableFor}
          </p>
        </div>
      </div>
    </section>
  );
}
