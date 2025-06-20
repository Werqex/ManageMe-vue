<template>
	<div
		v-if="show"
		class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
		@click="handleBackdropClick">
		<div
			class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full transition-colors"
			@click.stop>
			<div
				class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-600">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
					Przypisz użytkownika do zadania
				</h3>
				<button
					@click="$emit('close')"
					class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 text-2xl font-bold cursor-pointer">
					x
				</button>
			</div>
			<div class="p-6">
				<div class="mb-4">
					<p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Zadanie:</p>
					<p class="font-semibold text-gray-900 dark:text-gray-100">
						{{ taskName }}
					</p>
				</div>

				<form @submit.prevent="handleSubmit" class="space-y-4">
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Wybierz użytkownika
						</label>
						<select
							v-model="selectedUserId"
							required
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer">
							<option value="" disabled>Wybierz użytkownika...</option>
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
							class="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-md transition-colors cursor-pointer disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed">
							Przypisz
						</button>
						<button
							type="button"
							@click="$emit('close')"
							class="px-4 py-2 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white rounded-md transition-colors cursor-pointer">
							Anuluj
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue';
import { useUserStore } from '../stores/userStore';
import { disableScroll, enableScroll } from '../utils/scrollLock';


const props = defineProps<{
	show: boolean;
	taskId: string | null;
	taskName: string;
}>();

const emit = defineEmits<{
	close: [];
	assign: [taskId: string, userId: string];
}>();

const userStore = useUserStore();
const selectedUserId = ref<string | ''>('');

// Pobiera możliwych użytkowników do przypisania
const availableUsers = userStore
	.getUsersByRole('developer')
	.concat(userStore.getUsersByRole('devops'));

// Obserwuje zmiany w show prop i zarządzanie scroll'em
watch(
	() => props.show,
	(newShow) => {
		if (newShow) {
			disableScroll();
			selectedUserId.value = '';
		} else {
			enableScroll();
		}
	}
);

// Zamyka modal po kliknięciu w tło
const handleBackdropClick = (event: Event) => {
	if (event.target === event.currentTarget) {
		emit('close');
	}
};

// Zamienia tekst roli
const getRoleText = (role: 'admin' | 'devops' | 'developer') => {
	return userStore.getRoleText(role);
};

// Obsługuje wysłanie formularza
const handleSubmit = () => {
	if (selectedUserId.value && props.taskId) {
		emit('assign', props.taskId, selectedUserId.value);
		selectedUserId.value = '';
	}
};

onBeforeUnmount(() => {
	if (props.show) {
		enableScroll();
	}
});
</script>
