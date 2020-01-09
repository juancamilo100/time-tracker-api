import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum EmployeeRoles {
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

    @Column()
    public job_title: string;

    @Column({select: false})
    public password: string;

    @Column()
    public customer_id: number;

    @Column()
    public employee_rate: number;
    
    @Column()
    public customer_rate: number;

    @Column({
        default: EmployeeRoles.DEV
    })
    public role: EmployeeRoles;

    @CreateDateColumn()
    public created_at: string;

    @UpdateDateColumn()
    public updated_at: string;
}

export default Employee;
