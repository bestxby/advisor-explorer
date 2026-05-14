export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-8">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>调研日期：2026年5月12日</span>
          </div>
          <div className="flex items-center gap-3">
            <span>数据来源：</span>
            <div className="flex gap-1.5">
              {['Semantic Scholar', 'arXiv', 'B站', '与非网'].map((source) => (
                <span key={source} className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">
                  {source}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
