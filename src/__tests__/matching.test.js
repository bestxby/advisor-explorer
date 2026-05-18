import { describe, expect, it } from 'vitest';
import { MatchingEngine } from '../services/MatchingEngine';
import quiz from '../data/quiz.json';
import professors from '../data/professors.json';
import directions from '../data/directions.json';

describe('findTopMatches', () => {
  it('returns ranked matches with explanations', () => {
    const engine = new MatchingEngine({ quiz, professors, directions });
    const matches = engine.findMatches(['code', 'math-ok', 'salary', 'mid-risk', 'coding', 'sys-level']);

    expect(matches).toHaveLength(3);
    expect(matches[0].score).toBe(100);
    expect(matches[0].directionName).toBeTruthy();
    expect(matches[0].professors.length).toBeGreaterThan(0);
    expect(matches[0].strengths.length).toBeGreaterThan(0);
  });

  it('falls back to default recommendation when no profile scores positively', () => {
    const emptyQuiz = {
      ...quiz,
      directionProfiles: Object.fromEntries(
        Object.keys(quiz.directionProfiles).map((dirId) => [dirId, { positive: {}, negative: {} }]),
      ),
    };

    const engine = new MatchingEngine({ quiz: emptyQuiz, professors, directions });
    const matches = engine.findMatches(['code']);

    expect(matches).toHaveLength(1);
    expect(matches[0].direction).toBe(quiz.defaultRecommendation.direction);
    expect(matches[0].strengths[0].label).toBe(quiz.defaultRecommendation.reason);
  });
});
