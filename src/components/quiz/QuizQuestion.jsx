import QuizFrame from './QuizFrame';
import QuizOptionList from './QuizOptionList';
import QuizProgress from './QuizProgress';
import QuizProgressBar from './QuizProgressBar';

export default function QuizQuestion({
  question,
  currentQ,
  totalQuestions,
  selectedOption,
  onAnswer,
}) {
  return (
    <QuizFrame>
      <QuizProgressBar currentQ={currentQ} totalQuestions={totalQuestions} />

      <div
        className="p-5 sm:p-8 md:p-10 flex flex-col flex-grow overflow-y-auto overflow-x-hidden rounded-b-2xl"
        aria-live="polite"
      >
        <QuizProgress currentQ={currentQ} totalQuestions={totalQuestions} />

        <div key={currentQ} className="animate-slideQuestion">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-slate-100 mb-8 font-heading leading-relaxed">
            {question.text}
          </h3>
          <QuizOptionList
            options={question.options}
            selectedOption={selectedOption}
            onAnswer={onAnswer}
          />
        </div>
      </div>
    </QuizFrame>
  );
}
