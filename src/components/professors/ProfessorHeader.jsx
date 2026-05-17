export default function ProfessorHeader({ professor, colors, expanded }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <h3 className="text-lg font-bold text-slate-100 font-heading group-hover:text-primary transition-colors duration-200">
            {professor.name}
          </h3>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${colors.bg} ${colors.text} ${colors.border} border`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
            {professor.university} · {professor.department}
          </span>
        </div>
        <p className="text-slate-400 text-xs leading-relaxed line-clamp-1">
          {professor.tagline}
        </p>
      </div>

      <div
        className={`
        flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center
        transition-all duration-300 ease-out
        ${
          expanded
            ? 'bg-primary text-white rotate-180 shadow-sm shadow-black/30'
            : 'bg-[#111a2e] text-slate-400 group-hover:bg-[#2a3550]'
        }
      `}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
