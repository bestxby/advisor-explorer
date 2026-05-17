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

export class HTMLReportGenerator {
  static generate(markdownContent) {
    let html = markdownContent
      .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 mt-8 mb-6 font-heading">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-slate-100 border-b border-white/10 pb-2 mt-8 mb-4 font-heading">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-slate-200 mt-6 mb-3">$1</h3>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-indigo-500 bg-indigo-500/10 text-slate-300 p-4 rounded-r-xl my-4 italic">$1</blockquote>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-slate-300">$1</em>')
      .replace(/- \[\s?\] (.*$)/gim, '<div class="flex items-center gap-2 my-2"><input type="checkbox" disabled class="rounded border-white/20 bg-white/5 text-indigo-600 focus:ring-indigo-500" /> <span class="text-slate-300">$1</span></div>')
      .replace(/- \[(x|X)\] (.*$)/gim, '<div class="flex items-center gap-2 my-2"><input type="checkbox" checked disabled class="rounded border-white/20 bg-white/5 text-indigo-600 focus:ring-indigo-500" /> <span class="text-slate-300 line-through">$2</span></div>')
      .replace(/^- (.*$)/gim, '<li class="text-slate-300 ml-4 list-disc my-1">$1</li>');

    // Parse tables
    const lines = html.split('\n');
    let inTable = false;
    let tableLines = [];
    const processedLines = lines.map(line => {
      if (line.trim().startsWith('|')) {
        if (!inTable) {
          inTable = true;
          tableLines = [];
        }
        tableLines.push(line);
        return '<!-- TABLE_ROW -->';
      } else {
        if (inTable) {
          inTable = false;
          const tableHTML = this.parseHTMLTable(tableLines);
          return tableHTML + '\n' + line;
        }
        return line;
      }
    });
    html = processedLines.join('\n');

    return `<!DOCTYPE html>
<html lang="zh-CN" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>体系结构方向匹配报告 - Advisor Explorer</title>
  <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap');
    body {
      font-family: 'Inter', sans-serif;
      background-color: #0b0f19;
    }
    .font-heading {
      font-family: 'Outfit', sans-serif;
    }
    .card-glow {
      box-shadow: 0 0 50px rgba(99, 102, 241, 0.06);
    }
    @media print {
      body {
        background-color: #ffffff;
        color: #1e293b;
      }
      .card-glow {
        box-shadow: none;
        border: none;
      }
      h1, h2, h3 {
        color: #0f172a !important;
        background: none !important;
        -webkit-text-fill-color: initial !important;
      }
      blockquote {
        background-color: #f8fafc !important;
        border-color: #cbd5e1 !important;
        color: #475569 !important;
      }
      th {
        background-color: #f1f5f9 !important;
        color: #0f172a !important;
      }
      td {
        border-color: #e2e8f0 !important;
        color: #334155 !important;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body class="text-slate-300 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-4xl mx-auto bg-[#0f1629]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 card-glow relative">
    <div class="flex items-center justify-between border-b border-white/10 pb-6 mb-8 no-print">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
          <svg class="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
          </svg>
        </div>
        <span class="text-sm font-semibold tracking-wider text-indigo-400 uppercase">Advisor Explorer Match Report</span>
      </div>
      <button onclick="window.print()" class="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-600/20">
        打印 / 另存为 PDF
      </button>
    </div>
    
    <div class="space-y-6">
      ${html}
    </div>
    
    <div class="mt-12 pt-6 border-t border-white/10 text-center text-xs text-slate-500">
      本报告由 Advisor Explorer 智能匹配系统于 ${new Date().toLocaleDateString('zh-CN')} 生成，供学术规划参考使用。
    </div>
  </div>
</body>
</html>`;
  }

  static parseHTMLTable(lines) {
    const rows = lines.map(line => 
      line.split('|')
        .map(cell => cell.trim())
        .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
    );
    const header = rows[0];
    const body = rows.slice(2); // Skip separator line

    const ths = header.map(cell => `<th class="px-4 py-3 font-semibold text-slate-200 text-left">${cell}</th>`).join('');
    const trs = body.map(row => {
      const tds = row.map(cell => `<td class="px-4 py-3 text-slate-300 border-t border-white/5">${cell}</td>`).join('');
      return `<tr>${tds}</tr>`;
    }).join('');

    return `
<div class="overflow-x-auto my-6 rounded-xl border border-white/10 bg-white/5">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 text-xs uppercase text-slate-300">
      <tr>${ths}</tr>
    </thead>
    <tbody>
      ${trs}
    </tbody>
  </table>
</div>`;
  }
}

export class PDFReportService {
  static print(markdownContent) {
    const html = HTMLReportGenerator.generate(markdownContent);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 600);
    };
  }
}

export class ShareCardGenerator {
  static generate(results, directions, professors, filename = 'advisor-explorer-share') {
    const top = results[0];
    if (!top) return;

    const canvas = document.createElement('canvas');
    const baseW = 800;
    const baseH = 1000;
    const scale = 3; // 3x Ultra-HD Retina-ready resolution scaling (2400x3000px)

    canvas.width = baseW * scale;
    canvas.height = baseH * scale;

    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);

