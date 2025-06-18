export interface UserDocument {
	_id: string;
	firstName: string;
	lastName: string;
	login: string;
	password: string;
	role: 'admin' | 'developer' | 'devops';
	updatedAt?: Date;
}

export const UserCollection = 'users';
