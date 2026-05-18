import { lazy, Suspense, useState } from 'react';
import ErrorBoundary from '../ErrorBoundary';
import ProfessorList from '../professors/ProfessorList';
import PanelFallback from './PanelFallback';
import DirectionSortControl from '../filter/DirectionSortControl';

const DirectionTable = lazy(() => import('../direction/DirectionTable'));

const ACT3_TABS = [
  { id: 'professors', label: '导师档案卡', icon: '🎓' },
  { id: 'directions', label: '方向对比总表', icon: '📊' },
];

/**
 * Act 3: Free Academic Exploration Hall.
 *
 * Owns the local tab state (professors / directions) and renders
 * the appropriate sub-panel. No quiz business logic leaks in here.
 */
export default function ActThreePanel({
  directions,
  filteredProfessors,
  quizResult,
  sortBy,
  selectedDirection,
  onDirectionToggle,
  onSortChange,
}) {
  const [activeTab, setActiveTab] = useState('professors');

  return (
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

      {/* Tab bar */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 rounded-2xl bg-[#090f19] border border-[#2a3550]/40 shadow-inner">
          {ACT3_TABS.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
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

      {/* Tab content */}
      <div className="pt-4 min-h-[350px]">

        {/* TAB 1: Professor cards */}
        {activeTab === 'professors' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2a3550]/20 pb-4 mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
                {selectedDirection === 'all'
                  ? '全部学派导师档案卡'
                  : `专属匹配导师群 (学派: ${directions.find(d => d.id === quizResult?.direction)?.name || selectedDirection})`
                }
              </h3>

              <div className="flex flex-wrap items-center gap-3">
                {quizResult && (
                  <button
                    type="button"
                    onClick={onDirectionToggle}
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
                <DirectionSortControl sortBy={sortBy} onSortChange={onSortChange} />
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

        {/* TAB 2: Direction comparison table */}
        {activeTab === 'directions' && (
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
  );
}
