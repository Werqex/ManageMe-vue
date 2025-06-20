import type { Project } from '../types/Project';
import type { Story } from '../types/Story';
import type { User } from '../types/User';
import type { Task } from '../types/Task';

export class ApiService {
	// Bazowy adres API
	private baseUrl = 'http://localhost:3000/api';

	// Pobiera nagłówki autoryzacyjne z tokenem JWT
	private async getAuthHeaders() {
		const token = localStorage.getItem('auth_token');
		return {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		};
	}

	// PROJEKTY - Z API
	// Pobiera listę wszystkich projektów
	// Konwertuje format MongoDB na frontend
	async getAllProjects(): Promise<Project[]> {
		const response = await fetch(`${this.baseUrl}/projects`, {
			headers: await this.getAuthHeaders(),
		});
		if (!response.ok) throw new Error('Failed to fetch projects');
		const mongoProjects = await response.json();

		return mongoProjects.map((p: any) => ({
			id: p._id,
			name: p.name,
			description: p.description,
		}));
	}

	// Tworzy nowy projekt w systemie
	async createProject(name: string, description: string): Promise<Project> {
		const response = await fetch(`${this.baseUrl}/projects`, {
			method: 'POST',
			headers: await this.getAuthHeaders(),
			body: JSON.stringify({ name, description }),
		});
		if (!response.ok) throw new Error('Failed to create project');
		const mongoProject = await response.json();

		return {
			id: mongoProject._id,
			name: mongoProject.name,
			description: mongoProject.description,
		};
	}

	// Aktualizuje istniejący projekt
	async updateProject(
		id: string,
		name: string,
		description: string
	): Promise<void> {
		const response = await fetch(`${this.baseUrl}/projects/${id}`, {
			method: 'PUT',
			headers: await this.getAuthHeaders(),
			body: JSON.stringify({ name, description }),
		});
		if (!response.ok) throw new Error('Failed to update project');
	}

	// Usuwa projekt o podanym identyfikatorze
	async deleteProject(id: string): Promise<void> {
		const response = await fetch(`${this.baseUrl}/projects/${id}`, {
			method: 'DELETE',
			headers: await this.getAuthHeaders(),
		});
		if (!response.ok) throw new Error('Failed to delete project');
	}

	// STORIES - Z API
	// Pobiera historie przypisane do projektu
	// Konwertuje format MongoDB na frontend
	async getStoriesByProject(projectId: string): Promise<Story[]> {
		const response = await fetch(
			`${this.baseUrl}/stories/project/${projectId}`,
			{
				headers: await this.getAuthHeaders(),
			}
		);
		if (!response.ok) throw new Error('Failed to fetch stories');
		const mongoStories = await response.json();

		return mongoStories.map((s: any) => ({
			id: s._id,
			name: s.name,
			description: s.description,
			priority: s.priority,
			projectId: s.projectId,
			createdDate: s.createdDate,
			status: s.status,
			ownerId: s.ownerId,
		}));
	}

	// Tworzy nową historię w systemie
	async createStory(
		name: string,
		description: string,
		priority: 'low' | 'medium' | 'high',
		projectId: string,
		ownerId: string
	): Promise<Story> {
		const response = await fetch(`${this.baseUrl}/stories`, {
			method: 'POST',
			headers: await this.getAuthHeaders(),
			body: JSON.stringify({
				name,
				description,
				priority,
				projectId,
				ownerId,
			}),
		});
		if (!response.ok) throw new Error('Failed to create story');
		const mongoStory = await response.json();

		return {
			id: mongoStory._id,
			name: mongoStory.name,
			description: mongoStory.description,
			priority: mongoStory.priority,
			projectId: mongoStory.projectId,
			createdDate: mongoStory.createdDate,
			status: mongoStory.status,
			ownerId: mongoStory.ownerId,
		};
	}

	// Aktualizuje istniejącą historię
	// Obejmuje aktualizację statusu
	async updateStory(
		id: string,
		name: string,
		description: string,
		priority: 'low' | 'medium' | 'high',
		status: 'todo' | 'doing' | 'done'
	): Promise<void> {
		const response = await fetch(`${this.baseUrl}/stories/${id}`, {
			method: 'PUT',
			headers: await this.getAuthHeaders(),
			body: JSON.stringify({ name, description, priority, status }),
		});
		if (!response.ok) throw new Error('Failed to update story');
	}

	// Usuwa historię o podanym identyfikatorze
	async deleteStory(id: string): Promise<void> {
		const response = await fetch(`${this.baseUrl}/stories/${id}`, {
			method: 'DELETE',
			headers: await this.getAuthHeaders(),
		});
		if (!response.ok) throw new Error('Failed to delete story');
	}

	// UŻYTKOWNICY - Z API
	// Pobiera listę wszystkich użytkowników
	// Konwertuje format API na frontend
	async getAllUsers(): Promise<User[]> {
		const response = await fetch(`${this.baseUrl}/users`, {
			headers: await this.getAuthHeaders(),
		});
		if (!response.ok) throw new Error('Failed to fetch users');
		const mongoUsers = await response.json();

		return mongoUsers.map((u: any) => ({
			id: u.id,
			firstName: u.firstName,
			lastName: u.lastName,
			role: u.role,
			login: u.login,
			password: '',
		}));
	}

	// TASKS - Z API
	// Pobiera wszystkie zadania w systemie
	// Konwertuje format MongoDB na frontend
	async getAllTasks(): Promise<Task[]> {
		const response = await fetch(`${this.baseUrl}/tasks`, {
			headers: await this.getAuthHeaders(),
		});
		if (!response.ok) throw new Error('Failed to fetch tasks');
		const mongoTasks = await response.json();

		return mongoTasks.map((t: any) => ({
			id: t._id,
			name: t.name,
			description: t.description,
			priority: t.priority,
			storyId: t.storyId,
			estimatedHours: t.estimatedHours,
			status: t.status,
			createdDate: t.createdDate.toString(),
			startDate: t.startDate?.toString(),
			endDate: t.endDate?.toString(),
			assignedUserId: t.assignedUserId,
		}));
	}

