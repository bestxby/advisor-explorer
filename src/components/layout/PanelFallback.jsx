export default function PanelFallback({ label }) {
  return (
    <div className="bg-white dark:bg-[#0f1629] rounded-2xl border border-gray-100 dark:border-[#2a3550] p-8 text-center text-sm text-gray-500 dark:text-slate-400">
      {label}
    </div>
  );
}
