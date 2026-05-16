import ControlIcon from './ControlIcon';
import { SELECT_CHEVRON_STYLE, SELECT_CLASS_NAME } from './selectStyles';

export default function DirectionFilterControl({
  directions,
  selectedDirection,
  onDirectionChange,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
      <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 flex-shrink-0">
        <ControlIcon type="filter" />
        <label htmlFor="direction-filter" className="text-sm font-semibold">
          方向筛选
        </label>
      </div>
      <select
        id="direction-filter"
        value={selectedDirection}
        onChange={(event) => onDirectionChange(event.target.value)}
        className={SELECT_CLASS_NAME}
        style={SELECT_CHEVRON_STYLE}
      >
        <option value="all">全部方向</option>
        {directions.map((direction) => (
          <option key={direction.id} value={direction.id}>
            {direction.code}. {direction.name}
          </option>
        ))}
      </select>
    </div>
  );
}
