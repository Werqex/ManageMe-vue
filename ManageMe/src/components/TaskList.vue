<template>
	<div
		class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
		<div class="flex justify-between items-center mb-6">
			<h3 class="text-2xl font-semibold text-gray-800 dark:text-gray-100">
				Zadania - {{ props.storyName }}
			</h3>
			<button
				@click="$emit('addTask')"
				class="px-4 py-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-md transition-colors cursor-pointer">
				Dodaj zadanie
			</button>
		</div>
		<div class="grid gap-6 lg:grid-cols-3">
			<div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-colors">
				<h4
					class="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
					Do zrobienia
					<span
						class="ml-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm px-2 py-1 rounded-full">
						{{ taskStore.todoTasks.length }}
					</span>
				</h4>
				<div class="space-y-3 min-h-32">
					<TaskCard
						v-for="task in taskStore.todoTasks"
						:key="task.id"
						:task="task"
						@assign="handleAssignTask"
						@complete="handleCompleteTask"
						@reset="handleResetTask"
						@details="handleTaskDetails"
						@edit="handleEditTask"
						@delete="handleDeleteTask" />
				</div>
			</div>
			<div class="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 transition-colors">
				<h4
					class="text-lg font-semibold text-blue-700 dark:text-blue-200 mb-4 flex items-center">
					W trakcie
					<span
						class="ml-2 bg-blue-200 dark:bg-blue-700 text-blue-700 dark:text-blue-200 text-sm px-2 py-1 rounded-full">
						{{ taskStore.doingTasks.length }}
					</span>
				</h4>
				<div class="space-y-3 min-h-32">
					<TaskCard
						v-for="task in taskStore.doingTasks"
						:key="task.id"
						:task="task"
						@assign="handleAssignTask"
						@complete="handleCompleteTask"
						@reset="handleResetTask"
						@details="handleTaskDetails"
						@edit="handleEditTask"
						@delete="handleDeleteTask" />
				</div>
			</div>
			<div
				class="bg-green-50 dark:bg-green-900 rounded-lg p-4 transition-colors">
				<h4
					class="text-lg font-semibold text-green-700 dark:text-green-200 mb-4 flex items-center">
					Zakończone
					<span
						class="ml-2 bg-green-200 dark:bg-green-700 text-green-700 dark:text-green-200 text-sm px-2 py-1 rounded-full">
						{{ taskStore.doneTasks.length }}
					</span>
				</h4>
				<div class="space-y-3 min-h-32">
					<TaskCard
						v-for="task in taskStore.doneTasks"
						:key="task.id"
						:task="task"
						@assign="handleAssignTask"
						@complete="handleCompleteTask"
						@reset="handleResetTask"
						@details="handleTaskDetails"
						@edit="handleEditTask"
						@delete="handleDeleteTask" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Task } from '../types/Task';
import TaskCard from './TaskCard.vue';
import { useTaskStore } from '../stores/taskStore';

const props = defineProps<{
	storyName: string;
}>();

const emit = defineEmits<{
	addTask: [];
	assignTask: [taskId: string];
	editTask: [task: Task];
	taskDetails: [taskId: string];
}>();

const taskStore = useTaskStore();

// Przypisanie użytkownika do zadania
const handleAssignTask = (taskId: string) => {
	emit('assignTask', taskId);
};

// Zmiana statusu zadania na zakończone
const handleCompleteTask = (taskId: string) => {
	taskStore.completeTask(taskId);
};

// Resetowanie zadania do początkowego stanu
const handleResetTask = (taskId: string) => {
	taskStore.resetTaskToTodo(taskId);
};

// Obsługiwanie szczegółów zadania
const handleTaskDetails = (taskId: string) => {
	emit('taskDetails', taskId);
};

// Obsługiwanie edycji zadania
const handleEditTask = (task: Task) => {
	emit('editTask', task);
};

// Usuwanie zadania
const handleDeleteTask = (taskId: string) => {
	taskStore.deleteTask(taskId);
};
</script>
