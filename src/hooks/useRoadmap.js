import { useCallback, useState } from 'react';
import { DataRepository } from '../services/DataRepository';

export default function useRoadmap(directionId) {
  const [expandedPhase, setExpandedPhase] = useState(0);
  const roadmap = DataRepository.getRoadmap(directionId);

  const togglePhase = useCallback((phaseIndex) => {
    setExpandedPhase((current) => (current === phaseIndex ? -1 : phaseIndex));
  }, []);

  return {
    roadmap,
    expandedPhase,
    togglePhase,
  };
}
