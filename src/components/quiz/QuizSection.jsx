import useQuizFlow from '../../hooks/useQuizFlow';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';

export default function QuizSection({ quiz, professors, directions, onResult }) {
  const quizFlow = useQuizFlow({ quiz, professors, directions, onResult });

  if (quizFlow.results) {
    return (
      <QuizResults
        results={quizFlow.results}
        directions={directions}
        professors={professors}
        onReset={quizFlow.reset}
      />
    );
  }

  return (
    <QuizQuestion
      question={quizFlow.currentQuestion}
      currentQ={quizFlow.currentQ}
      totalQuestions={quizFlow.totalQuestions}
      selectedOption={quizFlow.selectedOption}
      onAnswer={quizFlow.handleAnswer}
    />
  );
}
