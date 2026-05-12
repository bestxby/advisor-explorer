import { useState } from 'react';

export default function QuizSection({ quiz, onResult }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleAnswer = (tag) => {
    setSelectedOption(tag);

    // Brief delay for visual feedback before transitioning
    setTimeout(() => {
      const newAnswers = [...answers, tag];
      setAnswers(newAnswers);
      setSelectedOption(null);

      if (currentQ < quiz.questions.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        const match = findMatch(newAnswers);
        setResult(match);
        onResult(match);
      }
    }, 200);
  };

  const findMatch = (tags) => {
    let bestMatch = null;
    let bestScore = 0;

    for (const rule of quiz.matchingRules) {
      const score = rule.tags.filter(t => tags.includes(t)).length;
      if (score > bestScore) {
        bestScore = score;
        bestMatch = rule;
      }
    }

    return bestMatch || quiz.defaultRecommendation;
  };

  const reset = () => {
    setCurrentQ(0);
    setAnswers([]);
    setResult(null);
    setSelectedOption(null);
    onResult(null);
  };

  if (result) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border-2 border-blue-100 p-8 md:p-12 text-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-blue-200/30 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-purple-200/30 rounded-full translate-x-1/3 translate-y-1/3 blur-2xl" />

        <div className="relative z-10">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 font-heading">你的推荐方向</h3>

          <div className="bg-white rounded-2xl p-8 inline-block shadow-lg border border-gray-100 max-w-md">
            <p className="text-4xl font-bold text-primary mb-3 font-heading">{result.direction}</p>
            {result.reason && (
              <p className="text-gray-600 mb-6 leading-relaxed">{result.reason}</p>
            )}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-sm text-gray-500">推荐导师：</span>
              {result.professors.map(p => (
                <span key={p} className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                  {p}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={reset}
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
            重新测试
          </button>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQ];
  const progress = ((currentQ) / quiz.questions.length) * 100;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary-light transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-8 md:p-10">
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {quiz.questions.map((_, i) => (
              <div
                key={i}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                  ${i < currentQ
                    ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200'
                    : i === currentQ
                      ? 'bg-primary text-white shadow-md shadow-primary/30 scale-110'
                      : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                  }
                `}
              >
                {i < currentQ ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
            ))}
          </div>
          <span className="text-sm font-medium text-gray-500">{currentQ + 1} / {quiz.questions.length}</span>
        </div>

        {/* Question */}
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-8 font-heading leading-relaxed">
          {question.text}
        </h3>

        {/* Options */}
        <div className="grid gap-3">
          {question.options.map(opt => (
            <button
              key={opt.label}
              onClick={() => handleAnswer(opt.tag)}
              className={`
                w-full text-left p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer
                ${selectedOption === opt.tag
                  ? 'border-primary bg-primary/5 shadow-md scale-[1.02]'
                  : 'border-gray-100 hover:border-primary/30 hover:bg-gray-50 hover:shadow-sm'
                }
              `}
            >
              <div className="flex items-start gap-4">
                <span className={`
                  flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200
                  ${selectedOption === opt.tag
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                  }
                `}>
                  {opt.label}
                </span>
                <span className="text-gray-700 leading-relaxed pt-2">{opt.text}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
