import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User, UserProfile } from '../types/User';

export const useUserStore = defineStore('user', () => {
	// Zamockowana lista użytkowników z danymi logowania
	const users = ref<User[]>([
		{
			id: 1,
			firstName: 'Jan',
			lastName: 'Kowalski',
			role: 'admin',
			login: 'admin',
			password: 'admin123',
		},
		{
			id: 2,
			firstName: 'Anna',
			lastName: 'Nowak',
			role: 'developer',
			login: 'developer',
			password: 'dev123',
		},
		{
			id: 3,
			firstName: 'Piotr',
			lastName: 'Wiśniewski',
			role: 'devops',
			login: 'devops',
			password: 'devops123',
		},
	]);

	const currentUser = ref<UserProfile | null>(null);
	const isAuthenticated = ref(false);

	// Sprawdź czy użytkownik jest zalogowany przy starcie
	const checkAuth = async () => {
		const token = localStorage.getItem('auth_token');
		if (token) {
			try {
				const response = await fetch('http://localhost:3000/auth/me', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (response.ok) {
					const user = await response.json();
					currentUser.value = user;
					isAuthenticated.value = true;
				} else {
					// Token nieprawidłowy
					logout();
				}
			} catch (error) {
				logout();
			}
		}
	};

	const login = (user: UserProfile) => {
		currentUser.value = user;
		isAuthenticated.value = true;
	};

	const logout = () => {
		currentUser.value = null;
		isAuthenticated.value = false;
		localStorage.removeItem('auth_token');
		localStorage.removeItem('refresh_token');
	};

	const getAllUsers = () => users.value;

	const getUsersByRole = (role: 'admin' | 'devops' | 'developer') => {
		return users.value.filter((user) => user.role === role);
	};

	const getUserById = (id: number) => {
		return users.value.find((user) => user.id === id);
	};

	const getUserByCredentials = (login: string, password: string) => {
		return users.value.find(
			(user) => user.login === login && user.password === password
		);
	};

	const getRoleText = (role: 'admin' | 'devops' | 'developer') => {
		const roleTexts = {
			admin: 'Administrator',
			devops: 'DevOps',
			developer: 'Programista',
		};
		return roleTexts[role];
	};

	return {
		currentUser,
		isAuthenticated,
		checkAuth,
		login,
		logout,
		getAllUsers,
		getUsersByRole,
		getUserById,
		getUserByCredentials,
		getRoleText,
	};
});
