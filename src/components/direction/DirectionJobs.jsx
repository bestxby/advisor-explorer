import DirectionIcon from './DirectionIcon';
import DirectionJobsMobile from './DirectionJobsMobile';
import DirectionJobsTable from './DirectionJobsTable';

export default function DirectionJobs({ jobs }) {
  return (
    <section className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
          <DirectionIcon name="jobs" className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h4 className="font-semibold text-gray-900 dark:text-slate-100 text-lg font-heading">
          对口岗位
        </h4>
      </div>

      <DirectionJobsMobile jobs={jobs} />
      <DirectionJobsTable jobs={jobs} />
    </section>
  );
}
