import QuizResultSignals from './QuizResultSignals';

export default function QuizResultCard({ result, index }) {
  const best = index === 0;

  return (
    <div
      className={`relative rounded-xl p-4 border-2 transition-all ${
        best
          ? 'border-primary bg-primary/5 shadow-md dark:shadow-blue-500/10'
          : 'border-gray-100 dark:border-[#2a3550] bg-gray-50 dark:bg-[#111a2e]/50 opacity-75'
      }`}
    >
      {best && (
        <div className="absolute -top-2.5 left-4 px-2 py-0.5 bg-primary text-white text-xs font-bold rounded-full">
          最佳匹配
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              best
                ? 'bg-primary text-white'
                : 'bg-gray-200 dark:bg-[#2a3550] text-gray-500 dark:text-slate-400'
            }`}
          >
            {index + 1}
          </span>
          <span
            className={`font-bold min-w-0 break-words ${best ? 'text-primary' : 'text-gray-700 dark:text-slate-300'}`}
          >
            {result.directionName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-20 h-2 bg-gray-200 dark:bg-[#2a3550] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                best
                  ? 'bg-gradient-to-r from-primary to-primary-light'
                  : 'bg-gray-300 dark:bg-[#3d4f6f]'
              }`}
              style={{ width: `${result.score}%` }}
            />
          </div>
          <span
            className={`text-sm font-bold ${best ? 'text-primary' : 'text-gray-500 dark:text-slate-400'}`}
          >
            {result.score}%
          </span>
        </div>
      </div>

      <QuizResultSignals result={result} />
    </div>
  );
}
