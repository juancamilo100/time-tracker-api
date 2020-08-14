import { EntitySchema, getRepository } from "typeorm";
import Customer from "../database/entities/customer.entity";
import BaseDataService from "./base.data.service";

export class CustomerService extends BaseDataService<Customer> {
	constructor() {
		super({
			schema: (Customer as unknown) as EntitySchema<Customer>,
			alias: "customer",
		});
	}

	public async getByEmails(emails: string[]) {
		const customer = await getRepository(this.entity.schema)
			.createQueryBuilder("customer")
			.where("customer.emails && ARRAY[:...emails]", { emails })
			.getOne();

		return customer;
	}
}

export default new CustomerService();
