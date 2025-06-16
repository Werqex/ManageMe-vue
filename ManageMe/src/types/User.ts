export interface User {
	id: number;
	firstName: string;
	lastName: string;
	role: 'admin' | 'devops' | 'developer';
	login: string;
	password: string;
}

export interface LoginRequest {
	login: string;
	password: string;
}

export interface LoginResponse {
	token: string;
	refreshToken: string;
	user: UserProfile;
}

export interface UserProfile {
	id: number;
	firstName: string;
	lastName: string;
	role: 'admin' | 'devops' | 'developer';
	login: string;
}
