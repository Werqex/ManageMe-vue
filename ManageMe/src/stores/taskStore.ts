import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Task } from '../types/Task';
import type { Story } from '../types/Story';
import { apiService } from '../services/ApiService';

export const useTaskStore = defineStore('tasks', () => {
	// Stan
	const tasks = ref<Task[]>([]);
	const currentStoryId = ref<number | null>(null);

	// Computed - filtrowanie zadań według statusu
	const todoTasks = computed(() =>
		tasks.value.filter((task) => task.status === 'todo')
	);

	const doingTasks = computed(() =>
		tasks.value.filter((task) => task.status === 'doing')
	);

	const doneTasks = computed(() =>
		tasks.value.filter((task) => task.status === 'done')
	);

	// Computed
	const tasksCount = computed(() => ({
		total: tasks.value.length,
		todo: todoTasks.value.length,
		doing: doingTasks.value.length,
		done: doneTasks.value.length,
	}));

	// Akcje - pobieranie i tworzenie zadań

	// Pobiera zadania dla konkretnej historyjki
	const fetchTasksByStory = (storyId: number) => {
		currentStoryId.value = storyId;
		tasks.value = apiService.getTasksByStory(storyId);
	};

	// Pobiera zadania dla konkretnego projektu
	const fetchTasksByProject = (projectId: number) => {
		tasks.value = apiService.getTasksByProject(projectId);
	};

	// Tworzy nowe zadanie
	const createTask = (
		name: string,
		description: string,
		priority: 'low' | 'medium' | 'high',
		storyId: number,
		estimatedHours: number
	) => {
		apiService.createTask(name, description, priority, storyId, estimatedHours);
		if (currentStoryId.value) {
			fetchTasksByStory(currentStoryId.value);
		}
	};

	// Aktualizuje podstawowe dane zadania
	const updateTask = (
		id: number,
		name: string,
		description: string,
		priority: 'low' | 'medium' | 'high',
		estimatedHours: number
	) => {
		apiService.updateTask(id, name, description, priority, estimatedHours);
		if (currentStoryId.value) {
			fetchTasksByStory(currentStoryId.value);
		}
	};

	// Usuwa zadanie
	const deleteTask = (id: number) => {
		apiService.deleteTask(id);
		if (currentStoryId.value) {
			fetchTasksByStory(currentStoryId.value);
		}
	};

	// Akcje - zarządzanie statusem i przypisaniem

	// Przypisuje użytkownika do zadania (automatycznie zmienia status na 'doing')
	const assignUserToTask = (taskId: number, userId: number) => {
		apiService.assignUserToTask(taskId, userId);
		if (currentStoryId.value) {
			fetchTasksByStory(currentStoryId.value);
		}
	};

	// Oznacza zadanie jako zakończone
	const completeTask = (taskId: number) => {
		apiService.completeTask(taskId);
		if (currentStoryId.value) {
			fetchTasksByStory(currentStoryId.value);
		}
	};

	// Resetuje zadanie do statusu 'todo'
	const resetTaskToTodo = (taskId: number) => {
		apiService.resetTaskToTodo(taskId);
		if (currentStoryId.value) {
			fetchTasksByStory(currentStoryId.value);
		}
	};

	// Pobiera szczegóły zadania z powiązaną historyjką
	const getTaskDetails = (
		taskId: number
	): { task: Task; story: Story } | null => {
		return apiService.getTaskDetails(taskId);
	};

	// Pobiera użytkowników którzy mogą być przypisani do zadań
	const getAssignableUsers = () => {
		return apiService.getAssignableUsers();
	};

	return {
		tasks,
		currentStoryId,
		todoTasks,
		doingTasks,
		doneTasks,
		tasksCount,
		fetchTasksByStory,
		fetchTasksByProject,
		createTask,
		updateTask,
		deleteTask,
		assignUserToTask,
		completeTask,
		resetTaskToTodo,
		getTaskDetails,
		getAssignableUsers,
	};
});
