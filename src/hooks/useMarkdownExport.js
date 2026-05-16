import { useCallback, useState } from 'react';
import { generateMarkdown } from '../utils/markdownExport';

function downloadMarkdown(markdown, filename) {
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${filename}.md`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function useMarkdownExport({
  results,
  directions,
  professors,
  filename,
}) {
  const [exporting, setExporting] = useState(false);

  const exportMarkdown = useCallback(() => {
    if (!results?.length || exporting) return;

    setExporting(true);

    try {
      const markdown = generateMarkdown(results, directions, professors);
      downloadMarkdown(markdown, filename);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setTimeout(() => setExporting(false), 1000);
    }
  }, [results, directions, professors, filename, exporting]);

  return {
    exporting,
    exportMarkdown,
    canExport: !!results?.length && !exporting,
  };
}
