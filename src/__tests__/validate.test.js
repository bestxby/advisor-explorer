import { describe, it, expect } from 'vitest';
import { validateData } from '../data/validate';
import quiz from '../data/quiz.json';
import professors from '../data/professors.json';
import directions from '../data/directions.json';
import roadmap from '../data/roadmap.json';

describe('validateData', () => {
  it('should pass with valid data', () => {
    const errors = validateData({ quiz, professors, directions, roadmap });
    expect(errors).toHaveLength(0);
  });
});
