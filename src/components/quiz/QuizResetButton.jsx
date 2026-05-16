import QuizResultIcon from './QuizResultIcon';

export default function QuizResetButton({ onReset }) {
  return (
    <div className="mt-4 text-center">
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-50 dark:bg-[#111a2e]/50 text-gray-700 dark:text-slate-300 rounded-xl font-semibold border border-gray-200 dark:border-[#2a3550] hover:bg-gray-100 dark:hover:bg-[#1f2940] hover:shadow-sm transition-all duration-200 cursor-pointer text-sm"
      >
        <QuizResultIcon type="reset" className="w-4 h-4" />
        重新测试
      </button>
    </div>
  );
}
