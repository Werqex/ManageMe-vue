<template>
	<div class="bg-white rounded-lg shadow-md p-6">
		<div class="flex justify-between items-center mb-6">
			<h3 class="text-2xl font-semibold text-gray-800">
				Zadania - {{ storyName }}
			</h3>
			<button
				@click="$emit('addTask')"
				class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors cursor-pointer">
				Dodaj zadanie
			</button>
		</div>
		<div class="grid gap-6 lg:grid-cols-3">
			<div class="bg-gray-50 rounded-lg p-4">
				<h4 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
					Do zrobienia
					<span
						class="ml-2 bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded-full">
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
			<div class="bg-blue-50 rounded-lg p-4">
				<h4 class="text-lg font-semibold text-blue-700 mb-4 flex items-center">
					W trakcie
					<span
						class="ml-2 bg-blue-200 text-blue-700 text-sm px-2 py-1 rounded-full">
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
			<div class="bg-green-50 rounded-lg p-4">
				<h4 class="text-lg font-semibold text-green-700 mb-4 flex items-center">
					Zakończone
					<span
						class="ml-2 bg-green-200 text-green-700 text-sm px-2 py-1 rounded-full">
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
	storyId: number;
	storyName: string;
}>();

const emit = defineEmits<{
	addTask: [];
	assignTask: [taskId: number];
	editTask: [task: Task];
	taskDetails: [taskId: number];
}>();

const taskStore = useTaskStore();

const handleAssignTask = (taskId: number) => {
	emit('assignTask', taskId);
};

const handleCompleteTask = (taskId: number) => {
	taskStore.completeTask(taskId);
};

const handleResetTask = (taskId: number) => {
	taskStore.resetTaskToTodo(taskId);
};

const handleTaskDetails = (taskId: number) => {
	emit('taskDetails', taskId);
};

const handleEditTask = (task: Task) => {
	emit('editTask', task);
};

const handleDeleteTask = (taskId: number) => {
	taskStore.deleteTask(taskId);
};
</script>
