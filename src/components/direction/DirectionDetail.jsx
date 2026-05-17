import DirectionInfoGrid from './DirectionInfoGrid';
import DirectionJobs from './DirectionJobs';

/**
 * DirectionDetail composes static direction facts without owning UI state.
 */
export default function DirectionDetail({ direction }) {
  return (
    <div className="bg-gradient-to-br from-[#111a2e] to-[#0f1629] p-8 border-t border-[#2a3550]">
      <DirectionInfoGrid direction={direction} />
      <DirectionJobs jobs={direction.jobs} />
    </div>
  );
}
