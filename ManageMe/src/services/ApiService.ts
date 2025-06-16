import type { Project } from '../types/Project';
import type { Story } from '../types/Story';
import type { User } from '../types/User';
import type { Task } from '../types/Task';

// Klasa odpowiedzialna za komunikację z "API" (localStorage)

export class ApiService {
	// Klucze dla localStorage
	private projectsKey = 'projects';
	private storiesKey = 'stories';
	private usersKey = 'users';
	private tasksKey = 'tasks';

	// Projekty
	// Pobiera wszystkie projekty z localStorage
	getAllProjects(): Project[] {
		const data = localStorage.getItem(this.projectsKey);
		return data ? JSON.parse(data) : [];
	}

	// Tworzy nowy projekt i zapisuje w localStorage
	createProject(name: string, description: string): Project {
		const projects = this.getAllProjects();
		const newProject: Project = {
			id: Date.now(), // Proste generowanie ID na podstawie timestamp
			name,
			description,
		};
		projects.push(newProject);
		this.saveProjects(projects);
		return newProject;
	}

	// Aktualizuje istniejący projekt
	updateProject(id: number, name: string, description: string): void {
		const projects = this.getAllProjects();
		const project = projects.find((p) => p.id === id);
		if (project) {
			project.name = name;
			project.description = description;
			this.saveProjects(projects);
		}
	}

	// Usuwa projekt o podanym ID
	deleteProject(id: number): void {
		const projects = this.getAllProjects();
		const filtered = projects.filter((p) => p.id !== id);
		this.saveProjects(filtered);
	}

	// Historyjki

	// Pobiera wszystkie historyjki z localStorage
	getAllStories(): Story[] {
		const data = localStorage.getItem(this.storiesKey);
		return data ? JSON.parse(data) : [];
	}

	// Filtruje historyjki dla konkretnego projektu
	getStoriesByProject(projectId: number): Story[] {
		const allStories = this.getAllStories();
		return allStories.filter((story) => story.projectId === projectId);
	}

	// Tworzy nową historyjkę przypisaną do projektu
	createStory(
		name: string,
		description: string,
		priority: 'low' | 'medium' | 'high',
		projectId: number,
		ownerId: number
	): Story {
		const stories = this.getAllStories();
		const newStory: Story = {
			id: Date.now(),
			name,
			description,
			priority,
			projectId,
			createdDate: new Date().toISOString(),
			status: 'todo',
			ownerId,
		};
		stories.push(newStory);
		this.saveStories(stories);
		return newStory;
	}

	// Aktualizuje istniejącą historyjkę
	updateStory(
		id: number,
		name: string,
		description: string,
		priority: 'low' | 'medium' | 'high',
		status: 'todo' | 'doing' | 'done'
	): void {
		const stories = this.getAllStories();
		const story = stories.find((s) => s.id === id);
		if (story) {
			story.name = name;
			story.description = description;
			story.priority = priority;
			story.status = status;
			this.saveStories(stories);
		}
	}

	// Usuwa historyjkę o podanym ID
	deleteStory(id: number): void {
		const stories = this.getAllStories();
		const filtered = stories.filter((s) => s.id !== id);
		this.saveStories(filtered);
	}

	// Zadania (Tasks)

	// Pobiera wszystkie zadania z localStorage
	getAllTasks(): Task[] {
		const data = localStorage.getItem(this.tasksKey);
		return data ? JSON.parse(data) : [];
	}

	// Filtruje zadania dla konkretnej historyjki
	getTasksByStory(storyId: number): Task[] {
		const allTasks = this.getAllTasks();
		return allTasks.filter((task) => task.storyId === storyId);
	}

	// Filtruje zadania dla konkretnego projektu (przez historyjki)
	getTasksByProject(projectId: number): Task[] {
		const projectStories = this.getStoriesByProject(projectId);
		const storyIds = projectStories.map((story) => story.id);
		const allTasks = this.getAllTasks();
		return allTasks.filter((task) => storyIds.includes(task.storyId));
	}

