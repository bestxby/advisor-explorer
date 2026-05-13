export default function FilterBar({ directions, selectedDirection, onDirectionChange, sortBy, onSortChange }) {
  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-20 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-gray-500">
            <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
            </svg>
            <label htmlFor="direction-filter" className="text-sm font-semibold">方向筛选</label>
          </div>
          <select
            id="direction-filter"
            value={selectedDirection}
            onChange={e => onDirectionChange(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 cursor-pointer hover:border-gray-300 appearance-none pr-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='%236B7280'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
            }}
          >
            <option value="all">全部方向</option>
            {directions.map(d => (
              <option key={d.id} value={d.id}>{d.code}. {d.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-gray-500">
            <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5-3L16.5 18m0 0L12 13.5m4.5 4.5V6" />
            </svg>
            <label htmlFor="direction-sort" className="text-sm font-semibold">排序方式</label>
          </div>
          <select
            id="direction-sort"
            value={sortBy}
            onChange={e => onSortChange(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 cursor-pointer hover:border-gray-300 appearance-none pr-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='%236B7280'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
            }}
          >
            <option value="recommendation">推荐指数</option>
            <option value="salary">薪资天花板</option>
            <option value="difficulty">难度</option>
            <option value="competition">竞争热度</option>
          </select>
        </div>

        {/* Active filter indicator */}
        {selectedDirection !== 'all' && (
          <button
            type="button"
            onClick={() => onDirectionChange('all')}
            aria-label="清除方向筛选"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium hover:bg-primary/20 transition-colors duration-200 cursor-pointer"
          >
            <span>{directions.find(d => d.id === selectedDirection)?.name}</span>
            <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
