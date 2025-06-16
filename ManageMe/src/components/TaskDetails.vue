<template>
	<div
		v-if="show"
		class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
		@click="handleBackdropClick">
		<div
			class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
			@click.stop>
			<div
				class="flex justify-between items-center p-6 border-b border-gray-200">
				<h3 class="text-xl font-semibold text-gray-900">Szczegóły zadania</h3>
				<button
					@click="$emit('close')"
					class="text-gray-400 hover:text-gray-600 text-2xl font-bold cursor-pointer">
					x
				</button>
			</div>
			<div class="p-6 space-y-6" v-if="taskDetails">
				<div class="bg-gray-50 rounded-lg p-4">
					<h4 class="text-lg font-semibold text-gray-800 mb-3">
						Informacje o zadaniu
					</h4>

					<div class="grid gap-4 md:grid-cols-2">
						<div>
							<label class="text-sm font-medium text-gray-600">Nazwa</label>
							<p class="text-gray-900 font-semibold">
								{{ taskDetails.task.name }}
							</p>
						</div>

						<div>
							<label class="text-sm font-medium text-gray-600">Priorytet</label>
							<span
								:class="getPriorityClass(taskDetails.task.priority)"
								class="inline-block px-2 py-1 rounded-full text-xs font-medium">
								{{ getPriorityText(taskDetails.task.priority) }}
							</span>
						</div>
						<div class="md:col-span-2">
							<label class="text-sm font-medium text-gray-600">Opis</label>
							<p class="text-gray-900">
								{{ taskDetails.task.description || 'Brak opisu' }}
							</p>
						</div>
						<div>
							<label class="text-sm font-medium text-gray-600"
								>Przewidywany czas</label
							>
							<p class="text-gray-900">
								{{ taskDetails.task.estimatedHours }} godzin
							</p>
						</div>

						<div>
							<label class="text-sm font-medium text-gray-600">Status</label>
							<span
								:class="getStatusClass(taskDetails.task.status)"
								class="inline-block px-2 py-1 rounded-full text-xs font-medium">
								{{ getStatusText(taskDetails.task.status) }}
							</span>
						</div>
					</div>
				</div>
				<div class="bg-blue-50 rounded-lg p-4">
					<h4 class="text-lg font-semibold text-blue-800 mb-3">
						Powiązana historyjka
					</h4>

					<div class="space-y-2">
						<div>
							<label class="text-sm font-medium text-blue-600"
								>Nazwa historyjki</label
							>
							<p class="text-blue-900 font-semibold">
								{{ taskDetails.story.name }}
							</p>
						</div>

						<div>
							<label class="text-sm font-medium text-blue-600"
								>Opis historyjki</label
							>
							<p class="text-blue-900">
								{{ taskDetails.story.description || 'Brak opisu' }}
							</p>
						</div>
					</div>
				</div>
				<div class="bg-green-50 rounded-lg p-4">
					<h4 class="text-lg font-semibold text-green-800 mb-3">
						Daty i przypisanie
					</h4>

					<div class="grid gap-4 md:grid-cols-2">
						<div>
							<label class="text-sm font-medium text-green-600"
								>Data utworzenia</label
							>
							<p class="text-green-900">
								{{ formatDateTime(taskDetails.task.createdDate) }}
							</p>
						</div>

						<div v-if="taskDetails.task.assignedUserId">
							<label class="text-sm font-medium text-green-600"
								>Przypisane do</label
							>
							<p class="text-green-900 font-semibold">
								{{ getAssignedUserName(taskDetails.task.assignedUserId) }}
							</p>
						</div>

						<div v-if="taskDetails.task.startDate">
							<label class="text-sm font-medium text-green-600"
								>Data rozpoczęcia</label
							>
							<p class="text-green-900">
								{{ formatDateTime(taskDetails.task.startDate) }}
							</p>
						</div>

						<div v-if="taskDetails.task.endDate">
							<label class="text-sm font-medium text-green-600"
								>Data zakończenia</label
							>
							<p class="text-green-900">
								{{ formatDateTime(taskDetails.task.endDate) }}
							</p>
						</div>
					</div>
				</div>
				<div class="flex space-x-3">
					<button
						v-if="taskDetails.task.status === 'todo'"
						@click="$emit('assign', taskDetails.task.id)"
						class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer">
						Przypisz użytkownika
					</button>

					<button
						v-if="taskDetails.task.status === 'doing'"
						@click="$emit('complete', taskDetails.task.id)"
						class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors cursor-pointer">
						Oznacz jako zakończone
					</button>

					<button
						v-if="taskDetails.task.status !== 'todo'"
						@click="$emit('reset', taskDetails.task.id)"
						class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors cursor-pointer">
						Resetuj do TODO
					</button>

					<button
						@click="$emit('edit', taskDetails.task)"
						class="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors cursor-pointer">
						Edytuj zadanie
					</button>
				</div>
			</div>

			<div v-else class="p-6">
				<p class="text-gray-500">Nie można załadować szczegółów zadania.</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Task } from '../types/Task';
import type { Story } from '../types/Story';
import { useUserStore } from '../stores/userStore';

const props = defineProps<{
	show: boolean;
	taskDetails: { task: Task; story: Story } | null;
}>();

const emit = defineEmits<{
	close: [];
	assign: [taskId: number];
	complete: [taskId: number];
	reset: [taskId: number];
	edit: [task: Task];
}>();

const userStore = useUserStore();

const handleBackdropClick = (event: Event) => {
	if (event.target === event.currentTarget) {
		emit('close');
	}
};

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

const getStatusText = (status: 'todo' | 'doing' | 'done') => {
	const statuses = {
		todo: 'Do zrobienia',
		doing: 'W trakcie',
		done: 'Zakończone',
	};
	return statuses[status];
};

const getStatusClass = (status: 'todo' | 'doing' | 'done') => {
	const classes = {
		todo: 'bg-gray-100 text-gray-800',
		doing: 'bg-blue-100 text-blue-800',
		done: 'bg-green-100 text-green-800',
	};
	return classes[status];
};

const getAssignedUserName = (userId: number) => {
	const user = userStore.getUserById(userId);
	return user ? `${user.firstName} ${user.lastName}` : 'Nieznany użytkownik';
};

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
</script>
