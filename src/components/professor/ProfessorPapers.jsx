export default function ProfessorPapers({ papers }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-blue-600 dark:text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
        </div>
        <h4 className="font-semibold text-gray-900 dark:text-slate-100 text-lg font-heading">
          代表性论文解读
        </h4>
      </div>
      <div className="grid gap-4">
        {papers.map((paper, i) => (
          <a
            key={i}
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group/paper bg-gradient-to-br from-gray-50 dark:from-[#151d2b]/70 to-white dark:to-[#131a2b] rounded-xl p-5 border border-gray-100 dark:border-[#2a3550] hover:border-blue-200 hover:shadow-sm dark:hover:shadow-black/30 transition-all duration-200 cursor-pointer block"
          >
            <div className="flex flex-wrap items-start gap-3 mb-3">
              <h5 className="font-semibold text-gray-900 dark:text-slate-100 text-sm leading-snug flex-1 min-w-0 group-hover/paper:text-blue-700 transition-colors duration-200">
                {paper.title}
              </h5>
              <span className="flex-shrink-0 inline-flex items-center px-2.5 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-md">
                {paper.venue}
              </span>
              <svg
                className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500 flex-shrink-0 opacity-0 group-hover/paper:opacity-100 transition-opacity duration-200 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
              {paper.summary}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
