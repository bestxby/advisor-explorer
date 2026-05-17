import ProfessorIcon from './ProfessorIcon';

export default function ProfessorStarterProject({ project }) {
  return (
    <section className="relative">
      <div className="absolute -left-3 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-full" />
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 from-emerald-900/20 to-teal-900/20 rounded-xl p-6 border border-emerald-800/50">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-900/30 flex items-center justify-center">
            <ProfessorIcon type="play" className="w-4 h-4 text-emerald-600 text-emerald-400" />
          </div>
          <h4 className="font-semibold text-slate-100 text-lg font-heading">
            大三入门项目
          </h4>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          {project}
        </p>
      </div>
    </section>
  );
}
