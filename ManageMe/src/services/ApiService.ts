import type { Project } from '../types/Project';
import type { Story } from '../types/Story';
import type { User } from '../types/User';

/**
 * Klasa odpowiedzialna za komunikację z "API" (localStorage)
 */
export class ApiService {
	// Klucze dla localStorage
	private projectsKey = 'projects';
	private storiesKey = 'stories';
	private usersKey = 'users';

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
			createdDate: new Date().toISOString(), // ISO format daty
			status: 'todo', // Nowe historyjki zawsze mają status 'todo'
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
}

export const apiService = new ApiService();
