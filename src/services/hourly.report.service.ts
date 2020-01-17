import path from 'path';
import { HourlyReportParameters } from '../../types/types';
import HtmlToPdfService from './pdf.service';
import moment from 'moment';
import Task from '../database/entities/task.entity';
import { toTitleCase } from '../utils/formatter';
import Employee from '../database/entities/employee.entity';

export interface PopulatedReport {
    employee?: Employee
    startDate: Date,
    endDate: Date,
    tasks: Task[],
    totalHours: number
}

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

    public async getHourlyReportPdfAttachments(populatedReports: PopulatedReport[]) {
        let hourlyReportPdfAttachments = [];

        for (const report of populatedReports) {
            const hourlyReportParams = await this.buildHourlyReportParams(report);
            
            const hourlyReportPdfPath = await this.generateHourlyReportPdf(hourlyReportParams);
            hourlyReportPdfAttachments.push({
                filename: `Lulosoft Hourly Report - ${hourlyReportParams.employeeName} - ${hourlyReportParams.reportPeriod}.pdf`,
                path: hourlyReportPdfPath
            });
        }

        return hourlyReportPdfAttachments;
    }

    public async getHourlyReportTasksTableElements(tasks: Task[]) {
        let tableElements = "";
        for (let i = 0; i < tasks.length; i++) {
            tableElements += `<tr><td>${moment(tasks[i].date_performed).format('L')}</td><td>${tasks[i].description}</td><td class='align-right'>${tasks[i].hours}</td></tr>`
        }
        return tableElements;
    }

    public async buildHourlyReportParams(report: PopulatedReport) {
        return {
            employeeName: toTitleCase(`${report.employee!.first_name} ${report.employee!.last_name}`),
            reportPeriod: `${moment(report.startDate).format("MM-DD-YYYY")} to ${moment(report.endDate).format("MM-DD-YYYY")}`,
            tableRows: await this.getHourlyReportTasksTableElements(report.tasks),
            totalHours: report.totalHours.toString()
        };
    }
}

export default new HourlyReportService();