	// Pobiera zadania przypisane do historii
	// Konwertuje format MongoDB na frontend
	async getTasksByStory(storyId: string): Promise<Task[]> {
		const response = await fetch(`${this.baseUrl}/tasks/story/${storyId}`, {
			headers: await this.getAuthHeaders(),
		});
		if (!response.ok) throw new Error('Failed to fetch tasks');
		const mongoTasks = await response.json();

		return mongoTasks.map((t: any) => ({
			id: t._id,
			name: t.name,
			description: t.description,
			priority: t.priority,
			storyId: t.storyId,
			estimatedHours: t.estimatedHours,
			status: t.status,
			createdDate: t.createdDate.toString(),
			startDate: t.startDate?.toString(),
			endDate: t.endDate?.toString(),
			assignedUserId: t.assignedUserId,
		}));
	}

	// Tworzy nowe zadanie w systemie
	// Automatycznie ustawia status jako "todo"
	async createTask(
		name: string,
		description: string,
		priority: 'low' | 'medium' | 'high',
		storyId: string,
		estimatedHours: number
	): Promise<Task> {
		const response = await fetch(`${this.baseUrl}/tasks`, {
			method: 'POST',
			headers: await this.getAuthHeaders(),
			body: JSON.stringify({
				name,
				description,
				priority,
				storyId,
				estimatedHours,
			}),
		});
		if (!response.ok) throw new Error('Failed to create task');
		const mongoTask = await response.json();

		return {
			id: mongoTask._id,
			name: mongoTask.name,
			description: mongoTask.description,
			priority: mongoTask.priority,
			storyId: mongoTask.storyId,
			estimatedHours: mongoTask.estimatedHours,
			status: mongoTask.status,
			createdDate: mongoTask.createdDate.toString(),
		};
	}

	// Aktualizuje istniejące zadanie
	// Nie zmienia statusu ani przypisania
	async updateTask(
		id: string,
		name: string,
		description: string,
		priority: 'low' | 'medium' | 'high',
		estimatedHours: number
	): Promise<void> {
		const response = await fetch(`${this.baseUrl}/tasks/${id}`, {
			method: 'PUT',
			headers: await this.getAuthHeaders(),
			body: JSON.stringify({ name, description, priority, estimatedHours }),
		});
		if (!response.ok) throw new Error('Failed to update task');
	}

	// Przypisuje użytkownika do zadania
	// Rozpoczyna pracę - ustawia status "doing"
	async assignUserToTask(taskId: string, userId: string): Promise<void> {
		const response = await fetch(`${this.baseUrl}/tasks/${taskId}/assign`, {
			method: 'POST',
			headers: await this.getAuthHeaders(),
			body: JSON.stringify({ userId }),
		});
		if (!response.ok) throw new Error('Failed to assign user to task');
	}

	// Oznacza zadanie jako ukończone
	// Ustawia status na "done" i zapisuje datę ukończenia
	async completeTask(taskId: string): Promise<void> {
		const response = await fetch(`${this.baseUrl}/tasks/${taskId}/complete`, {
			method: 'POST',
			headers: await this.getAuthHeaders(),
		});
		if (!response.ok) throw new Error('Failed to complete task');
	}

	// Resetuje zadanie do początkowego stanu
	// Ustawia status "todo" i usuwa daty rozpoczęcia/zakończenia
	async resetTaskToTodo(taskId: string): Promise<void> {
		const response = await fetch(`${this.baseUrl}/tasks/${taskId}/reset`, {
			method: 'POST',
			headers: await this.getAuthHeaders(),
		});
		if (!response.ok) throw new Error('Failed to reset task');
	}

	// Usuwa zadanie o podanym identyfikatorze
	async deleteTask(id: string): Promise<void> {
		const response = await fetch(`${this.baseUrl}/tasks/${id}`, {
			method: 'DELETE',
			headers: await this.getAuthHeaders(),
		});
		if (!response.ok) throw new Error('Failed to delete task');
	}

	// Pobiera szczegółowe informacje o zadaniu wraz z powiązaną historią
	// Łączy dane zadania i historii w jeden obiekt
	async getTaskDetails(
		taskId: string
	): Promise<{ task: Task; story: Story } | null> {
		try {
			const response = await fetch(`${this.baseUrl}/tasks/${taskId}/details`, {
				headers: await this.getAuthHeaders(),
			});

			if (!response.ok) return null;

			const data = await response.json();

			// Konwertuj MongoDB format na frontend format
			return {
				task: {
					id: data.task._id,
					name: data.task.name,
					description: data.task.description,
					priority: data.task.priority,
					storyId: data.task.storyId,
					estimatedHours: data.task.estimatedHours,
					status: data.task.status,
					createdDate: data.task.createdDate,
					startDate: data.task.startDate,
					endDate: data.task.endDate,
					assignedUserId: data.task.assignedUserId,
				},
				story: {
					id: data.story._id,
					name: data.story.name,
					description: data.story.description,
					priority: data.story.priority,
					projectId: data.story.projectId,
					createdDate: data.story.createdDate,
					status: data.story.status,
					ownerId: data.story.ownerId,
				},
			};
		} catch (error) {
			console.error('Error fetching task details:', error);
			return null;
		}
	}
}

// Instancja serwisu dostępna dla całej aplikacji
export const apiService = new ApiService();
