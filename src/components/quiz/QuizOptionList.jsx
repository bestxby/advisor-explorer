function QuizOption({ option, selected, onAnswer }) {
  return (
    <button
      type="button"
      onClick={() => onAnswer(option.tag)}
      className={`
        w-full text-left p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer
        ${
          selected
            ? 'border-primary bg-primary/5 shadow-md dark:shadow-blue-500/10 scale-[1.02]'
            : 'border-gray-100 dark:border-[#2a3550] hover:border-primary/30 dark:hover:border-blue-500/25 hover:bg-gray-50 dark:hover:bg-[#1f2940]/50 hover:shadow-sm'
        }
      `}
    >
      <div className="flex items-start gap-4 min-w-0">
        <span
          className={`
            flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200
            ${
              selected
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-[#151d2b] text-gray-600 dark:text-slate-400 group-hover:bg-gray-200 dark:group-hover:bg-[#2a3550]'
            }
          `}
        >
          {option.label}
        </span>
        <span className="min-w-0 break-words text-gray-700 dark:text-slate-300 leading-relaxed pt-2">
          {option.text}
        </span>
      </div>
    </button>
  );
}

export default function QuizOptionList({ options, selectedOption, onAnswer }) {
  return (
    <div className="grid gap-3">
      {options.map((option) => (
        <QuizOption
          key={option.label}
          option={option}
          selected={selectedOption === option.tag}
          onAnswer={onAnswer}
        />
      ))}
    </div>
  );
}
