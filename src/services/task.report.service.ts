import path from 'path';
import Invoice from '../database/entities/invoice.entity';
import { EntitySchema } from 'typeorm';
import BaseDataService from './base.data.service';
import { TaskReportParameters } from '../../types/types';
import moment from 'moment';
import HtmlToPdfService from './pdf.service';

export const taskReportEnvVarNames: TaskReportParameters = {
    employeeName: 'TASK_REPORT_EMPLOYEE_NAME',
}

export class TaskReportService {
    private htmlToPdfService = new HtmlToPdfService<TaskReportParameters>(
        taskReportEnvVarNames,
        path.join(__dirname, '/../taskReport/taskReportParamsPlaceholder.js'),
        path.join(__dirname, '/../taskReport/taskReportParams.js'),
        path.join(__dirname, '/../taskReport/taskReport.html'),
        {
            pixelWidth: 1300,
            pixelHeight: 1625
        }
    )

    public async generateInvoicePdf(invoiceParams: TaskReportParameters): Promise<string> {
        const invoicePdfFileName = `task-report-${moment(invoiceParams.invoiceDate).format("MM.DD.YYYY")}`;
        return this.htmlToPdfService.generatePdf(invoicePdfFileName, invoiceParams);
    }
}

export default new TaskReportService();