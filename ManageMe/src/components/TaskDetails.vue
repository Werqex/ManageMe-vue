<template>
	<div
		v-if="show"
		class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
		@click="handleBackdropClick">
		<div
			class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors"
			@click.stop>
			<div
				class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-600">
				<h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
					Szczegóły zadania
				</h3>
				<button
					@click="$emit('close')"
					class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 text-2xl font-bold cursor-pointer">
					x
				</button>
			</div>
			<div v-if="loading" class="p-6">
				<div class="flex items-center justify-center py-8">
					<div
						class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
					<span class="ml-2 text-gray-600 dark:text-gray-400"
						>Ładowanie...</span
					>
				</div>
			</div>
			<div v-else-if="taskDetails" class="p-6 space-y-6">
				<div
					class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-colors">
					<h4
						class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
						Informacje o zadaniu
					</h4>

					<div class="grid gap-4 md:grid-cols-2">
						<div>
							<label
								class="text-sm font-medium text-gray-600 dark:text-gray-300"
								>Nazwa</label
							>
							<p class="text-gray-900 dark:text-gray-100 font-semibold">
								{{ taskDetails.task.name }}
							</p>
						</div>

						<div>
							<label
								class="text-sm font-medium text-gray-600 dark:text-gray-300"
								>Priorytet</label
							>
							<span
								:class="getPriorityClass(taskDetails.task.priority)"
								class="inline-block px-2 py-1 rounded-full text-xs font-medium">
								{{ getPriorityText(taskDetails.task.priority) }}
							</span>
						</div>
						<div class="md:col-span-2">
							<label
								class="text-sm font-medium text-gray-600 dark:text-gray-300"
								>Opis</label
							>
							<p class="text-gray-900 dark:text-gray-100">
								{{ taskDetails.task.description || 'Brak opisu' }}
							</p>
						</div>
						<div>
							<label
								class="text-sm font-medium text-gray-600 dark:text-gray-300"
								>Przewidywany czas</label
							>
							<p class="text-gray-900 dark:text-gray-100">
								{{ taskDetails.task.estimatedHours }} godzin
							</p>
						</div>

						<div>
							<label
								class="text-sm font-medium text-gray-600 dark:text-gray-300"
								>Status</label
							>
							<span
								:class="getStatusClass(taskDetails.task.status)"
								class="inline-block px-2 py-1 rounded-full text-xs font-medium">
								{{ getStatusText(taskDetails.task.status) }}
							</span>
						</div>
					</div>
				</div>
				<div
					class="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 transition-colors">
					<h4
						class="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
						Powiązana historyjka
					</h4>

					<div class="space-y-2">
						<div>
							<label
								class="text-sm font-medium text-blue-600 dark:text-blue-300"
								>Nazwa historyjki</label
							>
							<p class="text-blue-900 dark:text-blue-100 font-semibold">
								{{ taskDetails.story.name }}
							</p>
						</div>

						<div>
							<label
								class="text-sm font-medium text-blue-600 dark:text-blue-300"
								>Opis historyjki</label
							>
							<p class="text-blue-900 dark:text-blue-100">
								{{ taskDetails.story.description || 'Brak opisu' }}
							</p>
						</div>
					</div>
				</div>
				<div
					class="bg-green-50 dark:bg-green-900 rounded-lg p-4 transition-colors">
					<h4
						class="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
						Daty i przypisanie
					</h4>

					<div class="grid gap-4 md:grid-cols-2">
						<div>
							<label
								class="text-sm font-medium text-green-600 dark:text-green-300"
								>Data utworzenia</label
							>
							<p class="text-green-900 dark:text-green-100">
								{{ formatDateTime(taskDetails.task.createdDate) }}
							</p>
						</div>

						<div v-if="taskDetails.task.assignedUserId">
							<label
								class="text-sm font-medium text-green-600 dark:text-green-300"
								>Przypisane do</label
							>
							<p class="text-green-900 dark:text-green-100 font-semibold">
								{{ getAssignedUserName(taskDetails.task.assignedUserId) }}
							</p>
						</div>

						<div v-if="taskDetails.task.startDate">
							<label
								class="text-sm font-medium text-green-600 dark:text-green-300"
								>Data rozpoczęcia</label
							>
							<p class="text-green-900 dark:text-green-100">
								{{ formatDateTime(taskDetails.task.startDate) }}
							</p>
						</div>

						<div v-if="taskDetails.task.endDate">
							<label
								class="text-sm font-medium text-green-600 dark:text-green-300"
								>Data zakończenia</label
							>
							<p class="text-green-900 dark:text-green-100">
								{{ formatDateTime(taskDetails.task.endDate) }}
							</p>
						</div>
					</div>
				</div>
				<div class="flex space-x-3">
					<button
						v-if="taskDetails.task.status === 'todo'"
						@click="$emit('assign', taskDetails.task.id)"
						class="px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-md transition-colors cursor-pointer">
						Przypisz użytkownika
					</button>

					<button
						v-if="taskDetails.task.status === 'doing'"
						@click="$emit('complete', taskDetails.task.id)"
						class="px-4 py-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-md transition-colors cursor-pointer">
						Oznacz jako zakończone
					</button>

					<button
						v-if="taskDetails.task.status !== 'todo'"
						@click="$emit('reset', taskDetails.task.id)"
						class="px-4 py-2 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white rounded-md transition-colors cursor-pointer">
						Resetuj do TODO
					</button>

					<button
						@click="$emit('edit', taskDetails.task)"
						class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white rounded-md transition-colors cursor-pointer">
						Edytuj zadanie
					</button>
				</div>
			</div>
			<div v-else class="p-6">
				<p class="text-gray-500 dark:text-gray-400 text-center py-8">
					Nie można załadować szczegółów zadania.
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue';
import type { Task } from '../types/Task';
import type { Story } from '../types/Story';
import { useUserStore } from '../stores/userStore';
import { disableScroll, enableScroll } from '../utils/scrollLock';

