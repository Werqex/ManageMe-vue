import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Project } from '../types/Project';

export const useProjectStore = defineStore('projects', () => {
	// Stan projektow i UI
	const projects = ref<Project[]>([]);
	const editMode = ref(false);
	const editId = ref<number | null>(null);
	const activeProject = ref<Project | null>(null);

	// Przygotowuje naglowki autoryzacji dla zapytan API
	// Zapewnia dostep tylko dla zalogowanych uzytkownikow
	const getAuthHeaders = () => {
		const token = localStorage.getItem('auth_token');
		return {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		};
	};

	// Pobiera projekty z API
	// Konwertuje format MongoDB na strukture frontendowa
	const fetchProjects = async () => {
		try {
			const response = await fetch('http://localhost:3000/api/projects', {
				headers: getAuthHeaders(),
			});
			if (!response.ok) throw new Error('Failed to fetch projects');
			const mongoProjects = await response.json();

			// Konwersja formatu MongoDB na format frontendowy
			projects.value = mongoProjects.map((p: any) => ({
				id: p._id,
				name: p.name,
				description: p.description,
			}));
		} catch (error) {
			console.error('Failed to fetch projects:', error);
		}
	};

	// Tworzy nowy projekt w systemie
	// Odswieza liste po zakonczeniu
	const createProject = async (name: string, description: string) => {
		try {
			const response = await fetch('http://localhost:3000/api/projects', {
				method: 'POST',
				headers: getAuthHeaders(),
				body: JSON.stringify({ name, description }),
			});
			if (!response.ok) throw new Error('Failed to create project');
			await fetchProjects(); // Refresh list
		} catch (error) {
			console.error('Failed to create project:', error);
		}
	};

	// Aktualizuje istniejacy projekt
	// Odswieza liste projektow po modyfikacji
	const updateProject = async (
		id: number,
		name: string,
		description: string
	) => {
		try {
			const response = await fetch(`http://localhost:3000/api/projects/${id}`, {
				method: 'PUT',
				headers: getAuthHeaders(),
				body: JSON.stringify({ name, description }),
			});
			if (!response.ok) throw new Error('Failed to update project');
			await fetchProjects(); // Refresh list
		} catch (error) {
			console.error('Failed to update project:', error);
		}
	};

	// Usuwa projekt z systemu
	// Odswieza liste po usunieciu
	const deleteProject = async (id: number) => {
		try {
			const response = await fetch(`http://localhost:3000/api/projects/${id}`, {
				method: 'DELETE',
				headers: getAuthHeaders(),
			});
			if (!response.ok) throw new Error('Failed to delete project');
			await fetchProjects(); // Refresh list
		} catch (error) {
			console.error('Failed to delete project:', error);
		}
	};

	// Aktywuje tryb edycji dla projektu
	// Zwraca projekt do dalszej obrobki w formularzu
	const startEdit = (project: Project) => {
		editMode.value = true;
		editId.value = project.id;
		return project;
	};

	// Przerywa proces edycji
	// Resetuje flagi edycji
	const cancelEdit = () => {
		editMode.value = false;
		editId.value = null;
	};

	// Ustawia aktywny projekt do podgladu
	// Umozliwia przejscie do szczegolowego widoku
	const selectProject = (project: Project) => {
		activeProject.value = project;
	};

	// Powrot do listy wszystkich projektow
	// Czysci aktywny projekt
	const goBackToAllProjects = () => {
		activeProject.value = null;
	};

	return {
		projects,
		editMode,
		editId,
		activeProject,
		fetchProjects,
		createProject,
		updateProject,
		deleteProject,
		startEdit,
		cancelEdit,
		selectProject,
		goBackToAllProjects,
	};
});
