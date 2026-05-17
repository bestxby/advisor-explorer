import { useCallback, useState } from 'react';
import { generateMarkdown } from '../utils/markdownExport';
import { HTMLReportGenerator, PDFReportService, ShareCardGenerator } from '../services/ExportService';

function downloadFile(content, mimeType, extension, filename) {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${filename}.${extension}`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function useMarkdownExport({
  results,
  directions,
  professors,
  filename = 'advisor-explorer-result',
}) {
  const [exportingFormat, setExportingFormat] = useState(null);

  const exportMarkdown = useCallback(() => {
    if (!results?.length || exportingFormat) return;
    setExportingFormat('md');
    try {
      const markdown = generateMarkdown(results, directions, professors);
      downloadFile(markdown, 'text/markdown', 'md', filename);
    } catch (error) {
      console.error('Export MD failed:', error);
    } finally {
      setTimeout(() => setExportingFormat(null), 800);
    }
  }, [results, directions, professors, filename, exportingFormat]);

  const exportHTML = useCallback(() => {
    if (!results?.length || exportingFormat) return;
    setExportingFormat('html');
    try {
      const markdown = generateMarkdown(results, directions, professors);
      const html = HTMLReportGenerator.generate(markdown);
      downloadFile(html, 'text/html', 'html', filename);
    } catch (error) {
      console.error('Export HTML failed:', error);
    } finally {
      setTimeout(() => setExportingFormat(null), 800);
    }
  }, [results, directions, professors, filename, exportingFormat]);

  const exportPDF = useCallback(() => {
    if (!results?.length || exportingFormat) return;
    setExportingFormat('pdf');
    try {
      const markdown = generateMarkdown(results, directions, professors);
      PDFReportService.print(markdown);
    } catch (error) {
      console.error('Export PDF failed:', error);
    } finally {
      setTimeout(() => setExportingFormat(null), 800);
    }
  }, [results, directions, professors, exportingFormat]);

  const exportPNG = useCallback(() => {
    if (!results?.length || exportingFormat) return;
    setExportingFormat('png');
    try {
      ShareCardGenerator.generate(results, directions, professors, filename);
    } catch (error) {
      console.error('Export PNG failed:', error);
    } finally {
      setTimeout(() => setExportingFormat(null), 800);
    }
  }, [results, directions, professors, filename, exportingFormat]);

  return {
    exporting: !!exportingFormat,
    exportingFormat,
    exportMarkdown,
    exportHTML,
    exportPDF,
    exportPNG,
    canExport: !!results?.length && !exportingFormat,
  };
}