const props = defineProps<{
	show: boolean;
	taskDetails: { task: Task; story: Story } | null;
	loading?: boolean;
}>();

const emit = defineEmits<{
	close: [];
	assign: [taskId: string];
	complete: [taskId: string];
	reset: [taskId: string];
	edit: [task: Task];
}>();

const userStore = useUserStore();

// Zarządzanie blokowania scrolla
watch(
	() => props.show,
	(newShow) => {
		if (newShow) {
			disableScroll();
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

// Zwracanie tesktu priorytetu w języku polskim
const getPriorityText = (priority: 'low' | 'medium' | 'high') => {
	const priorities = {
		low: 'Niski',
		medium: 'Średni',
		high: 'Wysoki',
	};
	return priorities[priority];
};

// Dodawanie koloru do każdego priorytetu
const getPriorityClass = (priority: 'low' | 'medium' | 'high') => {
	const classes = {
		low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
		medium:
			'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
		high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
	};
	return classes[priority];
};

// Zwracanie tesktu statusu w języku polskim
const getStatusText = (status: 'todo' | 'doing' | 'done') => {
	const statuses = {
		todo: 'Do zrobienia',
		doing: 'W trakcie',
		done: 'Zakończone',
	};
	return statuses[status];
};

// Dodawanie koloru do każdego statusu
const getStatusClass = (status: 'todo' | 'doing' | 'done') => {
	const classes = {
		todo: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
		doing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
		done: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
	};
	return classes[status];
};

// Pobieranie nazwy przypisanego użytkownika
const getAssignedUserName = (userId: string | number | undefined) => {
	if (!userId) return 'Nieprzypisane';

	const user = userStore.getUserById(userId);

	return user
		? `${user.firstName} ${user.lastName}`
		: `Nieznany użytkownik (ID: ${userId})`;
};

// Formatowanie daty na polski
const formatDateTime = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString('pl-PL', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
};

onBeforeUnmount(() => {
	if (props.show) {
		enableScroll();
	}
});
</script>
