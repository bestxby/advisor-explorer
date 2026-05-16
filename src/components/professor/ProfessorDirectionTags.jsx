export default function ProfessorDirectionTags({ directions }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-2 min-w-0">
      {directions.map((direction) => (
        <span
          key={direction}
          className="inline-flex items-center px-2 py-0.5 bg-gray-50 dark:bg-[#151d2b]/50 text-gray-600 dark:text-slate-400 text-xs rounded border border-gray-100 dark:border-[#2a3550] max-w-full break-words"
        >
          {direction}
        </span>
      ))}
    </div>
  );
}
