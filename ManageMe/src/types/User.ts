export interface User {
	id: number;
	firstName: string;
	lastName: string;
	role: 'admin' | 'devops' | 'developer';
}
