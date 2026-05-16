import ProfessorIcon from './ProfessorIcon';

export default function ProfessorMeta({ style, contact }) {
  return (
    <div className="flex flex-wrap gap-6 text-sm text-gray-500 dark:text-slate-400 pt-4 border-t border-gray-100 dark:border-[#2a3550]">
      <div className="flex items-center gap-2">
        <ProfessorIcon type="user" className="w-4 h-4" strokeWidth={1.5} />
        <span>导师风格：{style}</span>
      </div>
      <div className="flex items-center gap-2">
        <ProfessorIcon type="mail" className="w-4 h-4" strokeWidth={1.5} />
        <span>联系方式：{contact}</span>
      </div>
    </div>
  );
}
