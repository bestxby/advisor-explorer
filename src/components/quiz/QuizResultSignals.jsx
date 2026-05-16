function SignalGroup({ label, signals, className, direction }) {
  if (!signals?.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">
        {label}
      </span>
      {signals.map((signal) => (
        <span
          key={`${direction}-${signal.tag}`}
          className={`inline-flex max-w-full items-center px-2 py-0.5 rounded-full border text-xs ${className}`}
        >
          <span className="truncate">{signal.label}</span>
        </span>
      ))}
    </div>
  );
}

export default function QuizResultSignals({ result }) {
  if (!result.strengths?.length && !result.cautions?.length) return null;

  return (
    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-[#2a3550] space-y-2">
      <SignalGroup
        label="匹配依据"
        signals={result.strengths}
        direction={result.direction}
        className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800"
      />
      <SignalGroup
        label="需要注意"
        signals={result.cautions}
        direction={result.direction}
        className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800"
      />
    </div>
  );
}
