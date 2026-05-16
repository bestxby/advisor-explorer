export default function QuizFrame({ children }) {
  return (
    <div
      className="w-full min-w-0 bg-transparent rounded-2xl border border-gray-100/50 dark:border-[#2a3550]/40 h-[500px] md:h-[580px] flex flex-col"
      style={{ maxWidth: 'calc(100vw - 4rem)' }}
    >
      <div className="px-6 pt-5 pb-3 border-b border-gray-100 dark:border-[#2a3550]">
        <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 tracking-wider uppercase">
          个性化方向匹配
        </p>
      </div>
      {children}
    </div>
  );
}
