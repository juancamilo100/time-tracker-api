import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

@Entity()
class Invoice {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public customer_id: number;

    @Column()
    public dollar_amount: number;

    @Column()
    public start_date: Date;

    @Column()
    public end_date: Date;

    @Column()
    public submitted_date: Date;

    @Column()
    public due_date: Date;
    
    @Column()
    public paid: boolean;

    @CreateDateColumn()
    public created_at: string;

    @UpdateDateColumn()
    public updated_at: string;
}

export default Invoice;
