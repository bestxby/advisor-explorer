import { Fragment, useMemo, useState } from 'react';
import DirectionDetail from './DirectionDetail';
import { HEAT_ORDER } from '../constants';
const HEAT_STYLES = {
  极高: 'bg-red-50 text-red-700 border-red-200',
  高: 'bg-orange-50 text-orange-700 border-orange-200',
  中高: 'bg-amber-50 text-amber-700 border-amber-200',
  中: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  低: 'bg-gray-50 text-gray-600 border-gray-200',
};

function getSalaryNum(salaryCeiling) {
  const match = String(salaryCeiling || '').match(/(\d+)/);
  return match ? Number.parseInt(match[1], 10) : 0;
}

const sortFunctions = {
  recommendation: (a, b) => b.recommendation - a.recommendation,
  difficulty: (a, b) => b.difficulty - a.difficulty,
  salary: (a, b) => getSalaryNum(b.salaryCeiling) - getSalaryNum(a.salaryCeiling),
  competition: (a, b) =>
    (HEAT_ORDER[b.competitionHeat] || 0) - (HEAT_ORDER[a.competitionHeat] || 0),
};

function DifficultyDots({ level, max = 5 }) {
  return (
    <div className="flex items-center gap-1" role="img" aria-label={`难度 ${level}/${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${
            i < level
              ? level >= 4
                ? 'bg-red-400'
                : level >= 3
                  ? 'bg-orange-400'
                  : 'bg-emerald-400'
              : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

function RecommendationBadge({ level }) {
  const colors = {
    5: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    4: 'bg-blue-100 text-blue-700 border-blue-200',
    3: 'bg-gray-100 text-gray-600 border-gray-200',
    2: 'bg-orange-100 text-orange-700 border-orange-200',
    1: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${colors[level] || colors[3]}`}
    >
      {'★'.repeat(level)}
    </span>
  );
}

export default function DirectionTable({ directions, highlightedDirection, sortBy }) {
  const [expandedId, setExpandedId] = useState(null);

  const sorted = useMemo(
    () => [...directions].sort(sortFunctions[sortBy] || sortFunctions.recommendation),
    [directions, sortBy],
  );

  const getHeatStyle = (heat) => HEAT_STYLES[heat] || HEAT_STYLES['中'];

  const toggleDirection = (id) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  const handleDirectionKeyDown = (event, id) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleDirection(id);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Mobile cards view */}
      <div className="grid grid-cols-1 gap-4 p-4 lg:hidden">
        {sorted.map((d) => (
          <div
            key={d.id}
            data-animate="direction-row"
            role="button"
            tabIndex={0}
            aria-expanded={expandedId === d.id}
            aria-controls={`direction-detail-mobile-${d.id}`}
            className={`
              rounded-xl border-2 transition-all duration-200 cursor-pointer
              ${
                highlightedDirection === d.id
                  ? 'border-primary shadow-md ring-4 ring-primary/10'
                  : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
              }
            `}
            onClick={() => toggleDirection(d.id)}
            onKeyDown={(event) => handleDirectionKeyDown(event, d.id)}
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="text-xs font-bold text-gray-400 mb-1 block">{d.code}</span>
                  <h3 className="font-bold text-gray-900 font-heading text-lg">{d.name}</h3>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    expandedId === d.id
                      ? 'bg-primary text-white rotate-180'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs text-gray-500 block mb-1">难度</span>
                  <DifficultyDots level={d.difficulty} />
                </div>
                <div>
                  <span className="text-xs text-gray-500 block mb-1">推荐</span>
                  <RecommendationBadge level={d.recommendation} />
                </div>
                <div>
                  <span className="text-xs text-gray-500 block mb-1">就业面</span>
                  <span className="font-medium text-gray-900">{d.jobMarket}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block mb-1">薪资</span>
                  <span className="font-medium text-primary">{d.salaryCeiling}</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getHeatStyle(d.competitionHeat)}`}
                >
                  竞争：{d.competitionHeat}
                </span>
              </div>
            </div>

            {expandedId === d.id && (
              <div id={`direction-detail-mobile-${d.id}`}>
                <DirectionDetail direction={d} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <th className="text-left p-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">
                方向
              </th>
              <th className="text-left p-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">
                难度
              </th>
              <th className="text-left p-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">
                就业面
              </th>
              <th className="text-left p-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">
                薪资天花板
              </th>
              <th className="text-left p-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">
                竞争热度
              </th>
              <th className="text-left p-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">
                推荐
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sorted.map((d) => (
              <Fragment key={d.id}>
                <tr
                  data-animate="direction-row"
                  role="button"
                  tabIndex={0}
                  aria-expanded={expandedId === d.id}
                  aria-controls={`direction-detail-desktop-${d.id}`}
                  onClick={() => toggleDirection(d.id)}
                  onKeyDown={(event) => handleDirectionKeyDown(event, d.id)}
                  className={`
                    cursor-pointer transition-all duration-200
                    ${
                      highlightedDirection === d.id
                        ? 'bg-primary/5 hover:bg-primary/10'
                        : 'bg-white hover:bg-gray-50'
                    }
                  `}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {highlightedDirection === d.id && (
                        <div className="w-1 h-10 bg-primary rounded-full" />
                      )}
                      <div>
                        <span className="font-bold text-gray-900 font-heading">
                          {d.code}. {d.name}
                        </span>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {d.otherTeams.split('、').slice(0, 2).join('、')}等
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <DifficultyDots level={d.difficulty} />
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-gray-700">{d.jobMarket}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-primary">{d.salaryCeiling}</span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getHeatStyle(d.competitionHeat)}`}
                    >
                      {d.competitionHeat}
                    </span>
                  </td>
                  <td className="p-4">
                    <RecommendationBadge level={d.recommendation} />
                  </td>
                </tr>
                {expandedId === d.id && (
                  <tr>
                    <td id={`direction-detail-desktop-${d.id}`} colSpan="6" className="p-0">
                      <DirectionDetail direction={d} />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
