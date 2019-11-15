import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateDatabase1573784235269 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(` 
        CREATE TABLE "employees" (
            "id" SERIAL UNIQUE PRIMARY KEY,
            "first_name" varchar,
            "last_name" varchar,
            "email" varchar,
            "password" varchar,
            "customer_id" int,
            "role" varchar,
            "hourly_rate" int,
            "created_at" timestamp
          );
          
          CREATE TABLE "customers" (
            "id" SERIAL UNIQUE PRIMARY KEY,
            "name" varchar,
            "city" varchar,
            "email" varchar,
            "address" varchar,
            "created_at" timestamp
          );
          
          CREATE TABLE "reports" (
            "id" SERIAL UNIQUE PRIMARY KEY,
            "customer_id" int,
            "user_id" int,
            "total_hours" int,
            "created_at" varchar
          );
          
          CREATE TABLE "tasks" (
            "id" SERIAL UNIQUE PRIMARY KEY,
            "report_id" int,
            "hours" int,
            "description" varchar,
            "date" date,
            "created_at" timestamp
          );
          
          ALTER TABLE "employees" ADD FOREIGN KEY ("customer_id") REFERENCES "customers" ("id");
          
          ALTER TABLE "reports" ADD FOREIGN KEY ("customer_id") REFERENCES "customers" ("id");
          
          ALTER TABLE "reports" ADD FOREIGN KEY ("user_id") REFERENCES "employees" ("id");
          
          ALTER TABLE "tasks" ADD FOREIGN KEY ("report_id") REFERENCES "reports" ("id");
          
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }
}
