import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

@Entity()
class Customer {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @Column()
    public address_line_1: string;

    @Column()
    public address_line_2: string;

    @Column()
    public city: string;

    @Column()
    public state: string;

    @Column()
    public zip_code: string;

    @Column()
    public email: number;

    @CreateDateColumn()
    public created_at: string;

    @UpdateDateColumn()
    public updated_at: string;
}

export default Customer;
