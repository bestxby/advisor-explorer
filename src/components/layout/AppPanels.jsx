import { lazy, Suspense, useState } from 'react';
import ErrorBoundary from '../ErrorBoundary';
import ProfessorList from '../professors/ProfessorList';
import PanelFallback from './PanelFallback';
import { useFilter } from '../../context/useFilter';
import DirectionSortControl from '../filter/DirectionSortControl';

const DirectionTable = lazy(() => import('../direction/DirectionTable'));
const QuizSection = lazy(() => import('../quiz/QuizSection'));
const RoadmapSection = lazy(() => import('../roadmap/RoadmapSection'));

export default function AppPanels({
  directions,
  filteredProfessors,
  quizResult,
  sortBy,
  quiz,
  professors,
  onQuizResult,
}) {
  const { 
    selectedDirection, 
    setSelectedDirection, 
    setSortBy
  } = useFilter();

  // Local state for the light-weight Act 3 localized explorer (only 2 tabs!)
  const [act3Tab, setAct3Tab] = useState('professors');

  // Interactive transitional state to reveal matching report with highly premium UX
  const [showReport, setShowReport] = useState(false);

  const act3Tabs = [
    { id: 'professors', label: '导师档案卡', icon: '🎓' },
    { id: 'directions', label: '方向对比总表', icon: '📊' }
  ];

  return (
    <div className="space-y-16 py-8">
      {/* ========================================================
          第二幕：评估最佳学术方向 (Act 2: Quiz & Personalized Roadmap)
         ======================================================== */}
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
            /* 🌟 高端仪式感：测评完成后，弹出的解密开箱报告前置卡片 (Match Ready Portal) */
            <div className="p-10 text-center space-y-8 animate-fadeIn max-w-3xl mx-auto">
              <div className="inline-flex p-4 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/40 text-indigo-400 mb-2 shadow-[0_0_30px_rgba(99,102,241,0.25)] animate-pulse">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowReport(true)}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-black shadow-[0_10px_30px_rgba(99,102,241,0.3)] transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.02] cursor-pointer text-sm tracking-wider flex items-center gap-2"
                >
                  📊 开启我的专属学术匹配报告 & 行动路线图 ➔
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    onQuizResult(null);
                    setShowReport(false);
                    setSelectedDirection('all');
                  }}
                  className="px-6 py-4 rounded-2xl bg-[#141b2e] border border-[#2a3550]/80 text-slate-400 hover:text-white hover:bg-[#1a243e] font-bold transition-all duration-200 cursor-pointer text-xs"
                >
                  重新匹配 ✕
                </button>
              </div>
            </div>
          ) : (
            /* 🌟 全面解密态：用户点击“开启报告”后，完整流式展出个人数据报告 */
            <div className="p-8 space-y-8 animate-fadeIn">
              {/* 匹配祝贺区域 */}
              <div className="text-center max-w-2xl mx-auto space-y-4">
                <div className="inline-flex p-3 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mb-1 animate-bounce">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  🚀 您已成功解锁最佳学派：【{directions.find(d => d.id === quizResult.direction)?.name || quizResult.direction}】
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  匹配模型通过分析您的研究兴趣偏好，已为您自动过滤最相符的课题、推荐专属导师卡片，并直接在下方为您渲染了个性化科研行动规划图谱。
                </p>
              </div>

              {/* 🌟 专属行动路线图：直接在第二幕完美内嵌呈现！ */}
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
                      onReset={() => {
                        onQuizResult(null);
                        setShowReport(false);
                        // Reset custom filter to view all
                        setSelectedDirection('all');
                      }}
                    />
                  </Suspense>
                </ErrorBoundary>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          第三幕：自由学术探索大厅 (Act 3: Localized Dual-Tabbed Explorer)
         ======================================================== */}
      <section 
        id="directions-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 scroll-mt-24"
      >
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl bg-gradient-to-r from-cyan-400 via-teal-300 to-lime-400 bg-clip-text text-transparent">
            ③ 自由学术探索大厅
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-base text-slate-400">
            在下方自由切换导师详情与学派对比总表，开启深度课题探索
          </p>
        </div>

        {/* 🎛️ 本地精美分段页签控制条 (2 Tabs Only) */}
        <div className="flex justify-center">
          <div className="inline-flex p-1 rounded-2xl bg-[#090f19] border border-[#2a3550]/40 shadow-inner">
            {act3Tabs.map((tab) => {
              const isActive = act3Tab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setAct3Tab(tab.id)}
                  className={`
                    px-6 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-300 cursor-pointer select-none flex items-center gap-2
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-indigo-500/40 text-white shadow-md' 
                      : 'border border-transparent text-slate-400 hover:text-slate-200'}
                  `}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                  {tab.id === 'professors' && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-bold ml-1">
                      {filteredProfessors.length}
                    </span>
                  )}
                  {tab.id === 'directions' && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-bold ml-1 animate-pulse">
                      {directions.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Tab 面板渲染区 (Tutors & Comparison Only) ── */}
        <div className="pt-4 min-h-[350px]">
          
          {/* TAB 1: 导师档案卡 */}
          {act3Tab === 'professors' && (
            <div className="space-y-6 animate-fadeIn">
              {/* 控制头部：包含动态切换按钮与排序下拉菜单 */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2a3550]/20 pb-4 mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
                  {selectedDirection === 'all' 
                    ? '全部学派导师档案卡' 
                    : `专属匹配导师群 (学派: ${directions.find(d => d.id === quizResult?.direction)?.name || selectedDirection})`
                  }
                </h3>
                
                <div className="flex flex-wrap items-center gap-3">
                  {/* 仅在已测试状态下，才展示查看全部/仅看专属的快捷键 */}
                  {quizResult && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDirection(selectedDirection === 'all' ? quizResult.direction : 'all');
                      }}
                      className={`
                        px-4 py-2 text-xs font-black tracking-wide rounded-xl border transition-all duration-300 cursor-pointer select-none shadow-md
                        ${selectedDirection === 'all' 
                          ? 'border-indigo-500/40 text-indigo-400 bg-indigo-950/20 hover:bg-indigo-950/40' 
                          : 'border-slate-700/50 text-slate-300 bg-slate-900/40 hover:bg-slate-900/60'}
                      `}
                    >
                      {selectedDirection === 'all' ? '🎯 仅看我的专属匹配导师' : '🌐 查看所有学派导师'}
                    </button>
                  )}
                  <DirectionSortControl sortBy={sortBy} onSortChange={setSortBy} />
                </div>
              </div>
              
              <ErrorBoundary fallbackMessage="导师档案列表加载失败">
                <ProfessorList
                  professors={filteredProfessors}
                  highlightedProfessorIds={quizResult?.professors || []}
                />
              </ErrorBoundary>
            </div>
          )}

          {/* TAB 2: 方向对比总表 */}
          {act3Tab === 'directions' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#2a3550]/20 pb-4 mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  学派方向核心对比维度
                </h3>
              </div>
              <ErrorBoundary fallbackMessage="方向对比总表加载失败">
                <Suspense fallback={<PanelFallback label="正在编排方向对比大表..." />}>
                  <DirectionTable
                    directions={directions}
                    highlightedDirection={quizResult?.direction}
                    sortBy={sortBy}
                  />
                </Suspense>
              </ErrorBoundary>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
