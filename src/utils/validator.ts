import moment from 'moment';
import Task from '../database/entities/task.entity';
import IDataService from '../interfaces/data.service.interface';
import Report from '../database/entities/report.entity';
import Employee from '../database/entities/employee.entity';
import Customer from '../database/entities/customer.entity';
import { ReportPeriod } from '../../types/types';

export class Validator {
    constructor(
        private employeeService: IDataService<Employee>,
        private taskService: IDataService<Task>,
        private reportService: IDataService<Report>,
        private customerService: IDataService<Customer>) {}

    public async reportId(reportId: string) {
        const reportFound =  await this.reportService.getByFields(
            { 
                submitted: false,
                id: reportId
            }
        );
            
        if (!reportFound) {
            throw new Error(`Report with ID: ${reportId} was not found or has already been submitted`);
        }

        return reportFound;
    } 

    public async taskId(taskId: string) {
        const taskFound =  await this.taskService.get(taskId);
            
        if (!taskFound) {
            throw new Error(`Task with ID: ${taskId} was not found`);
        }

        return taskFound;
    } 

    public async employeeId(employeeId: string) {
        const employeeFound =  await this.employeeService.get(employeeId);
            
        if (!employeeFound) {
            throw new Error(`Employee with ID: ${employeeId} was not found`);
        }

        return employeeFound;
    }

    public async customerId(customerId: string) {
        const customerFound =  await this.customerService.get(customerId);
            
        if (!customerFound) {
            throw new Error(`Customer with ID: ${customerId} was not found`);
        }

        return customerFound;
    }

    public async customerExists(name: string, email: string) {
        const customerFound = await this.customerService.getByEitherFields({ name, email });
        if(!!customerFound) {
            throw new Error("Customer already exists");
        }
    }

    public async employeeExists(email: string) {
        const employeeFound = await this.employeeService.getByFields({ email });
        if(!!employeeFound) {
            throw new Error("Employee already exists");
        }
    }

    public isEmail(email: string) {
        const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!emailRegex.test(email)) {
            throw new Error("Email is not valid");
        }
    }

    public async taskAndReportIdRelation(taskId: number, reportId: number) {
            const foundTask = await this.taskService.getByFields(
                { 
                    id: taskId,
                    report_id: reportId
                }
            );
            if (!foundTask) {
                throw new Error(`Task with ID: ${taskId} was not found or doesn't belong to report with ID: ${reportId}`);
            }

            return foundTask;
    }

    public taskFields(task: Task) {
        if (!task.hours ||
            !task.date_performed) {
            throw new Error("Fields missing from task");
        }
    }

    public reportPeriodDates(reportPeriod: ReportPeriod) {
        this.dateFormat(reportPeriod.start);
        this.dateFormat(reportPeriod.end);
    }

    public taskDateAgainstReportPeriod(reportPeriod: ReportPeriod, task: Task) {
        const isBetween = moment(task.date_performed).isBetween(reportPeriod.start, reportPeriod.end, undefined, "[]");
        if(!isBetween) {
            throw new Error("Task's performed date is outside of the report period");
        }
    }

    public async employeeCustomerRelation(customerId: number, employeeId: number) {
        const employee = await this.employeeService.getByFields({
            customer_id: customerId,
            id: employeeId
        });
        if (!employee) {
            throw new Error(`Employee with ID: ${employeeId} does not work for customer with ID: ${customerId}`);
        }
    }
    
    public dateFormat(date: Date) {
        if(!moment(date).isValid()) {
            throw new Error("Date is invalid");
        }
    }
}