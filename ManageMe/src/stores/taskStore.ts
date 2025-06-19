import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Task } from '../types/Task';
import type { Story } from '../types/Story';
import { apiService } from '../services/ApiService';

export const useTaskStore = defineStore('tasks', () => {
	// Stan aplikacji - przechowuje zadania i identyfikator bieżącej historii
	const tasks = ref<Task[]>([]);
	const currentStoryId = ref<string | null>(null);

	// Obliczane właściwości - filtrowanie zadań według statusu
	const todoTasks = computed(() =>
		tasks.value.filter((task) => task.status === 'todo')
	);

	const doingTasks = computed(() =>
		tasks.value.filter((task) => task.status === 'doing')
	);

	const doneTasks = computed(() =>
		tasks.value.filter((task) => task.status === 'done')
	);

	// Podsumowanie liczby zadań w różnych statusach
	const tasksCount = computed(() => ({
		total: tasks.value.length,
		todo: todoTasks.value.length,
		doing: doingTasks.value.length,
		done: doneTasks.value.length,
	}));

	// Pobiera zadania dla określonej historii
	const fetchTasksByStory = async (storyId: string) => {
		try {
			currentStoryId.value = storyId;
			tasks.value = await apiService.getTasksByStory(storyId);
		} catch (error) {
			console.error('Failed to fetch tasks:', error);
		}
	};

	// Tworzy nowe zadanie
	const createTask = async (
		name: string,
		description: string,
		priority: 'low' | 'medium' | 'high',
		storyId: string,
		estimatedHours: number
	) => {
		try {
			await apiService.createTask(
				name,
				description,
				priority,
				storyId,
				estimatedHours
			);
			if (currentStoryId.value) {
				await fetchTasksByStory(currentStoryId.value);
			}
		} catch (error) {
			console.error('Failed to create task:', error);
		}
	};

	// Aktualizuje istniejące zadanie
	const updateTask = async (
		id: string,
		name: string,
		description: string,
		priority: 'low' | 'medium' | 'high',
		estimatedHours: number
	) => {
		try {
			await apiService.updateTask(
				id,
				name,
				description,
				priority,
				estimatedHours
			);
			if (currentStoryId.value) {
				await fetchTasksByStory(currentStoryId.value);
			}
		} catch (error) {
			console.error('Failed to update task:', error);
		}
	};

	// Usuwa zadanie o podanym identyfikatorze
	const deleteTask = async (id: string) => {
		try {
			await apiService.deleteTask(id);
			if (currentStoryId.value) {
				await fetchTasksByStory(currentStoryId.value);
			}
		} catch (error) {
			console.error('Failed to delete task:', error);
		}
	};

	// Przypisuje użytkownika do zadania
	const assignUserToTask = async (taskId: string, userId: string) => {
		try {
			await apiService.assignUserToTask(taskId, userId);
			if (currentStoryId.value) {
				await fetchTasksByStory(currentStoryId.value);
			}
		} catch (error) {
			console.error('Failed to assign user to task:', error);
		}
	};

	// Oznacza zadanie jako ukończone
	const completeTask = async (taskId: string) => {
		try {
			await apiService.completeTask(taskId);
			if (currentStoryId.value) {
				await fetchTasksByStory(currentStoryId.value);
			}
		} catch (error) {
			console.error('Failed to complete task:', error);
		}
	};

	// Resetuje zadanie do statusu "do zrobienia"
	const resetTaskToTodo = async (taskId: string) => {
		try {
			await apiService.resetTaskToTodo(taskId);
			if (currentStoryId.value) {
				await fetchTasksByStory(currentStoryId.value);
			}
		} catch (error) {
			console.error('Failed to reset task:', error);
		}
	};

	// Pobiera szczegółowe informacje o zadaniu wraz z powiązaną historią
	const getTaskDetails = async (
		taskId: string
	): Promise<{ task: Task; story: Story } | null> => {
		try {
			return await apiService.getTaskDetails(taskId);
		} catch (error) {
			console.error('Failed to get task details:', error);
			return null;
		}
	};

	return {
		tasks,
		currentStoryId,
		todoTasks,
		doingTasks,
		doneTasks,
		tasksCount,
		fetchTasksByStory,
		createTask,
		updateTask,
		deleteTask,
		assignUserToTask,
		completeTask,
		resetTaskToTodo,
		getTaskDetails,
	};
});
