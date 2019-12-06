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
}

export default new ReportService();