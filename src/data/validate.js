

const REQUIRED_PROFESSOR_FIELDS = [
  'id',
  'name',
  'university',
  'department',
  'directionId',
  'tagline',
  'officialDirection',
  'realDirections',
  'papers',
  'evaluation',
  'suitableFor',
  'techStack',
  'conferences',
  'resources',
  'starterProject',
  'style',
  'contact',
];

const REQUIRED_DIRECTION_FIELDS = [
  'id',
  'name',
  'code',
  'difficulty',
  'tapeoutDependency',
  'jobMarket',
  'salaryCeiling',
  'maturity',
  'jobCount',
  'competitionHeat',
  'otherTeams',
  'recommendation',
  'dailyWork',
  'corePainPoint',
  'courses',
  'moat',
  'outlook',
  'risk35',
  'jobs',
];

function isBlank(value) {
  return value == null || (typeof value === 'string' && value.trim() === '');
}

function isValidUrl(value) {
  if (isBlank(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function validateRequiredFields(item, fields, label, errors) {
  for (const field of fields) {
    if (!(field in item) || isBlank(item[field])) {
      errors.push(`${label}: missing required field "${field}"`);
    }
  }
}

function validateNonEmptyArray(value, label, errors) {
  if (!Array.isArray(value) || value.length === 0) {
    errors.push(`${label}: expected a non-empty array`);
  }
}

export function validateData({ professors, directions, quiz, roadmap } = {}) {
  const localProfessors = professors || [];
  const localDirections = directions || [];
  const localQuiz = quiz || { directionProfiles: {}, dimensionWeights: {}, questions: [], defaultRecommendation: { professors: [], direction: '' } };
  const localRoadmap = roadmap || {};

  const errors = [];

  // Validate professors' directionId references
  const directionIds = new Set(localDirections.map((d) => d.id));
  const professorIds = new Set();
  for (const prof of localProfessors) {
    validateRequiredFields(prof, REQUIRED_PROFESSOR_FIELDS, `professors.json: "${prof.name || prof.id}"`, errors);

    if (professorIds.has(prof.id)) {
      errors.push(`professors.json: duplicate professor id "${prof.id}"`);
    }
    professorIds.add(prof.id);

    if (!directionIds.has(prof.directionId)) {
      errors.push(
        `professors.json: "${prof.name}" references unknown directionId "${prof.directionId}"`,
      );
    }

    validateNonEmptyArray(prof.realDirections, `professors.json: "${prof.name}" realDirections`, errors);
    validateNonEmptyArray(prof.papers, `professors.json: "${prof.name}" papers`, errors);
    validateNonEmptyArray(prof.techStack, `professors.json: "${prof.name}" techStack`, errors);
    validateNonEmptyArray(prof.conferences, `professors.json: "${prof.name}" conferences`, errors);
    validateNonEmptyArray(prof.resources, `professors.json: "${prof.name}" resources`, errors);

    for (const [index, paper] of (prof.papers || []).entries()) {
      if (isBlank(paper.title) || isBlank(paper.venue) || isBlank(paper.summary)) {
        errors.push(`professors.json: "${prof.name}" paper ${index + 1} is missing title, venue, or summary`);
      }
      if (!isValidUrl(paper.url)) {
        errors.push(`professors.json: "${prof.name}" paper "${paper.title}" has invalid url`);
      }
    }

    for (const resource of prof.resources || []) {
      if (isBlank(resource.name) || isBlank(resource.description)) {
        errors.push(`professors.json: "${prof.name}" resource is missing name or description`);
      }
      if (!isValidUrl(resource.url)) {
        errors.push(`professors.json: "${prof.name}" resource "${resource.name}" has invalid url`);
      }
    }
  }

  // Validate directions difficulty/recommendation range
  const directionCodes = new Set();
  for (const dir of localDirections) {
    validateRequiredFields(dir, REQUIRED_DIRECTION_FIELDS, `directions.json: "${dir.name || dir.id}"`, errors);

    if (directionCodes.has(dir.code)) {
      errors.push(`directions.json: duplicate direction code "${dir.code}"`);
    }
    directionCodes.add(dir.code);

    if (dir.difficulty < 1 || dir.difficulty > 5) {
      errors.push(`directions.json: "${dir.name}" difficulty ${dir.difficulty} out of range 1-5`);
    }
    if (dir.recommendation < 1 || dir.recommendation > 5) {
      errors.push(
        `directions.json: "${dir.name}" recommendation ${dir.recommendation} out of range 1-5`,
      );
    }

    validateNonEmptyArray(dir.courses, `directions.json: "${dir.name}" courses`, errors);
    validateNonEmptyArray(dir.jobs, `directions.json: "${dir.name}" jobs`, errors);

    for (const [index, job] of (dir.jobs || []).entries()) {
      if (isBlank(job.company) || isBlank(job.role) || isBlank(job.salary) || isBlank(job.count)) {
        errors.push(`directions.json: "${dir.name}" job ${index + 1} is missing company, role, salary, or count`);
      }
    }
  }

  // Validate each direction has a quiz profile and roadmap
  const profileIds = new Set(Object.keys(localQuiz.directionProfiles));
  const roadmapIds = new Set(Object.keys(localRoadmap));
  for (const dirId of directionIds) {
    if (!profileIds.has(dirId)) {
      errors.push(`quiz.json: missing directionProfile for direction "${dirId}"`);
    }
    if (!roadmapIds.has(dirId)) {
      errors.push(`roadmap.json: missing roadmap for direction "${dirId}"`);
    }
  }

  for (const profileId of profileIds) {
    if (!directionIds.has(profileId)) {
      errors.push(`quiz.json: directionProfile "${profileId}" does not match any direction`);
    }
  }

  for (const roadmapId of roadmapIds) {
    if (!directionIds.has(roadmapId)) {
      errors.push(`roadmap.json: roadmap "${roadmapId}" does not match any direction`);
    }

    const item = localRoadmap[roadmapId];
    validateNonEmptyArray(item?.phases, `roadmap.json: "${roadmapId}" phases`, errors);
    for (const [phaseIndex, phase] of (item?.phases || []).entries()) {
      if (isBlank(phase.period) || isBlank(phase.subtitle) || isBlank(phase.milestone)) {
        errors.push(`roadmap.json: "${roadmapId}" phase ${phaseIndex + 1} is missing period, subtitle, or milestone`);
      }
      validateNonEmptyArray(phase.tasks, `roadmap.json: "${roadmapId}" phase ${phaseIndex + 1} tasks`, errors);
      for (const [taskIndex, task] of (phase.tasks || []).entries()) {
        if (isBlank(task.text) || !['high', 'medium', 'low'].includes(task.priority)) {
          errors.push(`roadmap.json: "${roadmapId}" phase ${phaseIndex + 1} task ${taskIndex + 1} is invalid`);
        }
      }
    }
  }

  // Validate quiz dimensionWeights sum to ~1.0
  const weightSum = Object.values(localQuiz.dimensionWeights).reduce((a, b) => a + b, 0);
  if (Math.abs(weightSum - 1.0) > 0.01) {
    errors.push(`quiz.json: dimensionWeights sum to ${weightSum.toFixed(3)}, expected 1.0`);
  }

  for (const [index, question] of localQuiz.questions.entries()) {
    if (Number(question.dimension) !== index) {
      errors.push(`quiz.json: question "${question.text}" dimension ${question.dimension} does not match index ${index}`);
    }
    if (!(String(index) in localQuiz.dimensionWeights)) {
      errors.push(`quiz.json: missing dimensionWeight for question index ${index}`);
    }
    validateNonEmptyArray(question.options, `quiz.json: question "${question.text}" options`, errors);
  }

  // Collect all question option tags
  const questionTags = new Set();
  for (const q of localQuiz.questions) {
    for (const opt of q.options) {
      questionTags.add(opt.tag);
    }
  }

  // Validate that profile tags reference existing question tags
  for (const [dirId, profile] of Object.entries(localQuiz.directionProfiles)) {
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
  for (const pid of localQuiz.defaultRecommendation.professors) {
    if (!professorIds.has(pid)) {
      errors.push(`quiz.json: defaultRecommendation references unknown professor "${pid}"`);
    }
  }
  if (!directionIds.has(localQuiz.defaultRecommendation.direction)) {
    errors.push(
      `quiz.json: defaultRecommendation references unknown direction "${localQuiz.defaultRecommendation.direction}"`,
    );
  }

  if (errors.length > 0) {
    console.warn('[Data Validation] Issues found:');
    errors.forEach((e) => console.warn(`  - ${e}`));
  }

  return errors;
}
