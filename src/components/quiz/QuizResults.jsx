import QuizFrame from './QuizFrame';
import QuizResetButton from './QuizResetButton';
import QuizResultCard from './QuizResultCard';
import QuizResultsHeader from './QuizResultsHeader';

export default function QuizResults({ results, directions, professors, onReset }) {
  const top = results[0];

  return (
    <QuizFrame>
      <div className="p-5 sm:p-6 md:p-8 flex-grow overflow-y-auto overflow-x-hidden rounded-b-2xl animate-fadeIn">
        <QuizResultsHeader
          top={top}
          results={results}
          directions={directions}
          professors={professors}
        />

        <div className="grid gap-3">
          {results.map((result, index) => (
            <QuizResultCard key={result.direction} result={result} index={index} />
          ))}
        </div>

        <QuizResetButton onReset={onReset} />
      </div>
    </QuizFrame>
  );
}
