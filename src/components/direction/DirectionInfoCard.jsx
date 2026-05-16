import DirectionIcon from './DirectionIcon';

/**
 * Reusable display block for one direction detail field.
 */
export default function DirectionInfoCard({ title, children, icon, tone }) {
  return (
    <div className="bg-white dark:bg-[#0f1629] rounded-xl p-5 border border-gray-100 dark:border-[#2a3550] shadow-sm dark:shadow-black/30">
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`w-7 h-7 rounded-lg ${tone.iconBg} flex items-center justify-center`}
        >
          <DirectionIcon name={icon} className={`w-4 h-4 ${tone.iconText}`} />
        </div>
        <h4 className="font-semibold text-gray-900 dark:text-slate-100 font-heading">
          {title}
        </h4>
      </div>
      {children}
    </div>
  );
}
