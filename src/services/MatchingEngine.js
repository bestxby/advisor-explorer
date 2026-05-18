export class MatchingEngine {
  constructor({ quiz, professors, directions }) {
    this.quiz = quiz;
    this.professors = professors;
    this.directions = directions;

    // 🌟 Algorithm Optimization 1: Pre-build tag lookup hashmap O(1)
    this.tagMap = {};
    if (quiz?.questions) {
      quiz.questions.forEach((question) => {
        question.options?.forEach((opt) => {
          this.tagMap[opt.tag] = opt.text;
        });
      });
    }

    // 🌟 Algorithm Optimization 2: Pre-index professors by directionId O(1)
    this.professorsByDirection = {};
    if (professors) {
      professors.forEach((prof) => {
        if (!this.professorsByDirection[prof.directionId]) {
          this.professorsByDirection[prof.directionId] = [];
        }
        this.professorsByDirection[prof.directionId].push(prof.id);
      });
    }
  }

  getAnswerText(tag) {
    // Optimized from O(Q * O) search to O(1) hashmap lookup
    return this.tagMap[tag] || tag;
  }

  getSignals(tags, profile) {
    const { dimensionWeights } = this.quiz;
    const weighted = tags.map((tag, qIndex) => {
      const weight = dimensionWeights[String(qIndex)] || 0.2;
      const rawScore = (profile.positive?.[tag] || 0) + (profile.negative?.[tag] || 0);
      return {
        tag,
        label: this.getAnswerText(tag),
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

  findMatches(tags) {
    const { dimensionWeights, directionProfiles, defaultRecommendation } = this.quiz;

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
            this.directions.find((d) => d.id === defaultRecommendation.direction)?.name ||
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
      const dir = this.directions.find((d) => d.id === match.direction);
      // Optimized from O(P) filter scan to O(1) pre-indexed map lookup
      const profs = this.professorsByDirection[match.direction] || [];
      const signals = this.getSignals(tags, directionProfiles[match.direction]);

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
}
