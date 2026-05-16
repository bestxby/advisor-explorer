import DirectionInfoGrid from './DirectionInfoGrid';
import DirectionJobs from './DirectionJobs';

/**
 * DirectionDetail composes static direction facts without owning UI state.
 */
export default function DirectionDetail({ direction }) {
  return (
    <div className="bg-gradient-to-br from-gray-50 dark:from-[#111a2e] to-white dark:to-[#0f1629] p-8 border-t border-gray-100 dark:border-[#2a3550]">
      <DirectionInfoGrid direction={direction} />
      <DirectionJobs jobs={direction.jobs} />
    </div>
  );
}
