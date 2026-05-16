import { getJobCountClassName } from '../../utils/directionPresentation';

export default function DirectionJobsTable({ jobs }) {
  return (
    <div className="hidden lg:block overflow-hidden rounded-xl border border-gray-100 dark:border-[#2a3550] shadow-sm dark:shadow-black/30">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-gray-50 dark:from-[#111a2e] to-gray-100 dark:to-[#0f1629]">
            <th className="text-left p-4 font-semibold text-gray-700 dark:text-slate-300 text-xs uppercase tracking-wider">
              公司
            </th>
            <th className="text-left p-4 font-semibold text-gray-700 dark:text-slate-300 text-xs uppercase tracking-wider">
              岗位
            </th>
            <th className="text-left p-4 font-semibold text-gray-700 dark:text-slate-300 text-xs uppercase tracking-wider">
              薪资
            </th>
            <th className="text-left p-4 font-semibold text-gray-700 dark:text-slate-300 text-xs uppercase tracking-wider">
              岗位数量
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
          {jobs.map((job, index) => (
            <tr
              key={`${job.company}-${job.role}-${index}`}
              className="bg-white dark:bg-[#0f1629] hover:bg-gray-50 dark:hover:bg-[#1f2940]/50 transition-colors duration-150"
            >
              <td className="p-4 font-medium text-gray-900 dark:text-slate-100">
                {job.company}
              </td>
              <td className="p-4 text-gray-600 dark:text-slate-400">{job.role}</td>
              <td className="p-4 font-semibold text-primary">{job.salary}</td>
              <td className="p-4">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getJobCountClassName(
                    job.count,
                  )}`}
                >
                  {job.count}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
