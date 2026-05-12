export default function Header() {
  return (
    <header className="bg-gradient-to-br from-primary-dark via-primary to-primary-light text-white py-16 px-6 relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
          </div>
          <span className="text-sm font-medium text-white/80 tracking-wide uppercase">Academic Research</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight font-heading tracking-tight">
          清华/北大体系结构方向
          <br />
          <span className="text-accent-light">择校调研</span>
        </h1>

        <p className="text-blue-100 text-lg md:text-xl mb-8 max-w-2xl leading-relaxed">
          8位导师 × 8个方向 · 论文深度解读 · 就业数据对比 · 个性化匹配问卷
        </p>

        <div className="flex flex-wrap gap-3">
          {[
            { icon: '💼', label: '就业优先' },
            { icon: '📄', label: '论文验证' },
            { icon: '🔍', label: '犀利评价' },
            { icon: '🛠️', label: '实操项目' },
          ].map(({ icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/20 hover:bg-white/25 transition-colors duration-200"
            >
              <span>{icon}</span>
              {label}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
