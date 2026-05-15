export default function ResourceCard({ name, url, description }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${name}，在新窗口打开`}
      className="group block bg-white dark:bg-[#151d2e] rounded-xl border border-gray-100 dark:border-[#2a3550] p-5 hover:shadow-md hover:border-gray-200 dark:hover:border-[#3d4f6f] dark:hover:shadow-[#0e1320]/50 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-900 dark:bg-[#161d2e] flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors duration-200">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900 dark:text-slate-100 text-sm group-hover:text-primary transition-colors duration-200 truncate">
              {name}
            </span>
            <svg
              aria-hidden="true"
              className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </a>
  );
}
