<template>
	<div
		class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
		<div class="max-w-md w-full space-y-8">
			<div>
				<h2
					class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
					Zaloguj się do ManageMe
				</h2>
			</div>

			<form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
				<div class="rounded-md shadow-sm space-y-4">
					<div>
						<label
							for="login"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Login
						</label>
						<input
							id="login"
							v-model="loginData.login"
							type="text"
							required
							class="relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
							placeholder="Wprowadź login" />
					</div>

					<div>
						<label
							for="password"
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Hasło
						</label>
						<input
							id="password"
							v-model="loginData.password"
							type="password"
							required
							class="relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
							placeholder="Wprowadź hasło" />
					</div>
				</div>

				<div
					v-if="error"
					class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-4">
					<div class="text-sm text-red-700 dark:text-red-300">{{ error }}</div>
				</div>

				<div
					class="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-md p-4">
					<h4 class="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
						Przykładowe loginy:
					</h4>
					<div class="text-xs text-blue-700 dark:text-blue-300 space-y-1">
						<p><strong>Admin:</strong> admin / admin123</p>
						<p><strong>Developer:</strong> developer / dev123</p>
						<p><strong>DevOps:</strong> devops / devops123</p>
					</div>
				</div>

				<div>
					<button
						type="submit"
						:disabled="isLoading"
						class="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 disabled:bg-gray-400 dark:disabled:bg-gray-600 cursor-pointer transition-colors">
						{{ isLoading ? 'Logowanie...' : 'Zaloguj się' }}
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { LoginRequest } from '../types/User';

const emit = defineEmits<{
	loginSuccess: [user: any];
}>();

const loginData = ref<LoginRequest>({
	login: '',
	password: '',
});

const isLoading = ref(false);
const error = ref<string | null>(null);

// Obsługiwanie logowania
const handleSubmit = async () => {
	isLoading.value = true;
	error.value = null;

	try {
		const response = await fetch('http://localhost:3000/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(loginData.value),
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(errorText || 'Błąd logowania');
		}

		const data = await response.json();

		localStorage.setItem('auth_token', data.token);
		localStorage.setItem('refresh_token', data.refreshToken);

		emit('loginSuccess', data.user);
	} catch (err) {
		error.value = err instanceof Error ? err.message : 'Wystąpił błąd';
	} finally {
		isLoading.value = false;
	}
};
</script>
