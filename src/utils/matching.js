import { MatchingEngine } from '../services/MatchingEngine';

export function findTopMatches({ tags, quiz, professors, directions }) {
  const engine = new MatchingEngine({ quiz, professors, directions });
  return engine.findMatches(tags);
}
