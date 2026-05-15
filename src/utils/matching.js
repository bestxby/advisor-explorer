function getAnswerText(quiz, tag) {
  for (const question of quiz.questions) {
    const option = question.options.find((opt) => opt.tag === tag);
    if (option) return option.text;
  }
  return tag;
}

function getSignals({ tags, quiz, profile }) {
  const { dimensionWeights } = quiz;
  const weighted = tags.map((tag, qIndex) => {
    const weight = dimensionWeights[String(qIndex)] || 0.2;
    const rawScore = (profile.positive?.[tag] || 0) + (profile.negative?.[tag] || 0);
    return {
      tag,
      label: getAnswerText(quiz, tag),
      score: rawScore * weight,
    };
  });

  return {
    strengths: weighted
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3),
    cautions: weighted
      .filter((item) => item.score < 0)
      .sort((a, b) => a.score - b.score)
      .slice(0, 2),
  };
}

export function findTopMatches({ tags, quiz, professors, directions }) {
  const { dimensionWeights, directionProfiles, defaultRecommendation } = quiz;

  const scored = Object.entries(directionProfiles).map(([dirId, profile]) => {
    let rawScore = 0;

    tags.forEach((tag, qIndex) => {
      const weight = dimensionWeights[String(qIndex)] || 0.2;
      const tagScore = (profile.positive?.[tag] || 0) + (profile.negative?.[tag] || 0);
      rawScore += tagScore * weight;
    });

    return { direction: dirId, rawScore };
  });

  scored.sort((a, b) => b.rawScore - a.rawScore);

  const maxScore = scored[0]?.rawScore || 0;

  if (maxScore <= 0) {
    return [
      {
        direction: defaultRecommendation.direction,
        directionName:
          directions.find((d) => d.id === defaultRecommendation.direction)?.name ||
          defaultRecommendation.direction,
        score: 60,
        professors: defaultRecommendation.professors,
        reason: defaultRecommendation.reason,
        strengths: [{ tag: 'default', label: defaultRecommendation.reason, score: 0 }],
        cautions: [],
      },
    ];
  }

  const top3 = scored.slice(0, 3).map((item) => ({
    direction: item.direction,
    score: Math.max(0, Math.round((item.rawScore / maxScore) * 100)),
    rawScore: item.rawScore,
  }));

  return top3.map((match, i) => {
    const dir = directions.find((d) => d.id === match.direction);
    const profs = professors.filter((p) => p.directionId === match.direction).map((p) => p.id);
    const signals = getSignals({
      tags,
      quiz,
      profile: directionProfiles[match.direction],
    });

    return {
      ...match,
      rank: i + 1,
      directionName: dir?.name || match.direction,
      professors: profs,
      strengths: signals.strengths,
      cautions: signals.cautions,
    };
  });
}
