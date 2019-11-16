import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum EmployeeRole {
    ADMIN = "admin",
    DEV = "dev"
}

@Entity()
class Employee {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public first_name: string;

    @Column()
    public last_name: string;

    @Column()
    public email: string;

    @Column({select: false})
    public password: string;

    @Column()
    public customer_id: number;

    @Column()
    public hourly_rate: number;

    @Column({
        default: EmployeeRole.DEV
    })
    public role: EmployeeRole;

    @CreateDateColumn()
    public created_at: string;
}

export default Employee;
