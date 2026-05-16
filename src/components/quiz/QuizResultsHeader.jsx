import ExportButton from '../ExportButton';
import QuizResultIcon from './QuizResultIcon';

export default function QuizResultsHeader({ top, results, directions, professors }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
          <QuizResultIcon type="success" className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">匹配完成</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            最佳方向：{top.directionName}，匹配度 {top.score}%
          </p>
        </div>
      </div>
      <ExportButton
        results={results}
        directions={directions}
        professors={professors}
        filename="advisor-explorer-result"
      />
    </div>
  );
}
