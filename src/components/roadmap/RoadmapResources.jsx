export default function RoadmapResources({ resources }) {
  if (!resources?.length) return null;

  return (
    <div className="mt-8 pt-6 border-t border-[#2a3550] min-w-0 overflow-hidden">
      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-3">
        推荐资源
      </h4>
      <div className="flex flex-wrap gap-2">
        {resources.map((resource, index) => (
          <span
            key={`${resource.name}-${index}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#111a2e]/50 border border-[#2a3550] rounded-lg text-sm text-slate-300 min-w-0 max-w-full"
          >
            {resource.url ? (
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors break-words"
              >
                {resource.name}
              </a>
            ) : (
              <span>{resource.name}</span>
            )}
            {resource.note && (
              <span className="text-slate-500 text-xs">
                ({resource.note})
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
