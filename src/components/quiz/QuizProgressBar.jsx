export default function QuizProgressBar({ currentQ, totalQuestions }) {
  const progress = (currentQ / totalQuestions) * 100;

  return (
    <div className="h-1.5 bg-gray-100 dark:bg-[#151d2b]">
      <div
        className="h-full bg-gradient-to-r from-primary to-primary-light transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
