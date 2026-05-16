import ControlIcon from './ControlIcon';

export default function ActiveDirectionFilter({ directions, selectedDirection, onClear }) {
  const selected = directions.find((direction) => direction.id === selectedDirection);

  return (
    <button
      type="button"
      onClick={onClear}
      aria-label="清除方向筛选"
      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 min-h-[44px] bg-primary/10 text-primary rounded-full text-xs font-medium hover:bg-primary/20 transition-colors duration-200 cursor-pointer"
    >
      <span>{selected?.name}</span>
      <ControlIcon type="close" className="w-3.5 h-3.5" strokeWidth={2.5} />
    </button>
  );
}
