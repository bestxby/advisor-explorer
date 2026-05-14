import { useState } from 'react';
import roadmapData from '../data/roadmap.json';

const PRIORITY_STYLES = {
  high: 'bg-red-50 text-red-700 border-red-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  low: 'bg-gray-50 text-gray-500 border-gray-200',
};

const PRIORITY_LABELS = {
  high: '必做',
  medium: '建议',
  low: '可选',
};

const PHASE_COLORS = [
  {
    bg: 'bg-blue-500',
    light: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-200',
    ring: 'ring-blue-100',
  },
  {
    bg: 'bg-indigo-500',
    light: 'bg-indigo-100',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    ring: 'ring-indigo-100',
  },
  {
    bg: 'bg-purple-500',
    light: 'bg-purple-100',
    text: 'text-purple-700',
    border: 'border-purple-200',
    ring: 'ring-purple-100',
  },
];

export default function RoadmapSection({ directionId, directionName }) {
  const [expandedPhase, setExpandedPhase] = useState(0);

  const roadmap = roadmapData[directionId];
  if (!roadmap) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-8 md:p-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <svg
              className="w-5 h-5 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 font-heading">行动路线图</h3>
            <p className="text-sm text-gray-500">针对「{directionName}」方向的个性化时间线</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-8 relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 hidden md:block" />

          <div className="space-y-4">
            {roadmap.phases.map((phase, phaseIdx) => {
              const colors = PHASE_COLORS[phaseIdx];
              const isExpanded = expandedPhase === phaseIdx;

              return (
                <div key={phaseIdx} className="relative">
                  {/* Timeline dot - desktop only */}
                  <div
                    className={`absolute left-3 top-6 w-5 h-5 rounded-full ${colors.bg} ring-4 ${colors.ring} hidden md:block z-10`}
                  />

                  <div className="md:ml-14">
                    <button
                      onClick={() => setExpandedPhase(isExpanded ? -1 : phaseIdx)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                        isExpanded
                          ? `${colors.border} ${colors.light}`
                          : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-lg ${colors.bg} text-white flex items-center justify-center text-sm font-bold`}
                        >
                          {phaseIdx + 1}
                        </span>
                        <div className="text-left">
                          <span
                            className={`font-bold text-lg ${isExpanded ? colors.text : 'text-gray-800'}`}
                          >
                            {phase.period}
                          </span>
                          <span className="text-gray-400 text-sm ml-2">{phase.subtitle}</span>
                        </div>
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </button>

                    {isExpanded && (
                      <div className="mt-3 ml-2 space-y-2 animate-fadeIn">
                        {phase.tasks.map((task, taskIdx) => (
                          <div
                            key={taskIdx}
                            className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100"
                          >
                            <span
                              className={`flex-shrink-0 mt-0.5 px-2 py-0.5 text-xs font-semibold rounded border ${PRIORITY_STYLES[task.priority]}`}
                            >
                              {PRIORITY_LABELS[task.priority]}
                            </span>
                            <span className="text-gray-700 text-sm leading-relaxed">
                              {task.text}
                            </span>
                          </div>
                        ))}

                        {/* Milestone */}
                        <div
                          className={`flex items-start gap-3 p-3 rounded-lg ${colors.light} border ${colors.border} mt-4`}
                        >
                          <svg
                            className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                            />
                          </svg>
                          <div>
                            <span
                              className={`text-xs font-bold ${colors.text} uppercase tracking-wide`}
                            >
                              阶段目标
                            </span>
                            <p className="text-gray-700 text-sm mt-1 leading-relaxed">
                              {phase.milestone}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resources */}
        {roadmap.resources && roadmap.resources.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
              推荐资源
            </h4>
            <div className="flex flex-wrap gap-2">
              {roadmap.resources.map((res, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700"
                >
                  {res.url ? (
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      {res.name}
                    </a>
                  ) : (
                    <span>{res.name}</span>
                  )}
                  {res.note && <span className="text-gray-400 text-xs">({res.note})</span>}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
