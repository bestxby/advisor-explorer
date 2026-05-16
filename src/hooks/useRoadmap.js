import { useCallback, useState } from 'react';
import roadmapData from '../data/roadmap.json';

export default function useRoadmap(directionId) {
  const [expandedPhase, setExpandedPhase] = useState(0);
  const roadmap = roadmapData[directionId];

  const togglePhase = useCallback((phaseIndex) => {
    setExpandedPhase((current) => (current === phaseIndex ? -1 : phaseIndex));
  }, []);

  return {
    roadmap,
    expandedPhase,
    togglePhase,
  };
}
