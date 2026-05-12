import { useState } from 'react';

export default function QuizSection({ quiz, onResult }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const handleAnswer = (tag) => {
    const newAnswers = [...answers, tag];
    setAnswers(newAnswers);

    if (currentQ < quiz.questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      const match = findMatch(newAnswers);
      setResult(match);
      onResult(match);
    }
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
    onResult(null);
  };

  if (result) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">你的推荐方向</h3>
        <div className="bg-white rounded-lg p-6 inline-block shadow-md">
          <p className="text-3xl font-bold text-blue-600 mb-2">
            {result.direction}
          </p>
          {result.reason && (
            <p className="text-gray-600 mb-4">{result.reason}</p>
          )}
          <p className="text-sm text-gray-500">
            推荐导师：{result.professors.join('、')}
          </p>
        </div>
        <button
          onClick={reset}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          重新测试
        </button>
      </div>
    );
  }

  const question = quiz.questions[currentQ];
  const progress = ((currentQ) / quiz.questions.length) * 100;

  return (
    <div className="bg-white rounded-xl border p-8">
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>问题 {currentQ + 1} / {quiz.questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full transition-all" style={{width: `${progress}%`}} />
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-6">{question.text}</h3>

      <div className="space-y-3">
        {question.options.map(opt => (
          <button
            key={opt.label}
            onClick={() => handleAnswer(opt.tag)}
            className="w-full text-left p-4 border rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-gray-900"
          >
            <span className="font-medium mr-2">{opt.label}.</span>
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}
