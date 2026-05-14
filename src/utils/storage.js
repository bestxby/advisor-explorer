const QUIZ_RESULT_KEY = 'advisor-explorer-quiz-result';

export function saveQuizResult(result) {
  try {
    localStorage.setItem(QUIZ_RESULT_KEY, JSON.stringify(result));
  } catch {
    // Storage full or unavailable
  }
}

export function loadQuizResult() {
  try {
    const raw = localStorage.getItem(QUIZ_RESULT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearQuizResult() {
  try {
    localStorage.removeItem(QUIZ_RESULT_KEY);
  } catch {
    // Ignore
  }
}
