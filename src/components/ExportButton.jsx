import { useCallback, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';

export default function ExportButton({ targetRef, filename = 'advisor-explorer-result' }) {
  const [exporting, setExporting] = useState(false);
  const timeoutRef = useRef(null);

  const handleExport = useCallback(async () => {
    if (!targetRef?.current || exporting) return;

    setExporting(true);

    try {
      const dataUrl = await toPng(targetRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });
      saveAs(dataUrl, `${filename}.png`);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      timeoutRef.current = window.setTimeout(() => {
        setExporting(false);
      }, 1000);
    }
  }, [targetRef, filename, exporting]);

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-xl font-semibold border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 hover:shadow-sm transition-all duration-200 cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
        />
      </svg>
      {exporting ? '导出中...' : '导出图片'}
    </button>
  );
}
