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
    public start_date: string;
    
    @Column()
    public end_date: string;

    @Column()
    public submitted: boolean;

    @CreateDateColumn()
    public created_at: string;

    @UpdateDateColumn()
    public updated_at: string;
}

export default Report;
