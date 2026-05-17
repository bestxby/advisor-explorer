import { MarkdownReportBuilder } from '../services/ExportService';

export function generateMarkdown(results, directions, professors) {
  const builder = new MarkdownReportBuilder({ results, directions, professors });
  return builder.build();
}
