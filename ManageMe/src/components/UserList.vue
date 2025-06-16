<template>
	<div class="bg-white rounded-lg shadow-md p-6 mb-6">
		<h3 class="text-2xl font-semibold text-gray-800 mb-4">
			Lista użytkowników
		</h3>
		<div class="space-y-3">
			<div
				v-for="user in userStore.getAllUsers()"
				:key="user.id"
				class="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
				<span class="text-gray-700">
					{{ user.firstName }} {{ user.lastName }}
					<span class="text-sm text-gray-500"
						>({{ userStore.getRoleText(user.role) }})</span
					>
				</span>
				<button
					v-if="user.id !== userStore.currentUser.id"
					@click="userStore.loginAs(user.id)"
					class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer">
					Zaloguj jako
				</button>
				<span
					v-else
					class="px-4 py-2 bg-green-100 text-green-800 rounded-md font-medium">
					Zalogowany
				</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/userStore';

// Store
const userStore = useUserStore();
</script>
