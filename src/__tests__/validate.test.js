import { describe, it, expect } from 'vitest';
import { validateData } from '../data/validate';

describe('validateData', () => {
  it('should pass with valid data', () => {
    const errors = validateData();
    expect(errors).toHaveLength(0);
  });
});
