export default function Footer() {
  return (
    <footer className="border-t border-[#2a3550] bg-[#070b16] mt-16 relative overflow-hidden">
      {/* Soft ambient background glow in the footer */}
      <div className="absolute right-0 bottom-0 w-96 h-96 bg-indigo-950/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 relative z-10">
        {/* Tier 1: Brand, Developer Card & Metadata in exact sequential order */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {/* 1. Brand Info (Advisor Explorer) */}
          <div className="flex flex-col gap-3.5 max-w-sm">
            <a
              href="https://github.com/bestxby/advisor-explorer"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-200 font-extrabold text-lg tracking-wider font-heading hover:text-indigo-400 transition-colors duration-300 group cursor-pointer"
            >
              <span className="group-hover:scale-110 transition-transform duration-300">🗺️</span>
              <span>ADVISOR EXPLORER</span>
            </a>
            <p className="text-xs text-slate-400 leading-relaxed">
              专注于计算机体系结构（Computer Architecture）方向的智能导师匹配、多维学术脉络分析与个性化行动路线图规划平台。
            </p>
          </div>

          {/* 2. Core Developer Card (bestxby) */}
          <div className="flex flex-col gap-3 lg:items-center">
            <div className="w-full max-w-xs flex flex-col gap-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                核心开发者
              </span>
              <a
                href="https://github.com/bestxby"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 hover:from-indigo-500/20 hover:via-purple-500/20 hover:to-pink-500/20 border border-indigo-500/30 hover:border-indigo-400/50 rounded-2xl text-slate-200 hover:text-white transition-all duration-300 shadow-lg shadow-indigo-500/5 group cursor-pointer w-full"
              >
                <svg
                  className="w-7 h-7 text-indigo-400 group-hover:text-indigo-300 transition-colors group-hover:scale-110 transition-transform duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                  />
                </svg>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-base font-extrabold tracking-wide font-heading">
                    bestxby
                  </span>
                  <span className="text-xs text-slate-400 mt-1 font-medium group-hover:text-slate-300 transition-colors">
                    GitHub 开发者主页 →
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* 3. Academic Datasets & Dates (Survey & Data sources) */}
          <div className="flex flex-col gap-5 lg:items-end w-full">
            <div className="w-full max-w-xs flex flex-col gap-5">
              {/* Survey Date */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  调查与数据时效
                </span>
                <div className="flex items-center gap-2 text-xs text-slate-300 bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl w-fit">
                  <svg
                    className="w-3.5 h-3.5 text-indigo-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>最近调研日期：2026年5月12日</span>
                </div>
              </div>

              {/* Data Sources */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  多源学术数据支撑
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Semantic Scholar', 'arXiv', 'B站评测', '与非网'].map((source) => (
                    <span
                      key={source}
                      className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-lg text-xs font-semibold text-slate-300 transition-colors cursor-default"
                    >
                      {source}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tier 2: Disclaimer & Copyright/MIT License combined (No dividing line in between) */}
        <div className="border-t border-white/5 my-8 pt-8 text-[10px] text-slate-500 leading-relaxed space-y-4">
          <div className="space-y-2">
            <p>
              <strong className="text-slate-400 font-bold uppercase tracking-wider mr-1">
                免责声明：
              </strong>
              本系统所生成的智能匹配分数、研究方向详解、学术特色解析、犀利导师评价及推荐入门项目等所有信息，均基于互联网已公开的学术文献、文献数据库检索结果、高校官网官方师资介绍，以及各大社交媒体公共讨论舆情。
            </p>
            <p>
              所有分析和评判结论仅作升学志愿填报、高能导师检索、学术兴趣发掘之客观研讨参考，不代表任何高校官方招生立场、院系录取保证或官方指导关系承诺。导师的个人研究重心与指导风格会随时间动态发展变化，请用户在决策前通过官方渠道与实际接触理性交叉评估。
            </p>
          </div>

          <div className="pt-2 text-xs text-slate-500 text-center sm:text-left">
            <span>© {new Date().getFullYear()} Advisor Explorer. Open sourced under the </span>
            <a
              href="https://github.com/bestxby/advisor-explorer/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 underline transition-colors"
            >
              MIT License
            </a>
            <span>.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
