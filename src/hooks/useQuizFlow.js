import { useCallback, useEffect, useRef, useState } from 'react';
import { QUIZ_ANSWER_DELAY_MS } from '../constants';
import { findTopMatches } from '../utils/matching';

function toQuizResult(topMatches) {
  return {
    direction: topMatches[0]?.direction,
    directionName: topMatches[0]?.directionName,
    professors: topMatches[0]?.professors,
    topResults: topMatches,
  };
}

export default function useQuizFlow({ quiz, professors, directions, onResult }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const answerDelayRef = useRef(null);

  const clearAnswerDelay = useCallback(() => {
    if (answerDelayRef.current) {
      window.clearTimeout(answerDelayRef.current);
      answerDelayRef.current = null;
    }
  }, []);

  useEffect(() => clearAnswerDelay, [clearAnswerDelay]);

  const handleAnswer = useCallback(
    (tag) => {
      if (selectedOption) return;

      setSelectedOption(tag);

      answerDelayRef.current = window.setTimeout(() => {
        const newAnswers = [...answers, tag];
        setAnswers(newAnswers);
        setSelectedOption(null);
        answerDelayRef.current = null;

        if (currentQ < quiz.questions.length - 1) {
          setCurrentQ(currentQ + 1);
          return;
        }

        const topMatches = findTopMatches({ tags: newAnswers, quiz, professors, directions });
        setResults(topMatches);
        onResult(toQuizResult(topMatches));
      }, QUIZ_ANSWER_DELAY_MS);
    },
    [selectedOption, answers, currentQ, quiz, professors, directions, onResult],
  );

  const reset = useCallback(() => {
    clearAnswerDelay();
    setCurrentQ(0);
    setAnswers([]);
    setResults(null);
    setSelectedOption(null);
    onResult(null);
  }, [clearAnswerDelay, onResult]);

  return {
    currentQuestion: quiz.questions[currentQ],
    currentQ,
    totalQuestions: quiz.questions.length,
    selectedOption,
    results,
    handleAnswer,
    reset,
  };
}
