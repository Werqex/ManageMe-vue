export type User = {
	id: string;
	firstName: string;
	lastName: string;
	role: 'admin' | 'devops' | 'developer';
	login: string;
	password: string;
};

export type LoginRequest = {
	login: string;
	password: string;
};

export type LoginResponse = {
	token: string;
	refreshToken: string;
	user: UserProfile;
};

export type UserProfile = {
	id: string;
	firstName: string;
	lastName: string;
	role: 'admin' | 'devops' | 'developer';
	login: string;
};
