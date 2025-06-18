export interface IUser {
    _id: string;
    email: string;
    password: string;
    name: string;
    role?: 'user' | 'admin';
    orders?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}


