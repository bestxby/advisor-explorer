export default function LockedRoadmapPanel() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8" aria-label="行动路线图">
      <div
        id="roadmap-panel"
        role="tabpanel"
        aria-labelledby="roadmap-tab"
        className="bg-white dark:bg-[#131a2b] rounded-2xl border border-gray-100 dark:border-[#2a3550] p-10 text-center"
      >
        <svg
          className="w-12 h-12 text-gray-300 dark:text-[#475569] mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
        <p className="text-gray-500 dark:text-slate-400 text-sm font-medium mb-1">
          完成上方问卷后解锁
        </p>
        <p className="text-gray-400 dark:text-slate-500 text-xs">
          根据你的性格测试结果生成专属行动路线图
        </p>
      </div>
    </section>
  );
}
