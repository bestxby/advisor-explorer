import { useEffect, useRef, useState, useCallback } from 'react';
import { QUIZ_ANSWER_DELAY_MS } from '../constants';
import { findTopMatches } from '../utils/matching';
import ExportButton from './ExportButton';

export default function QuizSection({ quiz, professors, directions, onResult }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const answerDelayRef = useRef(null);

  useEffect(
    () => () => {
      if (answerDelayRef.current) {
        window.clearTimeout(answerDelayRef.current);
      }
    },
    [],
  );

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
        } else {
          const topMatches = findTopMatches({ tags: newAnswers, quiz, professors, directions });
          setResults(topMatches);
          onResult({
            direction: topMatches[0]?.direction,
            directionName: topMatches[0]?.directionName,
            professors: topMatches[0]?.professors,
            topResults: topMatches,
          });
        }
      }, QUIZ_ANSWER_DELAY_MS);
    },
    [selectedOption, answers, currentQ, quiz, professors, directions, onResult],
  );

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
      <div
        className="w-full min-w-0 bg-white dark:bg-[#131a2b] rounded-2xl border border-gray-100 dark:border-[#2a3550] shadow-sm dark:shadow-black/30 h-[500px] md:h-[580px] flex flex-col"
        style={{ maxWidth: 'calc(100vw - 4rem)' }}
      >
        {/* Card header */}
        <div className="px-6 pt-5 pb-3 border-b border-gray-100 dark:border-[#2a3550]">
          <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 tracking-wider uppercase">
            个性化方向匹配
          </p>
        </div>

        <div className="p-5 sm:p-6 md:p-8 flex-grow overflow-y-auto overflow-x-hidden rounded-b-2xl animate-fadeIn">
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
            <ExportButton results={results} directions={directions} professors={professors} filename="advisor-explorer-result" />
          </div>

          {/* Ranked results */}
          <div className="grid gap-3">
            {results.map((r, i) => (
              <div
                key={r.direction}
                className={`relative rounded-xl p-4 border-2 transition-all ${
                  i === 0
                    ? 'border-primary bg-primary/5 shadow-md dark:shadow-blue-500/10'
                    : 'border-gray-100 dark:border-[#2a3550] bg-gray-50 dark:bg-[#151d2b]/50 opacity-75'
                }`}
              >
                {i === 0 && (
                  <div className="absolute -top-2.5 left-4 px-2 py-0.5 bg-primary text-white text-xs font-bold rounded-full">
                    最佳匹配
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        i === 0
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 dark:bg-[#2a3550] text-gray-500 dark:text-slate-400'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={`font-bold min-w-0 break-words ${i === 0 ? 'text-primary' : 'text-gray-700 dark:text-slate-300'}`}
                    >
                      {r.directionName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 dark:bg-[#2a3550] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          i === 0
                            ? 'bg-gradient-to-r from-primary to-primary-light'
                            : 'bg-gray-300 dark:bg-[#3d4f6f]'
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
                {(r.strengths?.length > 0 || r.cautions?.length > 0) && (
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-[#2a3550] space-y-2">
                    {r.strengths?.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">
                          匹配依据
                        </span>
                        {r.strengths.map((signal) => (
                          <span
                            key={`${r.direction}-${signal.tag}`}
                            className="inline-flex max-w-full items-center px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 text-xs"
                          >
                            <span className="truncate">{signal.label}</span>
                          </span>
                        ))}
                      </div>
                    )}
                    {r.cautions?.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">
                          需要注意
                        </span>
                        {r.cautions.map((signal) => (
                          <span
                            key={`${r.direction}-${signal.tag}`}
                            className="inline-flex max-w-full items-center px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-800 text-xs"
                          >
                            <span className="truncate">{signal.label}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Reset button */}
          <div className="mt-4 text-center">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-50 dark:bg-[#151d2b]/50 text-gray-700 dark:text-slate-300 rounded-xl font-semibold border border-gray-200 dark:border-[#2a3550] hover:bg-gray-100 dark:hover:bg-[#1f2940] hover:shadow-sm transition-all duration-200 cursor-pointer text-sm"
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
    <div
      className="w-full min-w-0 bg-white dark:bg-[#131a2b] rounded-2xl border border-gray-100 dark:border-[#2a3550] shadow-sm dark:shadow-black/30 h-[500px] md:h-[580px] flex flex-col"
      style={{ maxWidth: 'calc(100vw - 4rem)' }}
    >
      {/* Card header */}
      <div className="px-6 pt-5 pb-3 border-b border-gray-100 dark:border-[#2a3550]">
        <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 tracking-wider uppercase">
          个性化方向匹配
        </p>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100 dark:bg-[#151d2b]">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary-light transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-5 sm:p-8 md:p-10 flex flex-col flex-grow overflow-y-auto overflow-x-hidden rounded-b-2xl" aria-live="polite">
        {/* Progress indicator */}
        <div className="flex items-center justify-between gap-3 mb-8 min-w-0">
          <div
            className="flex items-center gap-1.5 sm:gap-3 overflow-x-auto pb-1"
            role="group"
            aria-label="问卷进度"
          >
            {quiz.questions.map((_, i) => (
              <div
                key={i}
                className={`
                  flex-shrink-0 w-8 h-8 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300
                  ${
                    i < currentQ
                      ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200'
                      : i === currentQ
                        ? 'bg-primary text-white shadow-md shadow-primary/30 scale-110'
                        : 'bg-gray-100 dark:bg-[#151d2b] text-gray-400 dark:text-slate-500 border-2 border-gray-200 dark:border-[#2a3550]'
                  }
                `}
                aria-current={i === currentQ ? 'step' : undefined}
              >
                {i < currentQ ? (
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
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
          <span className="text-sm font-medium text-gray-500 dark:text-slate-400 flex-shrink-0 ml-2">
            {currentQ + 1} / {quiz.questions.length}
          </span>
        </div>

        {/* Question — spatial slide transition */}
        <div key={currentQ} className="animate-slideQuestion">
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
                      selectedOption === opt.tag
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-[#151d2b] text-gray-600 dark:text-slate-400 group-hover:bg-gray-200 dark:group-hover:bg-[#2a3550]'
                    }
                  `}
                  >
                    {opt.label}
                  </span>
                  <span className="min-w-0 break-words text-gray-700 dark:text-slate-300 leading-relaxed pt-2">
                    {opt.text}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
