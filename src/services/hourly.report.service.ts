import path from 'path';
import { HourlyReportParameters } from '../../types/types';
import HtmlToPdfService from './pdf.service';

export const hourlyReportEnvVarNames: HourlyReportParameters = {
    employeeName: 'HOURLY_REPORT_EMPLOYEE_NAME',
    reportPeriod: 'HOURLY_REPORT_PERIOD',
    tableRows: 'HOURLY_REPORT_TABLE_ROWS',
    totalHours: 'HOURLY_REPORT_TOTAL_HOURS',
}

export class HourlyReportService {
    private htmlToPdfService = new HtmlToPdfService<HourlyReportParameters>(
        hourlyReportEnvVarNames,
        path.join(__dirname, '/../hourlyReport/hourlyReportParamsPlaceholder.js'),
        path.join(__dirname, '/../hourlyReport/hourlyReportParams.js'),
        path.join(__dirname, '/../hourlyReport/hourlyReport.html'),
        {
            pixelWidth: 1300,
            pixelHeight: 1625
        }
    )

    public async generateHourlyReportPdf(hourlyReportParams: HourlyReportParameters): Promise<string> {
        const hourlyReportPdfFileName = `hourly-report-${hourlyReportParams.employeeName}-${hourlyReportParams.reportPeriod}`;
        return this.htmlToPdfService.generatePdf(hourlyReportPdfFileName, hourlyReportParams);
    }
}

export default new HourlyReportService();