    // 1. Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, baseW, baseH);
    bgGrad.addColorStop(0, '#0b0f19');
    bgGrad.addColorStop(0.5, '#121829');
    bgGrad.addColorStop(1, '#1b1429');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, baseW, baseH);

    // 2. Grids
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 800; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 1000);
      ctx.stroke();
    }
    for (let j = 0; j < 1000; j += 40) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(800, j);
      ctx.stroke();
    }

    // 3. Ambient Glow spheres
    const glowGrad1 = ctx.createRadialGradient(200, 300, 50, 200, 300, 350);
    glowGrad1.addColorStop(0, 'rgba(59, 130, 246, 0.15)');
    glowGrad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glowGrad1;
    ctx.beginPath();
    ctx.arc(200, 300, 350, 0, Math.PI * 2);
    ctx.fill();

    const glowGrad2 = ctx.createRadialGradient(600, 700, 50, 600, 700, 300);
    glowGrad2.addColorStop(0, 'rgba(139, 92, 246, 0.12)');
    glowGrad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glowGrad2;
    ctx.beginPath();
    ctx.arc(600, 700, 300, 0, Math.PI * 2);
    ctx.fill();

    // 4. Card frame
    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 2;
    this.roundRect(ctx, 40, 40, 720, 920, 24, true, true);

    // 5. Header Title
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = 'bold 14px "Outfit", sans-serif';
    ctx.fillText('ADVISOR EXPLORER · MATCH REPORT', 80, 100);

    // Icon Box
    ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
    this.roundRect(ctx, 80, 130, 48, 48, 12, true, false);
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px sans-serif';
    ctx.fillText('🗺️', 90, 163);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px "Outfit", sans-serif';
    ctx.fillText('学术匹配分享卡', 144, 163);

    // Divider
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(80, 210);
    ctx.lineTo(720, 210);
    ctx.stroke();

    // 6. Matched Result
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '16px sans-serif';
    ctx.fillText('我的理想体系结构研究方向', 80, 260);

    // Gradient Direction Title
    const textGrad = ctx.createLinearGradient(80, 300, 500, 300);
    textGrad.addColorStop(0, '#60a5fa');
    textGrad.addColorStop(1, '#a78bfa');
    ctx.fillStyle = textGrad;
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText(top.directionName, 80, 325);

    // Score capsule
    ctx.fillStyle = 'rgba(99, 102, 241, 0.15)';
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
    this.roundRect(ctx, 80, 355, 180, 42, 10, true, true);
    ctx.fillStyle = '#a78bfa';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(`匹配得分 ${top.score}%`, 110, 382);

    // Vector Point mesh
    this.drawConstellation(ctx, 560, 310);

    // 7. Key Strengths
    if (top.strengths?.length) {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('🎯 核心方向优势依据', 80, 470);

      let offset = 505;
      top.strengths.slice(0, 3).forEach(strength => {
        ctx.fillStyle = 'rgba(16, 185, 129, 0.03)';
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.12)';
        this.roundRect(ctx, 80, offset, 640, 64, 12, true, true);

        // Green check
        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('✓', 105, offset + 40);

        // Strengths text
        ctx.fillStyle = '#f1f5f9';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(strength.label, 140, offset + 38);

        offset += 84;
      });
    }

    // 8. Footer Info & QR Placeholders
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.font = '14px sans-serif';
    ctx.fillText('长按或扫码开启你的 Advisor Explorer 个性化学术方向对比', 80, 890);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    this.roundRect(ctx, 630, 810, 90, 90, 14, true, true);

    ctx.fillStyle = 'rgba(99, 102, 241, 0.6)';
    ctx.fillRect(642, 822, 24, 24);
    ctx.fillRect(684, 822, 24, 24);
    ctx.fillRect(642, 864, 24, 24);
    ctx.fillRect(676, 854, 10, 10);
    ctx.fillRect(684, 874, 14, 10);
    ctx.fillRect(672, 868, 8, 16);

    const image = canvas.toDataURL("image/png");
    const anchor = document.createElement('a');
    anchor.href = image;
    anchor.download = `${filename}.png`;
    anchor.click();
  }

  static roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }

  static drawConstellation(ctx, cx, cy) {
    const pts = [
      { x: cx - 40, y: cy - 50 },
      { x: cx + 25, y: cy - 70 },
      { x: cx + 75, y: cy - 15 },
      { x: cx - 5, y: cy + 40 },
      { x: cx - 65, y: cy + 10 },
      { x: cx + 45, y: cy + 45 },
    ];

    ctx.strokeStyle = 'rgba(167, 139, 250, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.stroke();
      }
    }

    pts.forEach(p => {
      ctx.fillStyle = 'rgba(167, 139, 250, 0.2)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#c084fc';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}
