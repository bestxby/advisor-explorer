import { getJobCountClassName } from '../../utils/directionPresentation';

export default function DirectionJobsMobile({ jobs }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:hidden">
      {jobs.map((job, index) => (
        <div
          key={`${job.company}-${job.role}-${index}`}
          className="bg-white dark:bg-[#131a2b] rounded-xl p-4 border border-gray-100 dark:border-[#2a3550] shadow-sm dark:shadow-black/30"
        >
          <p className="font-semibold text-gray-900 dark:text-slate-100 text-sm mb-2">
            {job.company}
          </p>
          <p className="text-xs text-gray-600 dark:text-slate-400 mb-3">{job.role}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-primary">{job.salary}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${getJobCountClassName(
                job.count,
                'mobile',
              )}`}
            >
              {job.count}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
