


export default function Header({ kpiSection }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-primary focus:rounded-lg focus:shadow-lg focus:text-sm focus:font-semibold"
      >
        跳转到主要内容
      </a>
      <header
        data-animate="header"
        className="bg-transparent text-white min-h-[100svh] flex flex-col justify-start px-4 sm:px-6 lg:px-8 xl:px-10 relative overflow-hidden"
      >

      <div className="w-full max-w-full xl:max-w-[1800px] mx-auto relative z-10 pt-8 sm:pt-10 pb-8">
        {/* Single-column layout for brand content */}
        <div className="flex flex-col gap-8 lg:gap-12 xl:gap-20 items-start min-w-0">
          {/* Left column: brand content */}
          <div
            className="flex flex-col gap-5 xl:gap-8 min-w-0 w-full xl:max-w-3xl"
          >
            {/* Logo row - links to your GitHub repository */}
            <a
              href="https://github.com/bestxby/advisor-explorer"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:opacity-90 transition-opacity group cursor-pointer"
            >
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm group-hover:bg-white/15 group-hover:scale-105 transition-all duration-300">
                <svg
                  className="w-6 h-6 text-white/80 group-hover:text-white transition-colors duration-300"
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
              <span className="text-base font-medium text-white/60 tracking-wide uppercase group-hover:text-white/90 transition-colors duration-300 font-heading">
                Advisor Explorer
              </span>
            </a>

            {/* Main title */}
            <h1 data-parallax="slow" className="mt-4 min-w-0 text-[3.6rem] sm:text-[4.3rem] md:text-[5.2rem] lg:text-[5.6rem] xl:text-[6.2rem] font-black leading-[1] font-heading tracking-[-0.02em]">
              <span className="whitespace-nowrap">计算机体系结构</span>
              <br />
              <span className="text-accent-light bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent inline-block mt-2">方向导航</span>
            </h1>

            {/* Badges */}
            <div data-parallax="fast" className="grid grid-cols-2 gap-2 max-w-[18rem]">
              {[
                {
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  ),
                  label: '就业优先',
                },
                {
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  ),
                  label: '论文验证',
                },
                {
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  ),
                  label: '犀利评价',
                },
                {
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-3.73m0 0l-1.92 5.27m1.92-5.27l5.27 1.92M17.7 15.17l5.1-3.73m0 0l1.92 5.27m-1.92-5.27l-5.27 1.92M6.54 8.83l5.1 3.73m0 0l1.92-5.27M11.64 12.56l-5.27-1.92M17.7 8.83l-5.1 3.73m0 0l-1.92-5.27m1.92 5.27l5.27-1.92" />
                    </svg>
                  ),
                  label: '实操项目',
                },
              ].map(({ icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center justify-center sm:justify-start gap-2 bg-white/10 backdrop-blur-sm px-4 sm:px-5 py-3.5 min-h-[48px] rounded-full text-sm sm:text-base font-medium border border-white/10 hover:bg-white/15 transition-colors duration-200 min-w-0"
                >
                  {icon}
                  <span className="min-w-0 truncate">{label}</span>
                </span>
              ))}
            </div>
          </div>


        </div>

        {/* KPI 概览 */}
        {kpiSection && <div className="mt-[14.5rem] mb-2">{kpiSection}</div>}
      </div>

      {/* Bottom fade — blends header into content area */}
      <div className="header-bottom-fade" aria-hidden="true" />
    </header>
    </>
  );
}
