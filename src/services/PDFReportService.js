import { HTMLReportGenerator } from './HTMLReportGenerator';

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
