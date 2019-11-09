import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum UserRole {
    ADMIN = "admin",
    DEV = "dev"
}

@Entity()
class User {
    @PrimaryGeneratedColumn()
    public id: number;
    
    @Column()
    public first_name: string;
    
    @Column()
    public last_name: string;
    
    @Column()
    public email: string;
    
    @Column()
    public password: string;
    
    @Column()
    public company_id: number;
    
    @Column({
        default: UserRole.DEV
    })
    public role: UserRole
    
    @CreateDateColumn()
    public created_at: string;
}
 
export default User;