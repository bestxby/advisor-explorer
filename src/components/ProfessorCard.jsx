import { useState, useRef, useEffect } from 'react';
import ResourceCard from './ResourceCard';

export default function ProfessorCard({ professor, isHighlighted }) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [expanded]);

  const collegeColors = {
    '清华大学 · 电子工程系': {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      dot: 'bg-blue-500',
    },
    '清华大学 · 集成电路学院': {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
      dot: 'bg-indigo-500',
    },
    '清华大学 · 计算机系': {
      bg: 'bg-cyan-50',
      text: 'text-cyan-700',
      border: 'border-cyan-200',
      dot: 'bg-cyan-500',
    },
    '北京大学 · 计算机学院/集成电路学院': {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      dot: 'bg-red-500',
    },
    '北京大学 · CECA（高能效计算与应用中心）': {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      dot: 'bg-purple-500',
    },
    '北京大学 · 计算机学院 + 鹏城实验室': {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      dot: 'bg-rose-500',
    },
    '北京大学 · 集成电路学院/信息工程学院': {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
      dot: 'bg-orange-500',
    },
  };

  const collegeKey = `${professor.university} · ${professor.department}`;
  const colors = collegeColors[collegeKey] || {
    bg: 'bg-gray-50 dark:bg-slate-700/50',
    text: 'text-gray-700 dark:text-slate-300',
    border: 'border-gray-200 dark:border-slate-600',
    dot: 'bg-gray-500 dark:bg-slate-400',
  };

  return (
    <div
      className={`
        group relative border-2 rounded-2xl transition-all duration-300 ease-out
        ${
          isHighlighted
            ? 'border-primary shadow-lg shadow-primary/10 ring-4 ring-primary/10'
            : 'border-gray-100 dark:border-slate-700 hover:border-gray-200 dark:hover:border-slate-600 hover:shadow-md dark:shadow-slate-900/50'
        }
        bg-white dark:bg-slate-800 overflow-hidden
      `}
    >
      {/* Highlight indicator */}
      {isHighlighted && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-light to-accent" />
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 cursor-pointer focus:outline-none group"
        aria-expanded={expanded}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 font-heading group-hover:text-primary transition-colors duration-200">
                {professor.name}
              </h3>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${colors.bg} ${colors.text} ${colors.border} border`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                {professor.university} · {professor.department}
              </span>
            </div>
            <p className="text-gray-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-1">
              {professor.tagline}
            </p>
          </div>

          <div
            className={`
            flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
            transition-all duration-300 ease-out
            ${
              expanded
                ? 'bg-primary text-white rotate-180 shadow-sm dark:shadow-slate-900/50'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 group-hover:bg-gray-200 dark:group-hover:bg-slate-600'
            }
          `}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-2">
          {professor.realDirections.slice(0, 3).map((dir) => (
            <span
              key={dir}
              className="inline-flex items-center px-2 py-0.5 bg-gray-50 dark:bg-slate-700/50 text-gray-600 dark:text-slate-400 text-xs rounded border border-gray-100 dark:border-slate-700"
            >
              {dir}
            </span>
          ))}
          {professor.realDirections.length > 3 && (
            <span className="inline-flex items-center px-2 py-0.5 bg-gray-50 dark:bg-slate-700/50 text-gray-400 dark:text-slate-500 text-xs rounded border border-gray-100 dark:border-slate-700">
              +{professor.realDirections.length - 3}
            </span>
          )}
        </div>
      </button>

      {/* Expandable content with smooth height transition */}
      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{ maxHeight: expanded ? `${contentHeight}px` : '0px' }}
      >
        <div
          ref={contentRef}
          className="px-6 pb-6 border-t border-gray-100 dark:border-slate-700 pt-6 space-y-8"
        >
          {/* Direction Detail */}
          {professor.directionDetail && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-slate-100 text-lg font-heading">
                  研究方向详解
                </h4>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                  {professor.directionDetail}
                </p>
              </div>
            </section>
          )}

          {/* Papers */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-blue-600"
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
              {professor.papers.map((paper, i) => (
                <a
                  key={i}
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/paper bg-gradient-to-br from-gray-50 dark:from-slate-700/50 to-white dark:to-slate-800 rounded-xl p-5 border border-gray-100 dark:border-slate-700 hover:border-blue-200 hover:shadow-sm dark:hover:shadow-slate-900/50 transition-all duration-200 cursor-pointer block"
                >
                  <div className="flex flex-wrap items-start gap-3 mb-3">
                    <h5 className="font-semibold text-gray-900 dark:text-slate-100 text-sm leading-snug flex-1 min-w-0 group-hover/paper:text-blue-700 transition-colors duration-200">
                      {paper.title}
                    </h5>
                    <span className="flex-shrink-0 inline-flex items-center px-2.5 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-md">
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

          {/* Evaluation */}
          <section className="relative">
            <div className="absolute -left-3 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-orange-400 rounded-full" />
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-amber-600"
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
                {professor.evaluation}
              </p>
              <div className="flex items-start gap-2 bg-white/60 dark:bg-white/10 rounded-lg p-3 border border-amber-200">
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
                <p className="text-sm text-amber-800 font-medium">
                  适合谁：{professor.suitableFor}
                </p>
              </div>
            </div>
          </section>

          {/* Tech Stack */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-indigo-600"
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
              <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-5 border border-gray-100 dark:border-slate-700">
                <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  核心技术栈
                </p>
                <div className="flex flex-wrap gap-2">
                  {professor.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center px-3 py-1.5 bg-white dark:bg-slate-800 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-100 shadow-sm dark:shadow-slate-900/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-5 border border-gray-100 dark:border-slate-700">
                <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  顶会/顶刊
                </p>
                <div className="flex flex-wrap gap-2">
                  {professor.conferences.map((conf) => (
                    <span
                      key={conf}
                      className="inline-flex items-center px-3 py-1.5 bg-white dark:bg-slate-800 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-100 shadow-sm dark:shadow-slate-900/50"
                    >
                      {conf}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Resources */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-gray-700 dark:text-slate-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-slate-100 text-lg font-heading">
                推荐开源项目
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {professor.resources.map((res) => (
                <ResourceCard key={res.name} {...res} />
              ))}
            </div>
          </section>

          {/* Starter Project */}
          <section className="relative">
            <div className="absolute -left-3 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-full" />
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-slate-100 text-lg font-heading">
                  大三入门项目
                </h4>
              </div>
              <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                {professor.starterProject}
              </p>
            </div>
          </section>

          {/* Meta */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-500 dark:text-slate-400 pt-4 border-t border-gray-100 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
              <span>导师风格：{professor.style}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              <span>联系方式：{professor.contact}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
