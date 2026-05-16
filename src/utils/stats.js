export function computeStats(professors, directions) {
  const avgDifficulty = (
    directions.reduce((sum, d) => sum + d.difficulty, 0) / directions.length
  ).toFixed(1);
  const highRecommend = directions.filter((d) => d.recommendation >= 4).length;
  const wideJobMarket = directions.filter(
    (d) => d.jobMarket === '极宽' || d.jobMarket === '宽',
  ).length;
  const universities = [...new Set(professors.map((p) => p.university))];

  return { avgDifficulty, highRecommend, wideJobMarket, universities };
}
