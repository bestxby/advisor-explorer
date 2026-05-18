import { describe, expect, it } from 'vitest';
import directions from '../data/directions.json';
import professors from '../data/professors.json';
import quiz from '../data/quiz.json';
import { MarkdownReportBuilder } from '../services/ExportService';
import { MatchingEngine } from '../services/MatchingEngine';

function buildResults() {
  const engine = new MatchingEngine({
    quiz,
    professors,
    directions,
  });
  return engine.findMatches(['code', 'math-ok', 'salary', 'mid-risk', 'coding', 'sys-level']);
}

describe('generateMarkdown', () => {
  it('renders the exported report sections without leaking missing values', () => {
    const markdown = new MarkdownReportBuilder({ results: buildResults(), directions, professors }).build();

    expect(markdown).toContain('# 体系结构方向匹配报告');
    expect(markdown).toContain('## 匹配排名');
    expect(markdown).toContain('## 最匹配导师');
    expect(markdown).toContain('## 行动路线图');
    expect(markdown).toContain('### 1. 课程准备');
    expect(markdown).toContain('*本报告由 Advisor Explorer 生成*');
    expect(markdown).not.toContain('undefined');
    expect(markdown).not.toContain('null');
  });

  it('includes direction detail and professor resources for the top match', () => {
    const results = buildResults();
    const top = results[0];
    const topDirection = directions.find((direction) => direction.id === top.direction);
    const topProfessor = professors.find((professor) => top.professors.includes(professor.id));
    const markdown = new MarkdownReportBuilder({ results, directions, professors }).build();

    expect(markdown).toContain(`## ${topDirection.name} · 方向详解`);
    expect(markdown).toContain(`### ${topProfessor.name} · ${topProfessor.university} ${topProfessor.department}`);
    expect(markdown).toContain(`- [${topProfessor.resources[0].name}](${topProfessor.resources[0].url})`);
  });
});
