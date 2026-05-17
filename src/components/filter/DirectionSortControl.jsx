import ControlIcon from './ControlIcon';
import { SELECT_CHEVRON_STYLE, SELECT_CLASS_NAME } from './selectStyles';

const SORT_OPTIONS = [
  { value: 'recommendation', label: '推荐指数' },
  { value: 'salary', label: '薪资天花板' },
  { value: 'difficulty', label: '难度' },
  { value: 'competition', label: '竞争热度' },
];

export default function DirectionSortControl({ sortBy, onSortChange }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
      <div className="flex items-center gap-2 text-slate-400 flex-shrink-0">
        <ControlIcon type="sort" />
        <label htmlFor="direction-sort" className="text-sm font-semibold">
          排序方式
        </label>
      </div>
      <select
        id="direction-sort"
        value={sortBy}
        onChange={(event) => onSortChange(event.target.value)}
        className={SELECT_CLASS_NAME}
        style={SELECT_CHEVRON_STYLE}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
