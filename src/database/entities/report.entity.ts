import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

@Entity()
class Report {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public customer_id: number;

    @Column()
    public employee_id: number;

    @Column()
    public total_hours: number;

    @CreateDateColumn()
    public created_at: string;

    @UpdateDateColumn()
    public updated_at: string;
}

export default Report;
