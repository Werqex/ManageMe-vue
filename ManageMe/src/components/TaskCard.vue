<template>
	<div
		class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
		<div class="flex justify-between items-start mb-2">
			<h6 class="text-sm font-semibold text-gray-800 flex-1 mr-2">
				{{ task.name }}
			</h6>
			<span
				:class="getPriorityClass(task.priority)"
				class="text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">
				{{ getPriorityText(task.priority) }}
			</span>
		</div>

		<p class="text-gray-600 text-xs mb-3 line-clamp-2">
			{{ task.description }}
		</p>

		<div class="space-y-2 mb-3">
			<div class="flex items-center text-xs text-gray-500">
				<span class="font-medium mr-1">Czas:</span>
				<span>{{ task.estimatedHours }}h</span>
			</div>

			<div
				v-if="task.assignedUserId"
				class="flex items-center text-xs text-gray-500">
				<span class="font-medium mr-1">Przypisane:</span>
				<span>{{ getAssignedUserName(task.assignedUserId) }}</span>
			</div>

			<div
				v-if="task.startDate"
				class="flex items-center text-xs text-gray-500">
				<span class="font-medium mr-1">Start:</span>
				<span>{{ formatDate(task.startDate) }}</span>
			</div>

			<div v-if="task.endDate" class="flex items-center text-xs text-gray-500">
				<span class="font-medium mr-1">Koniec:</span>
				<span>{{ formatDate(task.endDate) }}</span>
			</div>
		</div>
		<div class="space-y-2">
			<div class="flex space-x-1" v-if="task.status !== 'done'">
				<button
					v-if="task.status === 'todo'"
					@click="$emit('assign', task.id)"
					class="flex-1 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors cursor-pointer">
					Przypisz
				</button>

				<button
					v-if="task.status === 'doing'"
					@click="$emit('complete', task.id)"
					class="flex-1 px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors cursor-pointer">
					Zakończ
				</button>

				<button
					v-if="task.status !== 'todo'"
					@click="$emit('reset', task.id)"
					class="px-2 py-1 bg-gray-400 text-white text-xs rounded hover:bg-gray-500 transition-colors cursor-pointer">
					Reset
				</button>
			</div>
			<div class="flex space-x-1">
				<button
					@click="$emit('details', task.id)"
					class="flex-1 px-2 py-1 bg-indigo-500 text-white text-xs rounded hover:bg-indigo-600 transition-colors cursor-pointer">
					Szczegóły
				</button>
				<button
					@click="$emit('edit', task)"
					class="flex-1 px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 transition-colors cursor-pointer">
					Edytuj
				</button>
				<button
					@click="$emit('delete', task.id)"
					class="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors cursor-pointer">
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
	assign: [taskId: number];
	complete: [taskId: number];
	reset: [taskId: number];
	details: [taskId: number];
	edit: [task: Task];
	delete: [taskId: number];
}>();

const getPriorityText = (priority: 'low' | 'medium' | 'high') => {
	const priorities = {
		low: 'Niski',
		medium: 'Średni',
		high: 'Wysoki',
	};
	return priorities[priority];
};

const getPriorityClass = (priority: 'low' | 'medium' | 'high') => {
	const classes = {
		low: 'bg-green-100 text-green-800',
		medium: 'bg-yellow-100 text-yellow-800',
		high: 'bg-red-100 text-red-800',
	};
	return classes[priority];
};

const getAssignedUserName = (userId: number) => {
	const user = userStore.getUserById(userId);
	return user ? `${user.firstName} ${user.lastName}` : 'Nieznany';
};

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
