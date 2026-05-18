export class MarkdownReportBuilder {
  constructor({ results, directions, professors }) {
    this.results = results;
    this.directions = directions;
    this.professors = professors;
    this.lines = [];
  }

  blank() {
    this.lines.push('');
  }

  appendReportHeader(top) {
    this.lines.push('# 体系结构方向匹配报告');
    this.blank();
    this.lines.push(`> 最佳匹配方向：**${top.directionName}**，匹配度 **${top.score}%**`);
    this.blank();
  }

  appendRanking() {
    this.lines.push('## 匹配排名');
    this.blank();

    this.results.forEach((result, index) => {
      this.lines.push(`${index + 1}. **${result.directionName}** — 匹配度 ${result.score}%`);
      if (result.strengths?.length) {
        this.lines.push(`   - 匹配依据：${result.strengths.map((signal) => signal.label).join('；')}`);
      }
      if (result.cautions?.length) {
        this.lines.push(`   - 需要注意：${result.cautions.map((signal) => signal.label).join('；')}`);
      }
    });

    this.blank();
  }

  appendDirectionDetail(direction) {
    if (!direction) return;

    this.lines.push(`## ${direction.name} · 方向详解`);
    this.blank();
    this.lines.push('| 维度 | 信息 |');
    this.lines.push('|------|------|');
    this.lines.push(`| 难度 | ${'★'.repeat(direction.difficulty)}${'☆'.repeat(5 - direction.difficulty)} |`);
    this.lines.push(`| 流片依赖 | ${direction.tapeoutDependency} |`);
    this.lines.push(`| 就业面 | ${direction.jobMarket} |`);
    this.lines.push(`| 薪资天花板 | ${direction.salaryCeiling} |`);
    this.lines.push(`| 成熟度 | ${direction.maturity} |`);
    this.lines.push(`| 竞争热度 | ${direction.competitionHeat} |`);
    this.blank();
    this.lines.push(`**核心痛点**：${direction.corePainPoint}`);
    this.blank();
    this.lines.push(`**日常工作**：${direction.dailyWork}`);
    this.blank();
    this.lines.push(`**推荐课程**：${direction.courses?.join('、')}`);
    this.blank();
    this.lines.push(`**前景展望**：${direction.outlook}`);
    this.blank();
    this.lines.push(`**35岁风险**：${direction.risk35}`);
    this.blank();

    this.appendJobs(direction.jobs);

    if (direction.otherTeams) {
      this.lines.push(`**其他团队参考**：${direction.otherTeams}`);
      this.blank();
    }
  }

  appendJobs(jobs) {
    if (!jobs?.length) return;

    this.lines.push('### 就业岗位');
    this.blank();
    this.lines.push('| 公司 | 岗位 | 薪资 | 需求量 |');
    this.lines.push('|------|------|------|--------|');
    jobs.forEach((job) => {
      this.lines.push(`| ${job.company} | ${job.role} | ${job.salary} | ${job.count} |`);
    });
    this.blank();
  }

  appendProfessors(professorsList) {
    if (!professorsList.length) return;

    this.lines.push('## 最匹配导师');
    this.blank();

    professorsList.forEach((professor) => {
      this.appendProfessor(professor);
    });
  }

  appendProfessor(professor) {
    this.lines.push(`### ${professor.name} · ${professor.university} ${professor.department}`);
    this.blank();
    this.lines.push(`> ${professor.tagline}`);
    this.blank();
    this.lines.push(`**官方方向**：${professor.officialDirection}`);
    this.blank();

    if (professor.realDirections?.length) {
      this.lines.push('**实际研究方向**：');
      professor.realDirections.forEach((direction) => {
        this.lines.push(`- ${direction}`);
      });
      this.blank();
    }

    this.appendOptionalLine('方向详解', professor.directionDetail);
    this.appendOptionalLine('犀利评价', professor.evaluation);
    this.appendOptionalLine('适合人群', professor.suitableFor);
    this.appendProfessorPapers(professor.papers);
    this.appendOptionalListLine('技术栈', professor.techStack);
    this.appendOptionalListLine('目标会议', professor.conferences);

    this.lines.push(`**指导风格**：${professor.style}`);
    this.blank();
    this.lines.push('---');
    this.blank();
  }

  appendOptionalLine(label, value) {
    if (!value) return;
    this.lines.push(`**${label}**：${value}`);
    this.blank();
  }

  appendOptionalListLine(label, values) {
    if (!values?.length) return;
    this.lines.push(`**${label}**：${values.join('、')}`);
    this.blank();
  }

  appendProfessorPapers(papers) {
    if (!papers?.length) return;

    this.lines.push('**代表论文**：');
    papers.forEach((paper) => {
      this.lines.push(`- **${paper.title}**（${paper.venue}）— ${paper.summary}`);
    });
    this.blank();
  }

  appendActionRoadmap(direction, professorsList) {
    this.lines.push('## 行动路线图');
    this.blank();

    let nextIndex = 1;
    if (direction?.courses?.length) {
      this.lines.push(`### ${nextIndex}. 课程准备`);
      this.blank();
      direction.courses.forEach((course) => {
        this.lines.push(`- [ ] ${course}`);
      });
      this.blank();
      nextIndex += 1;
    }

    professorsList.forEach((professor) => {
      if (professor.starterProject) {
        this.lines.push(`### ${nextIndex}. 入门项目（${professor.name}）`);
        this.blank();
        this.lines.push(professor.starterProject);
        this.blank();
        nextIndex += 1;
      }

      this.appendProfessorResources(professor.resources);
    });
  }

  appendProfessorResources(resources) {
    if (!resources?.length) return;

    this.lines.push('**推荐资源**：');
    resources.forEach((resource) => {
      this.lines.push(`- [${resource.name}](${resource.url}) — ${resource.description}`);
    });
    this.blank();
  }

  build() {
    const top = this.results[0];
    if (!top) return '';

    const direction = this.directions.find((item) => item.id === top.direction);
    const topProfessors = this.professors.filter((professor) => top.professors?.includes(professor.id));

    this.appendReportHeader(top);
    this.appendRanking();
    this.appendDirectionDetail(direction);
    this.appendProfessors(topProfessors);
    this.appendActionRoadmap(direction, topProfessors);
    this.lines.push('---');
    this.lines.push('*本报告由 Advisor Explorer 生成*');

    return this.lines.join('\n');
  }
}
