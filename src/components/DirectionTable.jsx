import { useState, Fragment } from 'react';
import DirectionDetail from './DirectionDetail';

export default function DirectionTable({ directions, highlightedDirection, sortBy }) {
  const [expandedId, setExpandedId] = useState(null);

  const sorted = [...directions].sort((a, b) => {
    if (sortBy === 'recommendation') return b.recommendation - a.recommendation;
    if (sortBy === 'difficulty') return b.difficulty - a.difficulty;
    if (sortBy === 'salary') return b.salaryCeiling.localeCompare(a.salaryCeiling);
    return 0;
  });

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3 font-medium">方向</th>
              <th className="text-left p-3 font-medium">难度</th>
              <th className="text-left p-3 font-medium">就业面</th>
              <th className="text-left p-3 font-medium">薪资</th>
              <th className="text-left p-3 font-medium">竞争热度</th>
              <th className="text-left p-3 font-medium">推荐</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(d => (
              <Fragment key={d.id}>
                <tr
                  onClick={() => setExpandedId(expandedId === d.id ? null : d.id)}
                  className={`cursor-pointer border-t hover:bg-blue-50 transition-colors ${highlightedDirection === d.id ? 'bg-blue-50 ring-1 ring-blue-300' : ''}`}
                >
                  <td className="p-3">
                    <span className="font-medium">{d.code}. {d.name}</span>
                    <p className="text-xs text-gray-500 mt-0.5">{d.otherTeams.split('、').slice(0, 2).join('、')}等</p>
                  </td>
                  <td className="p-3">{'⭐'.repeat(d.difficulty)}</td>
                  <td className="p-3">{d.jobMarket}</td>
                  <td className="p-3">{d.salaryCeiling}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      d.competitionHeat === '极高' ? 'bg-red-100 text-red-800' :
                      d.competitionHeat === '高' ? 'bg-orange-100 text-orange-800' :
                      d.competitionHeat === '中高' ? 'bg-yellow-100 text-yellow-800' :
                      d.competitionHeat === '中' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {d.competitionHeat}
                    </span>
                  </td>
                  <td className="p-3">{'⭐'.repeat(d.recommendation)}</td>
                </tr>
                {expandedId === d.id && (
                  <tr>
                    <td colSpan="6">
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
