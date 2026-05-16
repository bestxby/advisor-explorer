export default function ProfessorTechStack({ techStack, conferences }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-indigo-600 dark:text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
            />
          </svg>
        </div>
        <h4 className="font-semibold text-gray-900 dark:text-slate-100 text-lg font-heading">
          技术栈与入门资源
        </h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-[#151d2b]/50 rounded-xl p-5 border border-gray-100 dark:border-[#2a3550]">
          <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            核心技术栈
          </p>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center px-3 py-1.5 bg-white dark:bg-[#151d2b] text-indigo-700 dark:text-indigo-400 text-xs font-semibold rounded-lg border border-indigo-100 dark:border-indigo-800 shadow-sm dark:shadow-black/30"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-[#151d2b]/50 rounded-xl p-5 border border-gray-100 dark:border-[#2a3550]">
          <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            顶会/顶刊
          </p>
          <div className="flex flex-wrap gap-2">
            {conferences.map((conf) => (
              <span
                key={conf}
                className="inline-flex items-center px-3 py-1.5 bg-white dark:bg-[#151d2b] text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-lg border border-emerald-100 dark:border-emerald-800 shadow-sm dark:shadow-black/30"
              >
                {conf}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
