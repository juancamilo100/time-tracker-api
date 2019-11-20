import BaseDataService from './base.service';
import { EntitySchema } from 'typeorm';
import Customer from '../database/entities/customer.entity';

export class CustomerService extends BaseDataService<Customer> {
    constructor() {
        super({
            schema: Customer as unknown as EntitySchema<Customer>,
            alias: 'customer'
        });
    }
}

export default new CustomerService();
