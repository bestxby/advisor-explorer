import { useCallback, useMemo, useState } from 'react';
import { clearQuizResult, loadQuizResult, saveQuizResult } from '../utils/storage';

export default function useExplorerState() {
  const [selectedDirection, setSelectedDirection] = useState('all');
  const [sortBy, setSortBy] = useState('recommendation');
  const [quizResult, setQuizResult] = useState(() => loadQuizResult());
  const [activeTab, setActiveTab] = useState('professors');

  const handleQuizResult = useCallback((result) => {
    setQuizResult(result);
    if (result) {
      saveQuizResult(result);
    } else {
      clearQuizResult();
    }
  }, []);

  const filterValue = useMemo(
    () => ({
      selectedDirection,
      setSelectedDirection,
      sortBy,
      setSortBy,
      activeTab,
      setActiveTab,
      hasQuizResult: !!quizResult,
    }),
    [selectedDirection, sortBy, activeTab, quizResult],
  );

  return {
    selectedDirection,
    sortBy,
    quizResult,
    activeTab,
    handleQuizResult,
    filterValue,
  };
}
