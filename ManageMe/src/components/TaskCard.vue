<template>
	<div
		class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md dark:hover:shadow-lg transition-all">
		<div class="flex justify-between items-start mb-2">
			<h6
				class="text-sm font-semibold text-gray-800 dark:text-gray-100 flex-1 mr-2">
				{{ task.name }}
			</h6>
			<span
				:class="getPriorityClass(task.priority)"
				class="text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">
				{{ getPriorityText(task.priority) }}
			</span>
		</div>

		<p class="text-gray-600 dark:text-gray-300 text-xs mb-3 line-clamp-2">
			{{ task.description }}
		</p>

		<div class="space-y-2 mb-3">
			<div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
				<span class="font-medium mr-1">Czas:</span>
				<span>{{ task.estimatedHours }}h</span>
			</div>

			<div
				v-if="task.assignedUserId"
				class="flex items-center text-xs text-gray-500 dark:text-gray-400">
				<span class="font-medium mr-1">Przypisane:</span>
				<span>{{ getAssignedUserName(task.assignedUserId) }}</span>
			</div>

			<div
				v-if="task.startDate"
				class="flex items-center text-xs text-gray-500 dark:text-gray-400">
				<span class="font-medium mr-1">Start:</span>
				<span>{{ formatDate(task.startDate) }}</span>
			</div>

			<div
				v-if="task.endDate"
				class="flex items-center text-xs text-gray-500 dark:text-gray-400">
				<span class="font-medium mr-1">Koniec:</span>
				<span>{{ formatDate(task.endDate) }}</span>
			</div>
		</div>
		<div class="space-y-2">
			<div class="flex space-x-1" v-if="task.status !== 'done'">
				<button
					v-if="task.status === 'todo'"
					@click="$emit('assign', task.id)"
					class="flex-1 px-2 py-1 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xs rounded transition-colors cursor-pointer">
					Przypisz
				</button>

				<button
					v-if="task.status === 'doing'"
					@click="$emit('complete', task.id)"
					class="flex-1 px-2 py-1 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white text-xs rounded transition-colors cursor-pointer">
					Zakończ
				</button>

				<button
					v-if="task.status !== 'todo'"
					@click="$emit('reset', task.id)"
					class="px-2 py-1 bg-gray-400 hover:bg-gray-500 dark:bg-gray-500 dark:hover:bg-gray-600 text-white text-xs rounded transition-colors cursor-pointer">
					Reset
				</button>
			</div>
			<div class="flex space-x-1">
				<button
					@click="$emit('details', task.id)"
					class="flex-1 px-2 py-1 bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white text-xs rounded transition-colors cursor-pointer">
					Szczegóły
				</button>
				<button
					@click="$emit('edit', task)"
					class="flex-1 px-2 py-1 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white text-xs rounded transition-colors cursor-pointer">
					Edytuj
				</button>
				<button
					@click="$emit('delete', task.id)"
					class="px-2 py-1 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white text-xs rounded transition-colors cursor-pointer">
					Usuń
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Task } from '../types/Task';
import { useUserStore } from '../stores/userStore';

const userStore = useUserStore();

defineProps<{
	task: Task;
}>();

defineEmits<{
	assign: [id: string];
	complete: [id: string];
	reset: [id: string];
	details: [id: string];
	edit: [task: Task];
	delete: [id: string];
}>();

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

// Pobieranie nazwy przypisanego użytkownika
const getAssignedUserName = (userId: string) => {
	const user = userStore.getUserById(userId);
	return user ? `${user.firstName} ${user.lastName}` : 'Nieznany';
};

// Formatowanie daty na polski
const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString('pl-PL', {
		day: '2-digit',
		month: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	});
};
</script>
