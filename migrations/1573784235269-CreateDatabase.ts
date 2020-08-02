import bcrypt from "bcryptjs";
import { MigrationInterface, QueryRunner } from "typeorm";
import { EmployeeRoles } from "../src/database/entities/employee.entity";

export class CreateDatabase1573784235269 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TABLE employee (
                "id" SERIAL UNIQUE PRIMARY KEY,
                "first_name" varchar,
                "last_name" varchar,
                "email" varchar NOT NULL,
                "job_title" varchar NOT NULL,
                "password" varchar NOT NULL,
                "customer_id" int,
                "role" varchar,
                "employee_rate" int,
                "customer_rate" int,
                "created_at" timestamp DEFAULT current_timestamp,
                "updated_at" timestamp DEFAULT current_timestamp
            );

            CREATE TABLE customer (
                "id" SERIAL UNIQUE PRIMARY KEY,
                "name" varchar NOT NULL,
                "address_line_1" varchar,
                "address_line_2" varchar,
                "city" varchar,
                "state" varchar,
                "zip_code" varchar,
                "email" varchar NOT NULL,
                "created_at" timestamp DEFAULT current_timestamp,
                "updated_at" timestamp DEFAULT current_timestamp
            );

            CREATE TABLE report (
                "id" SERIAL UNIQUE PRIMARY KEY,
                "customer_id" int,
                "employee_id" int,
                "start_date" date,
                "end_date" date,
                "submitted" boolean DEFAULT false,
                "invoice_id" int,
                "created_at" timestamp DEFAULT current_timestamp,
                "updated_at" timestamp DEFAULT current_timestamp
            );

            CREATE TABLE invoice (
                "id" SERIAL UNIQUE PRIMARY KEY,
                "customer_id" int,
                "dollar_amount" int,
                "start_date" date,
                "end_date" date,
                "submitted_date" timestamp DEFAULT current_timestamp,
                "due_date" date,
                "paid" boolean DEFAULT false,
                "created_at" timestamp DEFAULT current_timestamp,
                "updated_at" timestamp DEFAULT current_timestamp
            );

            CREATE TABLE task (
                "id" SERIAL UNIQUE PRIMARY KEY,
                "report_id" int,
                "hours" int,
                "description" varchar,
                "date_performed" date,
                "created_at" timestamp DEFAULT current_timestamp,
                "updated_at" timestamp DEFAULT current_timestamp
            );

            ALTER TABLE employee ADD FOREIGN KEY ("customer_id") REFERENCES customer ("id");
            ALTER TABLE report ADD FOREIGN KEY ("customer_id") REFERENCES customer ("id") ON DELETE CASCADE;
            ALTER TABLE report ADD FOREIGN KEY ("employee_id") REFERENCES employee ("id") ON DELETE CASCADE;
            ALTER TABLE report ADD FOREIGN KEY ("invoice_id") REFERENCES invoice ("id") ON DELETE CASCADE;
            ALTER TABLE invoice ADD FOREIGN KEY ("customer_id") REFERENCES customer ("id") ON DELETE CASCADE;
            ALTER TABLE task ADD FOREIGN KEY ("report_id") REFERENCES report ("id") ON DELETE CASCADE;

            INSERT INTO customer (id, name, city, state, email)
            VALUES (0, 'Lulosoft', 'Louisville', 'KY', 'contact@lulosoft.com');

            INSERT INTO employee (first_name, last_name, job_title, email, password, customer_id, role)
            VALUES (
                'Default',
                'Admin',
                'Founder',
                '${process.env.DEFAULT_ADMIN_EMPLOYEE_EMAIL}',
                '${bcrypt.hashSync(process.env.DEFAULT_ADMIN_EMPLOYEE_PASSWORD!)}',
                0,
                '${EmployeeRoles.ADMIN}'
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            DROP TABLE employee;
            DROP TABLE customer;
            DROP TABLE report;
            DROP TABLE task;
        `);
    }
}
