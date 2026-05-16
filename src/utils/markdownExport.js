function blank(lines) {
  lines.push('');
}

function appendReportHeader(lines, top) {
  lines.push('# 体系结构方向匹配报告');
  blank(lines);
  lines.push(`> 最佳匹配方向：**${top.directionName}**，匹配度 **${top.score}%**`);
  blank(lines);
}

function appendRanking(lines, results) {
  lines.push('## 匹配排名');
  blank(lines);

  results.forEach((result, index) => {
    lines.push(`${index + 1}. **${result.directionName}** — 匹配度 ${result.score}%`);
    if (result.strengths?.length) {
      lines.push(`   - 匹配依据：${result.strengths.map((signal) => signal.label).join('；')}`);
    }
    if (result.cautions?.length) {
      lines.push(`   - 需要注意：${result.cautions.map((signal) => signal.label).join('；')}`);
    }
  });

  blank(lines);
}

function appendDirectionDetail(lines, direction) {
  if (!direction) return;

  lines.push(`## ${direction.name} · 方向详解`);
  blank(lines);
  lines.push('| 维度 | 信息 |');
  lines.push('|------|------|');
  lines.push(`| 难度 | ${'★'.repeat(direction.difficulty)}${'☆'.repeat(5 - direction.difficulty)} |`);
  lines.push(`| 流片依赖 | ${direction.tapeoutDependency} |`);
  lines.push(`| 就业面 | ${direction.jobMarket} |`);
  lines.push(`| 薪资天花板 | ${direction.salaryCeiling} |`);
  lines.push(`| 成熟度 | ${direction.maturity} |`);
  lines.push(`| 竞争热度 | ${direction.competitionHeat} |`);
  blank(lines);
  lines.push(`**核心痛点**：${direction.corePainPoint}`);
  blank(lines);
  lines.push(`**日常工作**：${direction.dailyWork}`);
  blank(lines);
  lines.push(`**推荐课程**：${direction.courses?.join('、')}`);
  blank(lines);
  lines.push(`**前景展望**：${direction.outlook}`);
  blank(lines);
  lines.push(`**35岁风险**：${direction.risk35}`);
  blank(lines);

  appendJobs(lines, direction.jobs);

  if (direction.otherTeams) {
    lines.push(`**其他团队参考**：${direction.otherTeams}`);
    blank(lines);
  }
}

function appendJobs(lines, jobs) {
  if (!jobs?.length) return;

  lines.push('### 就业岗位');
  blank(lines);
  lines.push('| 公司 | 岗位 | 薪资 | 需求量 |');
  lines.push('|------|------|------|--------|');
  jobs.forEach((job) => {
    lines.push(`| ${job.company} | ${job.role} | ${job.salary} | ${job.count} |`);
  });
  blank(lines);
}

function appendProfessors(lines, professors) {
  if (!professors.length) return;

  lines.push('## 最匹配导师');
  blank(lines);

  professors.forEach((professor) => {
    appendProfessor(lines, professor);
  });
}

function appendProfessor(lines, professor) {
  lines.push(`### ${professor.name} · ${professor.university} ${professor.department}`);
  blank(lines);
  lines.push(`> ${professor.tagline}`);
  blank(lines);
  lines.push(`**官方方向**：${professor.officialDirection}`);
  blank(lines);

  if (professor.realDirections?.length) {
    lines.push('**实际研究方向**：');
    professor.realDirections.forEach((direction) => {
      lines.push(`- ${direction}`);
    });
    blank(lines);
  }

  appendOptionalLine(lines, '方向详解', professor.directionDetail);
  appendOptionalLine(lines, '犀利评价', professor.evaluation);
  appendOptionalLine(lines, '适合人群', professor.suitableFor);
  appendProfessorPapers(lines, professor.papers);
  appendOptionalListLine(lines, '技术栈', professor.techStack);
  appendOptionalListLine(lines, '目标会议', professor.conferences);

  lines.push(`**指导风格**：${professor.style}`);
  blank(lines);
  lines.push('---');
  blank(lines);
}

function appendOptionalLine(lines, label, value) {
  if (!value) return;
  lines.push(`**${label}**：${value}`);
  blank(lines);
}

function appendOptionalListLine(lines, label, values) {
  if (!values?.length) return;
  lines.push(`**${label}**：${values.join('、')}`);
  blank(lines);
}

function appendProfessorPapers(lines, papers) {
  if (!papers?.length) return;

  lines.push('**代表论文**：');
  papers.forEach((paper) => {
    lines.push(`- **${paper.title}**（${paper.venue}）— ${paper.summary}`);
  });
  blank(lines);
}

function appendActionRoadmap(lines, direction, professors) {
  lines.push('## 行动路线图');
  blank(lines);

  let nextIndex = 1;
  if (direction?.courses?.length) {
    lines.push(`### ${nextIndex}. 课程准备`);
    blank(lines);
    direction.courses.forEach((course) => {
      lines.push(`- [ ] ${course}`);
    });
    blank(lines);
    nextIndex += 1;
  }

  professors.forEach((professor) => {
    if (professor.starterProject) {
      lines.push(`### ${nextIndex}. 入门项目（${professor.name}）`);
      blank(lines);
      lines.push(professor.starterProject);
      blank(lines);
      nextIndex += 1;
    }

    appendProfessorResources(lines, professor.resources);
  });
}

function appendProfessorResources(lines, resources) {
  if (!resources?.length) return;

  lines.push('**推荐资源**：');
  resources.forEach((resource) => {
    lines.push(`- [${resource.name}](${resource.url}) — ${resource.description}`);
  });
  blank(lines);
}

export function generateMarkdown(results, directions, professors) {
  const top = results[0];
  const direction = directions.find((item) => item.id === top.direction);
  const topProfessors = professors.filter((professor) => top.professors?.includes(professor.id));
  const lines = [];

  appendReportHeader(lines, top);
  appendRanking(lines, results);
  appendDirectionDetail(lines, direction);
  appendProfessors(lines, topProfessors);
  appendActionRoadmap(lines, direction, topProfessors);
  lines.push('---');
  lines.push('*本报告由 Advisor Explorer 生成*');

  return lines.join('\n');
}
