import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDatabase1573784235269 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(` 
            CREATE TABLE employee (
                "id" SERIAL UNIQUE PRIMARY KEY,
                "first_name" varchar,
                "last_name" varchar,
                "email" varchar NOT NULL,
                "password" varchar NOT NULL,
                "customer_id" int,
                "role" varchar,
                "hourly_rate" int,
                "created_at" timestamp
            );
            
            CREATE TABLE customer (
                "id" SERIAL UNIQUE PRIMARY KEY,
                "name" varchar NOT NULL,
                "address" varchar,
                "city" varchar,
                "state" varchar,
                "email" varchar NOT NULL,
                "created_at" timestamp
            );
            
            CREATE TABLE report (
                "id" SERIAL UNIQUE PRIMARY KEY,
                "customer_id" int,
                "employee_id" int,
                "total_hours" int,
                "created_at" varchar
            );
            
            CREATE TABLE task (
                "id" SERIAL UNIQUE PRIMARY KEY,
                "report_id" int,
                "hours" int,
                "description" varchar,
                "date" date,
                "created_at" timestamp
            );
            
            ALTER TABLE employee ADD FOREIGN KEY ("customer_id") REFERENCES customer ("id");
            ALTER TABLE report ADD FOREIGN KEY ("customer_id") REFERENCES customer ("id");
            ALTER TABLE report ADD FOREIGN KEY ("employee_id") REFERENCES employee ("id");
            ALTER TABLE task ADD FOREIGN KEY ("report_id") REFERENCES report ("id");
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
