import ThemeToggle from './ThemeToggle';

export default function Header({ children, kpiSection }) {
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
        className="snap-start bg-gradient-to-br from-primary-dark via-primary to-primary-light dark:from-[#080c14] dark:via-[#0f1d35] dark:to-[#080c14] text-white min-h-[100svh] flex flex-col justify-center px-8 md:px-10 relative overflow-hidden"
      >
      {/* Subtle pattern overlay - hidden in dark mode */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-10 dark:opacity-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Lusion-style ambient glow — dark mode only */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-0 dark:opacity-100 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 55% 45%, rgba(30, 64, 175, 0.15) 0%, rgba(59, 130, 246, 0.06) 40%, transparent 75%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-0 dark:opacity-100 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.05) 0%, transparent 50%)',
        }}
      />

      <div className="w-full max-w-[95%] xl:max-w-[1800px] mx-auto relative z-10 py-8">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[4.5fr_5.5fr] gap-12 xl:gap-20 items-start">
          {/* Left column: brand content */}
          <div className="md:col-span-1 flex flex-col gap-5 xl:gap-8 pt-2">
            {/* Theme toggle - above title */}
            <ThemeToggle />

            {/* Logo row */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 dark:bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <svg
                  className="w-6 h-6"
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
              <span className="text-base font-medium text-white/80 dark:text-white/60 tracking-wide uppercase">
                Advisor Explorer
              </span>
            </div>

            {/* Main title */}
            <h1 data-parallax="slow" className="text-[2.75rem] sm:text-[3.5rem] md:text-[4.25rem] lg:text-[5rem] xl:text-[5.5rem] font-black leading-[1.05] font-heading tracking-tight dark:tracking-[-0.02em]">
              计算机体系结构
              <br />
              <span className="text-accent-light dark:bg-gradient-to-r dark:from-amber-300 dark:to-orange-400 dark:bg-clip-text dark:text-transparent">方向导航</span>
            </h1>

            {/* Badges */}
            <div data-parallax="fast" className="flex flex-wrap gap-2">
              {[
                {
                  icon: (
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
                        d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  ),
                  label: '就业优先',
                },
                {
                  icon: (
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
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      />
                    </svg>
                  ),
                  label: '论文验证',
                },
                {
                  icon: (
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
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      />
                    </svg>
                  ),
                  label: '犀利评价',
                },
                {
                  icon: (
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
                        d="M11.42 15.17l-5.1-3.73m0 0l-1.92 5.27m1.92-5.27l5.27 1.92M17.7 15.17l5.1-3.73m0 0l1.92 5.27m-1.92-5.27l-5.27 1.92M6.54 8.83l5.1 3.73m0 0l1.92-5.27M11.64 12.56l-5.27-1.92M17.7 8.83l-5.1 3.73m0 0l-1.92-5.27m1.92 5.27l5.27-1.92"
                      />
                    </svg>
                  ),
                  label: '实操项目',
                },
              ].map(({ icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 bg-white/20 dark:bg-white/10 backdrop-blur-sm px-5 py-3.5 min-h-[48px] rounded-full text-base font-medium border border-white/20 dark:border-white/10 hover:bg-white/30 dark:hover:bg-white/15 transition-colors duration-200"
                >
                  {icon}
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Right column: quiz questionnaire */}
          <div className="md:col-span-1">
            <div data-parallax="med" className="bg-white/10 dark:bg-[#131a2b]/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-[#2a3550]/60 h-full flex flex-col overflow-y-auto overflow-x-hidden dark:shadow-[0_0_60px_-12px_rgba(30,64,175,0.12)]">
              {children}
            </div>
          </div>
        </div>

        {/* KPI 概览 */}
        {kpiSection && <div className="mt-8 xl:mt-10 mb-2">{kpiSection}</div>}
      </div>
    </header>
    </>
  );
}
