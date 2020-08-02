import {
	EntitySchema,
	getRepository,
	In,
} from "typeorm";
import Report from "../database/entities/report.entity";
import BaseDataService from "./base.data.service";

export class ReportService extends BaseDataService<Report> {
	constructor() {
		super({
			schema: (Report as unknown) as EntitySchema<Report>,
			alias: "report",
		});
	}

    public async assignInvoiceToReports(invoiceId: number, reports: Report[]) {
        getRepository(this.entity.schema)
            .createQueryBuilder()
            .update(this.entity.schema)
            .set({invoice_id: invoiceId} as any)
            .where({id: In(reports.map(report => report.id))})
            .execute();
    }

    public async clearInvoiceFromReports(reports: Report[]) {
        getRepository(this.entity.schema)
            .createQueryBuilder()
            .update(this.entity.schema)
            .set({invoice_id: undefined} as any)
            .where({id: In(reports.map(report => report.id))})
            .execute();
    }
	// public async getCustomerReportsForDates(customerId: number, startDate: string, endDate: string) {
	//     try {
	//         const reports = await getRepository(this.entity.schema)
	//             .find({
	//                 where: {
	//                     start_date: MoreThanOrEqual(startDate),
	//                     end_date: LessThanOrEqual(endDate),
	//                     submitted: true,
	//                     customer_id: customerId
	//                 }
	//             });
	//         return reports;
	//     } catch (error) {
	//         console.error(error);
	//         throw new Error("Something went wrong while getting the reports by date");
	//     }
	// }
}

export default new ReportService();
