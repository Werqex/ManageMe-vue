<template>
	<div
		v-if="show"
		class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
		@click="handleBackdropClick">
		<div class="bg-white rounded-lg shadow-xl max-w-md w-full" @click.stop>
			<div
				class="flex justify-between items-center p-6 border-b border-gray-200">
				<h3 class="text-lg font-semibold text-gray-900">
					Przypisz użytkownika do zadania
				</h3>
				<button
					@click="$emit('close')"
					class="text-gray-400 hover:text-gray-600 text-2xl font-bold cursor-pointer">
					x
				</button>
			</div>
			<div class="p-6">
				<div class="mb-4">
					<p class="text-sm text-gray-600 mb-2">Zadanie:</p>
					<p class="font-semibold text-gray-900">{{ taskName }}</p>
				</div>

				<form @submit.prevent="handleSubmit" class="space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">
							Wybierz użytkownika
						</label>
						<select
							v-model="selectedUserId"
							required
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer">
							<option value="">Wybierz użytkownika...</option>
							<option
								v-for="user in availableUsers"
								:key="user.id"
								:value="user.id">
								{{ user.firstName }} {{ user.lastName }} ({{
									getRoleText(user.role)
								}})
							</option>
						</select>
					</div>
					<div class="flex space-x-3 pt-4">
						<button
							type="submit"
							:disabled="!selectedUserId"
							class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed">
							Przypisz
						</button>
						<button
							type="button"
							@click="$emit('close')"
							class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors cursor-pointer">
							Anuluj
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { User } from '../types/User';
import { useUserStore } from '../stores/userStore';

const props = defineProps<{
	show: boolean;
	taskId: number | null;
	taskName: string;
}>();

const emit = defineEmits<{
	close: [];
	assign: [taskId: number, userId: number];
}>();

const userStore = useUserStore();
const selectedUserId = ref<number | null>(null);

// Pobieramy użytkowników którzy mogą być przypisani (developer i devops)
const availableUsers = userStore
	.getUsersByRole('developer')
	.concat(userStore.getUsersByRole('devops'));

const handleBackdropClick = (event: Event) => {
	if (event.target === event.currentTarget) {
		emit('close');
	}
};

const getRoleText = (role: 'admin' | 'devops' | 'developer') => {
	return userStore.getRoleText(role);
};

const handleSubmit = () => {
	if (selectedUserId.value && props.taskId) {
		emit('assign', props.taskId, selectedUserId.value);
		selectedUserId.value = null;
	}
};
</script>
