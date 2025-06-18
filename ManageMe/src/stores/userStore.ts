import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User, UserProfile } from '../types/User';
import { apiService } from '../services/ApiService';

export const useUserStore = defineStore('user', () => {
	// Stan aplikacji - przechowuje dane użytkowników i informacje o zalogowanym użytkowniku
	const users = ref<User[]>([]);
	const currentUser = ref<UserProfile | null>(null);
	const isAuthenticated = ref(false);

	// Pobiera listę wszystkich użytkowników z API
	const fetchUsers = async () => {
		try {
			users.value = await apiService.getAllUsers();
		} catch (error) {
			console.error('Failed to fetch users:', error);
		}
	};

	// Sprawdza stan autentykacji przy starcie aplikacji
	// Weryfikuje token JWT z local storage
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
					await fetchUsers();
				} else {
					logout();
				}
			} catch (error) {
				logout();
			}
		}
	};

	// Ustawia dane zalogowanego użytkownika i pobiera listę wszystkich użytkowników
	const login = async (user: UserProfile) => {
		currentUser.value = user;
		isAuthenticated.value = true;
		await fetchUsers();
	};

	// Wylogowuje użytkownika i czyści dane uwierzytelniające
	// Usuwa tokeny JWT z pamięci lokalnej
	const logout = () => {
		currentUser.value = null;
		isAuthenticated.value = false;
		users.value = [];
		localStorage.removeItem('auth_token');
		localStorage.removeItem('refresh_token');
	};

	// Zwraca listę wszystkich użytkowników
	const getAllUsers = () => users.value;

	// Filtruje użytkowników według określonej roli
	const getUsersByRole = (role: 'admin' | 'devops' | 'developer') => {
		return users.value.filter((user) => user.role === role);
	};

	// Zwraca użytkowników, którym można przypisać zadania
	// Tylko DevOps i programiści mogą być przypisywani do zadań
	const getAssignableUsers = () => {
		return users.value.filter(
			(user) => user.role === 'devops' || user.role === 'developer'
		);
	};

	// Wyszukuje użytkownika po identyfikatorze
	// Obsługuje zarówno string jak i number, co jest przydatne dla MongoDB ObjectId
	const getUserById = (id: string | number) => {
		return users.value.find((user) => {
			// Porównaj jako string - MongoDB ObjectId
			return user.id.toString() === id.toString();
		});
	};

	// Wyszukuje użytkownika po danych logowania
	// Używane przy lokalnej weryfikacji poświadczeń
	const getUserByCredentials = (login: string, password: string) => {
		return users.value.find(
			(user) => user.login === login && user.password === password
		);
	};

	// Konwertuje kod roli na przyjazną nazwę w języku polskim
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
		getAssignableUsers,
		getUserById,
		getUserByCredentials,
		getRoleText,
		fetchUsers,
	};
});