	// Tworzy nowe zadanie przypisane do historyjki
	createTask(
		name: string,
		description: string,
		priority: 'low' | 'medium' | 'high',
		storyId: number,
		estimatedHours: number
	): Task {
		const tasks = this.getAllTasks();
		const newTask: Task = {
			id: Date.now(),
			name,
			description,
			priority,
			storyId,
			estimatedHours,
			status: 'todo',
			createdDate: new Date().toISOString(),
		};
		tasks.push(newTask);
		this.saveTasks(tasks);
		return newTask;
	}

	// Aktualizuje podstawowe dane zadania
	updateTask(
		id: number,
		name: string,
		description: string,
		priority: 'low' | 'medium' | 'high',
		estimatedHours: number
	): void {
		const tasks = this.getAllTasks();
		const task = tasks.find((t) => t.id === id);
		if (task) {
			task.name = name;
			task.description = description;
			task.priority = priority;
			task.estimatedHours = estimatedHours;
			this.saveTasks(tasks);
		}
	}

	// Przypisuje użytkownika do zadania i zmienia status na 'doing'
	assignUserToTask(taskId: number, userId: number): void {
		const tasks = this.getAllTasks();
		const task = tasks.find((t) => t.id === taskId);
		if (task && task.status === 'todo') {
			task.assignedUserId = userId;
			task.status = 'doing';
			task.startDate = new Date().toISOString();
			this.saveTasks(tasks);
		}
	}

	// Zmienia status zadania na 'done' i ustawia datę zakończenia
	completeTask(taskId: number): void {
		const tasks = this.getAllTasks();
		const task = tasks.find((t) => t.id === taskId);
		if (task && task.status === 'doing') {
			task.status = 'done';
			task.endDate = new Date().toISOString();
			this.saveTasks(tasks);
		}
	}

	// Zmienia status zadania z powrotem na 'todo' (resetuje przypisanie)
	resetTaskToTodo(taskId: number): void {
		const tasks = this.getAllTasks();
		const task = tasks.find((t) => t.id === taskId);
		if (task) {
			task.status = 'todo';
			task.assignedUserId = undefined;
			task.startDate = undefined;
			task.endDate = undefined;
			this.saveTasks(tasks);
		}
	}

	// Usuwa zadanie o podanym ID
	deleteTask(id: number): void {
		const tasks = this.getAllTasks();
		const filtered = tasks.filter((t) => t.id !== id);
		this.saveTasks(filtered);
	}

	// Pobiera szczegóły zadania wraz z powiązaną historyjką
	getTaskDetails(taskId: number): { task: Task; story: Story } | null {
		const task = this.getAllTasks().find((t) => t.id === taskId);
		if (!task) return null;

		const story = this.getAllStories().find((s) => s.id === task.storyId);
		if (!story) return null;

		return { task, story };
	}

	// Użytkownicy

	// Pobiera wszystkich użytkowników z localStorage
	getAllUsers(): User[] {
		const data = localStorage.getItem(this.usersKey);
		return data ? JSON.parse(data) : [];
	}

	// Filtruje użytkowników po roli
	getUsersByRole(role: 'admin' | 'devops' | 'developer'): User[] {
		const allUsers = this.getAllUsers();
		return allUsers.filter((user) => user.role === role);
	}

	// Pobiera użytkowników którzy mogą wykonywać zadania (devops i developer)
	getAssignableUsers(): User[] {
		const allUsers = this.getAllUsers();
		return allUsers.filter(
			(user) => user.role === 'devops' || user.role === 'developer'
		);
	}

	// Znajduje użytkownika po ID
	getUserById(id: number): User | undefined {
		const allUsers = this.getAllUsers();
		return allUsers.find((user) => user.id === id);
	}

	// Zapisuje listę użytkowników do localStorage
	saveUsers(users: User[]): void {
		localStorage.setItem(this.usersKey, JSON.stringify(users));
	}

	// Zapisuje projekty do localStorage
	private saveProjects(projects: Project[]): void {
		localStorage.setItem(this.projectsKey, JSON.stringify(projects));
	}

	// Zapisuje historyjki do localStorage
	private saveStories(stories: Story[]): void {
		localStorage.setItem(this.storiesKey, JSON.stringify(stories));
	}

	// Zapisuje zadania do localStorage
	private saveTasks(tasks: Task[]): void {
		localStorage.setItem(this.tasksKey, JSON.stringify(tasks));
	}
}

export const apiService = new ApiService();
