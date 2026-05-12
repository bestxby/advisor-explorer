export default function FilterBar({ directions, selectedDirection, onDirectionChange, sortBy, onSortChange }) {
  return (
    <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-3 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">方向筛选：</label>
          <select
            value={selectedDirection}
            onChange={e => onDirectionChange(e.target.value)}
            className="border rounded-lg px-3 py-1.5 text-sm bg-white"
          >
            <option value="all">全部方向</option>
            {directions.map(d => (
              <option key={d.id} value={d.id}>{d.code}. {d.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">排序：</label>
          <select
            value={sortBy}
            onChange={e => onSortChange(e.target.value)}
            className="border rounded-lg px-3 py-1.5 text-sm bg-white"
          >
            <option value="recommendation">推荐指数</option>
            <option value="salary">薪资天花板</option>
            <option value="difficulty">难度</option>
            <option value="competition">竞争热度</option>
          </select>
        </div>
      </div>
    </div>
  );
}
