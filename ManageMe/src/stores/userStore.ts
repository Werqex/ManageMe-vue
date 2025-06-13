import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '../types/User';

export const useUserStore = defineStore('user', () => {
	// Zamockowana lista użytkowników
	const users = ref<User[]>([
		{
			id: 1,
			firstName: 'Jan',
			lastName: 'Kowalski',
			role: 'admin',
		},
		{
			id: 2,
			firstName: 'Anna',
			lastName: 'Nowak',
			role: 'developer',
		},
		{
			id: 3,
			firstName: 'Piotr',
			lastName: 'Wiśniewski',
			role: 'devops',
		},
	]);

	// Zalogowany użytkownik - admin
	const currentUser = ref<User>(users.value[0]);

	const getCurrentUser = () => currentUser.value;

	const getAllUsers = () => users.value;

	const getUsersByRole = (role: 'admin' | 'devops' | 'developer') => {
		return users.value.filter((user) => user.role === role);
	};

	const getUserById = (id: number) => {
		return users.value.find((user) => user.id === id);
	};

	// Funkcja do zmiany zalogowanego użytkownika
	const loginAs = (userId: number) => {
		const user = getUserById(userId);
		if (user) {
			currentUser.value = user;
		}
	};

	// Funkcja zwracająca tekst roli
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
		getCurrentUser,
		users,
		getAllUsers,
		getUsersByRole,
		getUserById,
		loginAs,
		getRoleText,
	};
});
