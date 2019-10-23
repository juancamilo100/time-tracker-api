
interface IUser {
	_id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    company_id: number;
    role: string;
    created_at: Date
}

export { IUser };
