import professors from './professors.json';
import directions from './directions.json';
import quiz from './quiz.json';

export function validateData() {
  const errors = [];

  // Validate professors' directionId references
  const directionIds = new Set(directions.map((d) => d.id));
  for (const prof of professors) {
    if (!directionIds.has(prof.directionId)) {
      errors.push(
        `professors.json: "${prof.name}" references unknown directionId "${prof.directionId}"`,
      );
    }
  }

  // Validate directions difficulty/recommendation range
  for (const dir of directions) {
    if (dir.difficulty < 1 || dir.difficulty > 5) {
      errors.push(`directions.json: "${dir.name}" difficulty ${dir.difficulty} out of range 1-5`);
    }
    if (dir.recommendation < 1 || dir.recommendation > 5) {
      errors.push(
        `directions.json: "${dir.name}" recommendation ${dir.recommendation} out of range 1-5`,
      );
    }
  }

  // Validate quiz dimensionWeights sum to ~1.0
  const weightSum = Object.values(quiz.dimensionWeights).reduce((a, b) => a + b, 0);
  if (Math.abs(weightSum - 1.0) > 0.01) {
    errors.push(`quiz.json: dimensionWeights sum to ${weightSum.toFixed(3)}, expected 1.0`);
  }

  // Collect all question option tags
  const questionTags = new Set();
  for (const q of quiz.questions) {
    for (const opt of q.options) {
      questionTags.add(opt.tag);
    }
  }

  // Validate that profile tags reference existing question tags
  for (const [dirId, profile] of Object.entries(quiz.directionProfiles)) {
    for (const tag of Object.keys(profile.positive || {})) {
      if (!questionTags.has(tag)) {
        errors.push(
          `quiz.json: directionProfile "${dirId}" positive tag "${tag}" not found in any question option`,
        );
      }
    }
    for (const tag of Object.keys(profile.negative || {})) {
      if (!questionTags.has(tag)) {
        errors.push(
          `quiz.json: directionProfile "${dirId}" negative tag "${tag}" not found in any question option`,
        );
      }
    }
  }

  // Validate defaultRecommendation references
  const profIds = new Set(professors.map((p) => p.id));
  for (const pid of quiz.defaultRecommendation.professors) {
    if (!profIds.has(pid)) {
      errors.push(`quiz.json: defaultRecommendation references unknown professor "${pid}"`);
    }
  }
  if (!directionIds.has(quiz.defaultRecommendation.direction)) {
    errors.push(
      `quiz.json: defaultRecommendation references unknown direction "${quiz.defaultRecommendation.direction}"`,
    );
  }

  if (errors.length > 0) {
    console.warn('[Data Validation] Issues found:');
    errors.forEach((e) => console.warn(`  - ${e}`));
  }

  return errors;
}
