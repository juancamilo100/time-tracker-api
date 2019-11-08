import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
 
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
    public company_id: string;
    
    @Column()
    public role: string;
    
    @Column()
    public created_at: string;
}
 
export default User;