import ResourceCard from '../ResourceCard';
import ProfessorIcon from './ProfessorIcon';

export default function ProfessorResources({ resources }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#111a2e] flex items-center justify-center">
          <ProfessorIcon
            type="github"
            className="w-4 h-4 text-gray-700 dark:text-slate-300"
            fill="currentColor"
          />
        </div>
        <h4 className="font-semibold text-gray-900 dark:text-slate-100 text-lg font-heading">
          推荐开源项目
        </h4>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource) => (
          <ResourceCard key={resource.name} {...resource} />
        ))}
      </div>
    </section>
  );
}
