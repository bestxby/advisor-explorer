import { HEAT_ORDER } from '../constants';

export function getSalaryNum(salaryCeiling) {
  const match = String(salaryCeiling || '').match(/(\d+)/);
  return match ? Number.parseInt(match[1], 10) : 0;
}

export const sortFunctions = {
  recommendation: (a, b) => b.recommendation - a.recommendation,
  difficulty: (a, b) => b.difficulty - a.difficulty,
  salary: (a, b) => getSalaryNum(b.salaryCeiling) - getSalaryNum(a.salaryCeiling),
  competition: (a, b) =>
    (HEAT_ORDER[b.competitionHeat] || 0) - (HEAT_ORDER[a.competitionHeat] || 0),
};
