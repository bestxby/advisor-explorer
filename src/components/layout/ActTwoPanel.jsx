import { lazy, Suspense, useCallback, useState } from 'react';
import ErrorBoundary from '../ErrorBoundary';
import PanelFallback from './PanelFallback';

const QuizSection = lazy(() => import('../quiz/QuizSection'));
const RoadmapSection = lazy(() => import('../roadmap/RoadmapSection'));

/**
 * Act 2: Quiz → Match Ready Portal → Full Report + Roadmap.
 *
 * Owns the 3-state UI machine:
 *   quizResult === null  → QuizSection (questionnaire)
 *   quizResult && !show  → Match Ready Portal (unlock card)
 *   quizResult && show   → Full report + RoadmapSection
 */
export default function ActTwoPanel({
  quiz,
  professors,
  directions,
  quizResult,
  onQuizResult,
  onResetFilter,
}) {
  const [showReport, setShowReport] = useState(false);

  const resetAll = useCallback(() => {
    onQuizResult(null);
    setShowReport(false);
    onResetFilter();
  }, [onQuizResult, onResetFilter]);

  return (
    <section
      id="matching-section"
      className="max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-24"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
          ② 评估最佳学术方向
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-base text-slate-400">
          花 30 秒评估你的学术兴趣，一键解锁最佳契合的导师与路线规划
        </p>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-[#2a3550]/40 bg-[#080c16]/75 backdrop-blur-xl p-1 shadow-[0_16px_48px_-4px_rgba(0,0,0,0.65)]">
        {!quizResult ? (
          <ErrorBoundary fallbackMessage="问卷匹配模块加载失败">
            <Suspense fallback={<PanelFallback label="正在初始化匹配测评舱..." />}>
              <QuizSection
                quiz={quiz}
                professors={professors}
                directions={directions}
                onResult={onQuizResult}
              />
            </Suspense>
          </ErrorBoundary>
        ) : !showReport ? (
          /* Match Ready Portal — unlock card */
          <div className="p-10 text-center space-y-8 animate-fadeIn max-w-3xl mx-auto">
            <div className="inline-flex p-4 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-2 shadow-[0_0_20px_rgba(6,182,212,0.15)] animate-pulse">
              <svg className="w-12 h-12" style={{ animation: 'neon-cool-oscillate 5s ease-in-out infinite' }} fill="none" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id="shield-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00ffcc" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
                <path stroke="url(#shield-grad)" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>

            <div className="space-y-3">
              <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full select-none">
                Analysis Unlocked • 画像分析已就绪
              </span>
              <h3 className="text-3xl font-extrabold text-white tracking-tight pt-2">
                🎉 恭喜！您的专属学术契合画像匹配成功
              </h3>
              <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
                我们的学术特征模型已完美解析您的学术偏好指标，成功锁定了最契合的研究学派与导师体系，并定制生成了您的生涯行动路线图谱。
              </p>
            </div>

            <div className="relative flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 w-full">
              {/* Centered Primary Action Button with real-time shifting gradient */}
              <div className="flex justify-center w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowReport(true)}
                  className="neon-cool-bg px-8 py-4 rounded-2xl text-slate-950 font-black shadow-[0_10px_30px_rgba(0,255,204,0.3)] transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.02] cursor-pointer text-sm tracking-wider flex items-center gap-2"
                >
                  📊 开启我的专属学术匹配报告 & 行动路线图 ➔
                </button>
              </div>

              {/* Secondary Re-match Button (Absolute right on desktop, centered flow on mobile) */}
              <div className="sm:absolute sm:right-6 md:right-8 w-full sm:w-auto flex justify-center sm:block">
                <button
                  type="button"
                  onClick={resetAll}
                  className="px-6 py-4 rounded-2xl bg-[#141b2e] border border-[#2a3550]/80 text-slate-400 hover:text-white hover:bg-[#1a243e] font-bold transition-all duration-200 cursor-pointer text-xs"
                >
                  重新匹配 ✕
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Full report — revealed after unlock */
          <div className="p-8 space-y-8 animate-fadeIn">
            {/* Congratulations header */}
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <div className="inline-flex p-3 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-1 animate-bounce">
                <svg className="w-8 h-8" style={{ animation: 'neon-cool-oscillate 5s ease-in-out infinite' }} fill="none" viewBox="0 0 24 24">
                  <defs>
                    <linearGradient id="check-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00ffcc" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                  <path stroke="url(#check-grad)" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">
                🚀 您已成功解锁最佳学派：【<span className="neon-cool-text">{directions.find(d => d.id === quizResult.direction)?.name || quizResult.direction}</span>】
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                匹配模型通过分析您的研究兴趣偏好，已为您自动过滤最相符的课题、推荐专属导师卡片，并直接在下方为您渲染了个性化科研行动规划图谱。
              </p>
            </div>

            {/* Personalized Roadmap */}
            <div className="border-t border-[#2a3550]/30 pt-8 mt-6">
              <h4 className="text-xl font-black text-white mb-6 flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse" />
                🌟 您的专属科研行动路线规划图
              </h4>
              <ErrorBoundary fallbackMessage="专属路线图加载失败">
                <Suspense fallback={<PanelFallback label="正在定制您的个人学术Timeline规划..." />}>
                  <RoadmapSection
                    directionId={quizResult.direction}
                    directionName={
                      quizResult.directionName ||
                      directions.find((direction) => direction.id === quizResult.direction)?.name ||
                      quizResult.direction
                    }
                    results={quizResult.topResults}
                    directions={directions}
                    professors={professors}
                    onReset={resetAll}
                  />
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
