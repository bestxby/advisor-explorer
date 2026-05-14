import { useEffect, useRef, useState } from 'react';
import { QUIZ_ANSWER_DELAY_MS } from '../constants';
import ExportButton from './ExportButton';

export default function QuizSection({ quiz, professors, directions, onResult }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const answerDelayRef = useRef(null);
  const exportRef = useRef(null);

  useEffect(
    () => () => {
      if (answerDelayRef.current) {
        window.clearTimeout(answerDelayRef.current);
      }
    },
    [],
  );

  const handleAnswer = (tag) => {
    if (selectedOption) return;

    setSelectedOption(tag);

    answerDelayRef.current = window.setTimeout(() => {
      const newAnswers = [...answers, tag];
      setAnswers(newAnswers);
      setSelectedOption(null);
      answerDelayRef.current = null;

      if (currentQ < quiz.questions.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        const topMatches = findTopMatches(newAnswers);
        setResults(topMatches);
        onResult({
          direction: topMatches[0]?.direction,
          directionName: topMatches[0]?.directionName,
          professors: topMatches[0]?.professors,
          topResults: topMatches,
        });
      }
    }, QUIZ_ANSWER_DELAY_MS);
  };

  const findTopMatches = (tags) => {
    const { dimensionWeights, directionProfiles, defaultRecommendation } = quiz;

    const scored = Object.entries(directionProfiles).map(([dirId, profile]) => {
      let rawScore = 0;

      tags.forEach((tag, qIndex) => {
        const weight = dimensionWeights[String(qIndex)] || 0.2;
        const tagScore = (profile.positive?.[tag] || 0) + (profile.negative?.[tag] || 0);
        rawScore += tagScore * weight;
      });

      return { direction: dirId, rawScore };
    });

    scored.sort((a, b) => b.rawScore - a.rawScore);

    const maxScore = scored[0]?.rawScore || 0;

    if (maxScore <= 0) {
      return [
        {
          direction: defaultRecommendation.direction,
          score: 60,
          professors: defaultRecommendation.professors,
          reason: defaultRecommendation.reason,
        },
      ];
    }

    const top3 = scored.slice(0, 3).map((item) => ({
      direction: item.direction,
      score: Math.max(0, Math.round((item.rawScore / maxScore) * 100)),
      rawScore: item.rawScore,
    }));

    if (top3.length === 0) {
      return [
        {
          direction: defaultRecommendation.direction,
          score: 60,
          professors: defaultRecommendation.professors,
          reason: defaultRecommendation.reason,
        },
      ];
    }

    return top3.map((match, i) => {
      const dir = directions.find((d) => d.id === match.direction);
      const profs = professors.filter((p) => p.directionId === match.direction).map((p) => p.id);
      return {
        ...match,
        rank: i + 1,
        directionName: dir?.name || match.direction,
        professors: profs,
      };
    });
  };

  const reset = () => {
    if (answerDelayRef.current) {
      window.clearTimeout(answerDelayRef.current);
      answerDelayRef.current = null;
    }
    setCurrentQ(0);
    setAnswers([]);
    setResults(null);
    setSelectedOption(null);
    onResult(null);
  };

  if (results) {
    const top = results[0];
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm dark:shadow-slate-900/50 overflow-hidden">
        {/* Card header */}
        <div className="px-6 pt-5 pb-3 border-b border-gray-100 dark:border-slate-700">
          <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 tracking-wider uppercase">
            个性化方向匹配
          </p>
        </div>

        <div ref={exportRef} className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">匹配完成</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  最佳方向：{top.directionName}，匹配度 {top.score}%
                </p>
              </div>
            </div>
            <ExportButton targetRef={exportRef} filename="advisor-explorer-result" />
          </div>

          {/* Ranked results */}
          <div className="grid gap-3">
            {results.map((r, i) => (
              <div
                key={r.direction}
                className={`relative rounded-xl p-4 border-2 transition-all ${
                  i === 0
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50 opacity-75'
                }`}
              >
                {i === 0 && (
                  <div className="absolute -top-2.5 left-4 px-2 py-0.5 bg-primary text-white text-xs font-bold rounded-full">
                    最佳匹配
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        i === 0
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 dark:bg-slate-600 text-gray-500 dark:text-slate-400'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={`font-bold ${i === 0 ? 'text-primary' : 'text-gray-700 dark:text-slate-300'}`}
                    >
                      {r.directionName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          i === 0
                            ? 'bg-gradient-to-r from-primary to-primary-light'
                            : 'bg-gray-300 dark:bg-slate-500'
                        }`}
                        style={{ width: `${r.score}%` }}
                      />
                    </div>
                    <span
                      className={`text-sm font-bold ${i === 0 ? 'text-primary' : 'text-gray-500 dark:text-slate-400'}`}
                    >
                      {r.score}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reset button */}
          <div className="mt-4 text-center">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-50 dark:bg-slate-700/50 text-gray-700 dark:text-slate-300 rounded-xl font-semibold border border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 hover:shadow-sm transition-all duration-200 cursor-pointer text-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
                />
              </svg>
              重新测试
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQ];
  const progress = (currentQ / quiz.questions.length) * 100;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm dark:shadow-slate-900/50 overflow-hidden">
      {/* Card header */}
      <div className="px-6 pt-5 pb-3 border-b border-gray-100 dark:border-slate-700">
        <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 tracking-wider uppercase">
          个性化方向匹配
        </p>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100 dark:bg-slate-700">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary-light transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-8 md:p-10">
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            {quiz.questions.map((_, i) => (
              <div
                key={i}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                  ${
                    i < currentQ
                      ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200'
                      : i === currentQ
                        ? 'bg-primary text-white shadow-md shadow-primary/30 scale-110'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500 border-2 border-gray-200 dark:border-slate-600'
                  }
                `}
              >
                {i < currentQ ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
            ))}
          </div>
          <span className="text-sm font-medium text-gray-500 dark:text-slate-400">
            {currentQ + 1} / {quiz.questions.length}
          </span>
        </div>

        {/* Question */}
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-slate-100 mb-8 font-heading leading-relaxed">
          {question.text}
        </h3>

        {/* Options */}
        <div className="grid gap-3">
          {question.options.map((opt) => (
            <button
              key={opt.label}
              onClick={() => handleAnswer(opt.tag)}
              className={`
                w-full text-left p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer
                ${
                  selectedOption === opt.tag
                    ? 'border-primary bg-primary/5 shadow-md scale-[1.02]'
                    : 'border-gray-100 dark:border-slate-700 hover:border-primary/30 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:shadow-sm'
                }
              `}
            >
              <div className="flex items-start gap-4">
                <span
                  className={`
                  flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200
                  ${
                    selectedOption === opt.tag
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 group-hover:bg-gray-200 dark:group-hover:bg-slate-600'
                  }
                `}
                >
                  {opt.label}
                </span>
                <span className="text-gray-700 dark:text-slate-300 leading-relaxed pt-2">
                  {opt.text}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
