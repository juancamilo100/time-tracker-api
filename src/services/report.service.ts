import { EntitySchema } from "typeorm";
import Report from "../database/entities/report.entity";
import BaseDataService from "./base.service";

class ReportService extends BaseDataService<Report> {
    constructor() {
        super({
            schema: Report as unknown as EntitySchema<Report>,
            alias: "report"
        });
    }

    public submitReport(reportId: string) {
        this.update(reportId, {
            submitted: true
        } as any )
    }
}

export default new ReportService();
