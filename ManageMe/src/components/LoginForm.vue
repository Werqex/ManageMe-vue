<template>
	<div class="min-h-screen bg-gray-50 flex items-center justify-center">
		<div class="max-w-md w-full space-y-8">
			<div>
				<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
					Zaloguj się do ManageMe
				</h2>
			</div>

			<form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
				<div class="rounded-md shadow-sm space-y-4">
					<div>
						<label
							for="login"
							class="block text-sm font-medium text-gray-700 mb-1">
							Login
						</label>
						<input
							id="login"
							v-model="loginData.login"
							type="text"
							required
							class="relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							placeholder="Wprowadź login" />
					</div>

					<div>
						<label
							for="password"
							class="block text-sm font-medium text-gray-700 mb-1">
							Hasło
						</label>
						<input
							id="password"
							v-model="loginData.password"
							type="password"
							required
							class="relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							placeholder="Wprowadź hasło" />
					</div>
				</div>

				<div
					v-if="error"
					class="bg-red-50 border border-red-200 rounded-md p-4">
					<div class="text-sm text-red-700">{{ error }}</div>
				</div>

				<!-- Przykładowe dane -->
				<div class="bg-blue-50 border border-blue-200 rounded-md p-4">
					<h4 class="text-sm font-medium text-blue-800 mb-2">
						Przykładowe loginy:
					</h4>
					<div class="text-xs text-blue-700 space-y-1">
						<p><strong>Admin:</strong> admin / admin123</p>
						<p><strong>Developer:</strong> developer / dev123</p>
						<p><strong>DevOps:</strong> devops / devops123</p>
					</div>
				</div>

				<div>
					<button
						type="submit"
						:disabled="isLoading"
						class="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 cursor-pointer">
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

		// Zapisz tokeny
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
