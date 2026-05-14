import { lazy, Suspense } from 'react';

const RoadmapSection = lazy(() => import('./RoadmapSection'));

function PanelFallback({ label }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-sm text-gray-500">
      {label}
    </div>
  );
}

export default function QuizResults({ quizResult, directions }) {
  return (
    <section className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border-2 border-blue-100 p-8 md:p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-40 h-40 bg-blue-200/30 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-purple-200/30 rounded-full translate-x-1/3 translate-y-1/3 blur-2xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 font-heading">你的匹配结果</h3>
              <p className="text-sm text-gray-500">基于加权维度分析</p>
            </div>
          </div>

          {quizResult.topResults ? (
            <div className="grid gap-3 max-w-2xl">
              {quizResult.topResults.map((r, i) => (
                <div
                  key={r.direction}
                  className={`relative bg-white rounded-xl p-4 border-2 transition-all ${
                    i === 0 ? 'border-primary shadow-md' : 'border-gray-100 opacity-75'
                  }`}
                >
                  {i === 0 && (
                    <div className="absolute -top-2.5 left-4 px-2 py-0.5 bg-primary text-white text-xs font-bold rounded-full">
                      最佳匹配
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          i === 0 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className={`font-bold ${i === 0 ? 'text-primary' : 'text-gray-700'}`}>
                        {r.directionName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            i === 0
                              ? 'bg-gradient-to-r from-primary to-primary-light'
                              : 'bg-gray-300'
                          }`}
                          style={{ width: `${r.score}%` }}
                        />
                      </div>
                      <span
                        className={`text-sm font-bold ${i === 0 ? 'text-primary' : 'text-gray-500'}`}
                      >
                        {r.score}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-4 border-2 border-primary shadow-md inline-block">
              <span className="text-xl font-bold text-primary">
                {quizResult.directionName || quizResult.direction}
              </span>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-sm text-gray-500">推荐导师：</span>
                {quizResult.professors?.map((p) => (
                  <span
                    key={p}
                    className="inline-flex items-center px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Suspense fallback={<PanelFallback label="正在加载路线图..." />}>
        <RoadmapSection
          directionId={quizResult.direction}
          directionName={
            quizResult.directionName ||
            directions.find((d) => d.id === quizResult.direction)?.name ||
            quizResult.direction
          }
        />
      </Suspense>
    </section>
  );
}
