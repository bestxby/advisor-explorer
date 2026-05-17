export default function QuizProgressBar({ currentQ, totalQuestions }) {
  const progress = (currentQ / totalQuestions) * 100;

  return (
    <div className="h-1.5 bg-[#111a2e]">
      <div
        className="h-full bg-gradient-to-r from-primary to-primary-light transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
