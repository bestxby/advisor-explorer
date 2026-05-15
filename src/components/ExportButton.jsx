import { useCallback, useState } from 'react';

function generateMarkdown(results, directions, professors) {
  const top = results[0];
  const dir = directions.find((d) => d.id === top.direction);
  const topProfs = professors.filter((p) => top.professors?.includes(p.id));

  const lines = [];

  lines.push(`# 体系结构方向匹配报告`);
  lines.push('');
  lines.push(`> 最佳匹配方向：**${top.directionName}**，匹配度 **${top.score}%**`);
  lines.push('');

  // All ranked results
  lines.push('## 匹配排名');
  lines.push('');
  results.forEach((r, i) => {
    lines.push(`${i + 1}. **${r.directionName}** — 匹配度 ${r.score}%`);
  });
  lines.push('');

  // Direction detail
  if (dir) {
    lines.push(`## ${dir.name} · 方向详解`);
    lines.push('');
    lines.push(`| 维度 | 信息 |`);
    lines.push(`|------|------|`);
    lines.push(`| 难度 | ${'★'.repeat(dir.difficulty)}${'☆'.repeat(5 - dir.difficulty)} |`);
    lines.push(`| 流片依赖 | ${dir.tapeoutDependency} |`);
    lines.push(`| 就业面 | ${dir.jobMarket} |`);
    lines.push(`| 薪资天花板 | ${dir.salaryCeiling} |`);
    lines.push(`| 成熟度 | ${dir.maturity} |`);
    lines.push(`| 竞争热度 | ${dir.competitionHeat} |`);
    lines.push('');
    lines.push(`**核心痛点**：${dir.corePainPoint}`);
    lines.push('');
    lines.push(`**日常工作**：${dir.dailyWork}`);
    lines.push('');
    lines.push(`**推荐课程**：${dir.courses?.join('、')}`);
    lines.push('');
    lines.push(`**前景展望**：${dir.outlook}`);
    lines.push('');
    lines.push(`**35岁风险**：${dir.risk35}`);
    lines.push('');

    if (dir.jobs?.length) {
      lines.push('### 就业岗位');
      lines.push('');
      lines.push('| 公司 | 岗位 | 薪资 | 需求量 |');
      lines.push('|------|------|------|--------|');
      dir.jobs.forEach((j) => {
        lines.push(`| ${j.company} | ${j.role} | ${j.salary} | ${j.count} |`);
      });
      lines.push('');
    }

    if (dir.otherTeams) {
      lines.push(`**其他团队参考**：${dir.otherTeams}`);
      lines.push('');
    }
  }

  // Best matching professors
  if (topProfs.length) {
    lines.push(`## 最匹配导师`);
    lines.push('');

    topProfs.forEach((prof) => {
      lines.push(`### ${prof.name} · ${prof.university} ${prof.department}`);
      lines.push('');
      lines.push(`> ${prof.tagline}`);
      lines.push('');
      lines.push(`**官方方向**：${prof.officialDirection}`);
      lines.push('');

      if (prof.realDirections?.length) {
        lines.push('**实际研究方向**：');
        prof.realDirections.forEach((rd) => {
          lines.push(`- ${rd}`);
        });
        lines.push('');
      }

      if (prof.directionDetail) {
        lines.push(`**方向详解**：${prof.directionDetail}`);
        lines.push('');
      }

      if (prof.evaluation) {
        lines.push(`**犀利评价**：${prof.evaluation}`);
        lines.push('');
      }

      if (prof.suitableFor) {
        lines.push(`**适合人群**：${prof.suitableFor}`);
        lines.push('');
      }

      if (prof.papers?.length) {
        lines.push('**代表论文**：');
        prof.papers.forEach((p) => {
          lines.push(`- **${p.title}**（${p.venue}）— ${p.summary}`);
        });
        lines.push('');
      }

      if (prof.techStack?.length) {
        lines.push(`**技术栈**：${prof.techStack.join('、')}`);
        lines.push('');
      }

      if (prof.conferences?.length) {
        lines.push(`**目标会议**：${prof.conferences.join('、')}`);
        lines.push('');
      }

      lines.push(`**指导风格**：${prof.style}`);
      lines.push('');
      lines.push('---');
      lines.push('');
    });
  }

  // Action roadmap
  lines.push('## 行动路线图');
  lines.push('');

  if (dir) {
    if (dir.courses?.length) {
      lines.push('### 1. 课程准备');
      lines.push('');
      dir.courses.forEach((c) => {
        lines.push(`- [ ] ${c}`);
      });
      lines.push('');
    }
  }

  if (topProfs.length) {
    topProfs.forEach((prof, i) => {
      if (prof.starterProject) {
        lines.push(`### ${dir?.courses?.length ? 2 + i : 1 + i}. 入门项目（${prof.name}）`);
        lines.push('');
        lines.push(prof.starterProject);
        lines.push('');
      }

      if (prof.resources?.length) {
        lines.push('**推荐资源**：');
        prof.resources.forEach((r) => {
          lines.push(`- [${r.name}](${r.url}) — ${r.description}`);
        });
        lines.push('');
      }
    });
  }

  lines.push('---');
  lines.push('*本报告由 Advisor Explorer 生成*');

  return lines.join('\n');
}

export default function ExportButton({ results, directions, professors, filename = 'advisor-explorer-result' }) {
  const [exporting, setExporting] = useState(false);

  const handleExport = useCallback(() => {
    if (!results?.length || exporting) return;

    setExporting(true);

    try {
      const md = generateMarkdown(results, directions, professors);
      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.md`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setTimeout(() => setExporting(false), 1000);
    }
  }, [results, directions, professors, filename, exporting]);

  return (
    <button
      onClick={handleExport}
      disabled={exporting || !results?.length}
      className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#151d2b] text-gray-700 dark:text-slate-300 rounded-xl font-semibold border border-gray-200 dark:border-[#2a3550] hover:bg-gray-50 dark:hover:bg-[#2a3550] hover:shadow-sm transition-all duration-200 cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      </svg>
      {exporting ? '导出中...' : '导出 Markdown'}
    </button>
  );
}
