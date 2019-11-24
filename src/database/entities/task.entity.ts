import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

@Entity()
class Task {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public report_id: number;

    @Column()
    public hours: string;

    @Column()
    public description: string;

    @Column()
    public date_performed: Date;

    @CreateDateColumn()
    public created_at: string;

    @UpdateDateColumn()
    public updated_at: string;
}

export default Task;
