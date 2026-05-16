import ProfessorIcon from './ProfessorIcon';

export default function ProfessorDirectionDetail({ detail }) {
  if (!detail) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
          <ProfessorIcon type="tag" className="w-4 h-4 text-green-600 dark:text-green-400" />
        </div>
        <h4 className="font-semibold text-gray-900 dark:text-slate-100 text-lg font-heading">
          研究方向详解
        </h4>
      </div>
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-100 dark:border-green-800/50">
        <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
          {detail}
        </p>
      </div>
    </section>
  );
}
