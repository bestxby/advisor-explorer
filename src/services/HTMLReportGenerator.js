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
