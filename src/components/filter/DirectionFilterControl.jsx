import ControlIcon from './ControlIcon';

export default function DirectionFilterControl({
  directions,
  selectedDirection,
  onDirectionChange,
}) {
  const getThemeColorClass = (id) => {
    switch (id) {
      case 'ai-compiler':
        return 'border-cyan-500/30 text-cyan-400 bg-cyan-950/20 hover:bg-cyan-950/40 shadow-cyan-500/5 hover:shadow-cyan-500/10';
      case 'llm-system':
        return 'border-purple-500/30 text-purple-400 bg-purple-950/20 hover:bg-purple-950/40 shadow-purple-500/5 hover:shadow-purple-500/10';
      case 'edge-ai':
        return 'border-lime-500/30 text-lime-400 bg-lime-950/20 hover:bg-lime-950/40 shadow-lime-500/5 hover:shadow-lime-500/10';
      default:
        return 'border-slate-700/50 text-slate-300 bg-slate-900/40 hover:bg-slate-900/60 shadow-slate-500/5';
    }
  };

  const getActiveThemeClass = (id) => {
    switch (id) {
      case 'ai-compiler':
        return 'border-cyan-400 text-white bg-cyan-500/20 shadow-cyan-500/20 ring-1 ring-cyan-400';
      case 'llm-system':
        return 'border-purple-400 text-white bg-purple-500/20 shadow-purple-500/20 ring-1 ring-purple-400';
      case 'edge-ai':
        return 'border-lime-400 text-white bg-lime-500/20 shadow-lime-500/20 ring-1 ring-lime-400';
      default:
        return 'border-slate-400 text-white bg-slate-800 shadow-slate-500/20 ring-1 ring-slate-400';
    }
  };

  const options = [
    { id: 'all', name: '全部学派', code: 'ALL' },
    ...directions,
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 w-full xl:w-auto">
      <div className="flex items-center gap-2 text-slate-400 flex-shrink-0">
        <ControlIcon type="filter" />
        <span className="text-xs font-black tracking-wider uppercase text-slate-400">
          极光主题切换
        </span>
      </div>
      <div className="flex flex-wrap gap-2 w-full md:w-auto">
        {options.map((option) => {
          const isActive = selectedDirection === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onDirectionChange(option.id)}
              className={`
                px-4 py-2 text-xs font-black tracking-wide rounded-xl border transition-all duration-300 cursor-pointer shadow-md select-none
                ${isActive ? getActiveThemeClass(option.id) : getThemeColorClass(option.id)}
              `}
            >
              <span className="opacity-60 mr-1 text-[10px]">{option.code}</span>
              {option.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
