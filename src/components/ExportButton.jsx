import { useEffect, useRef, useState } from 'react';
import useMarkdownExport from '../hooks/useMarkdownExport';

export default function ExportButton({
  results,
  directions,
  professors,
  filename = 'advisor-explorer-result',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const {
    exporting,
    exportingFormat,
    exportMarkdown,
    exportHTML,
    exportPDF,
    exportPNG,
    canExport,
  } = useMarkdownExport({
    results,
    directions,
    professors,
    filename,
  });

  const toggleDropdown = () => {
    if (canExport) {
      setIsOpen((prev) => !prev);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const handleExport = (formatFn) => {
    formatFn();
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        disabled={!canExport}
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#111a2e] text-slate-300 rounded-xl font-semibold border border-[#2a3550] hover:bg-[#2a3550] hover:shadow-sm transition-all duration-200 cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          className="w-4 h-4 text-indigo-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {exporting ? `导出中 (${exportingFormat.toUpperCase()})...` : '导出匹配报告'}
        <svg
          className={`w-4 h-4 ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-slate-950/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2.5 z-50 animate-fadeIn space-y-1">
          <div className="px-3 py-1.5 border-b border-white/5 mb-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              选择导出格式
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleExport(exportMarkdown)}
            className="w-full flex items-start gap-3 p-2.5 hover:bg-white/5 rounded-xl transition-colors text-left cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
              <span className="text-sm">📝</span>
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-200 block">Markdown 文档 (.md)</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">便于导入 Obsidian 或 Notion 知识库</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleExport(exportHTML)}
            className="w-full flex items-start gap-3 p-2.5 hover:bg-white/5 rounded-xl transition-colors text-left cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20 group-hover:bg-orange-500/20 transition-colors">
              <span className="text-sm">🌐</span>
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-200 block">离线 HTML 网页 (.html)</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">包含苹果风排版排版设计，支持离线阅读</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleExport(exportPDF)}
            className="w-full flex items-start gap-3 p-2.5 hover:bg-white/5 rounded-xl transition-colors text-left cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20 group-hover:bg-red-500/20 transition-colors">
              <span className="text-sm">📄</span>
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-200 block">学术 PDF 报告 (.pdf)</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">完美分页排版，自动呼出浏览器打印保存</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleExport(exportPNG)}
            className="w-full flex items-start gap-3 p-2.5 hover:bg-white/5 rounded-xl transition-colors text-left cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
              <span className="text-sm">🎨</span>
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-200 block">精美分享卡片 (.png)</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">生成极具科技感的立体点云匹配海报</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
