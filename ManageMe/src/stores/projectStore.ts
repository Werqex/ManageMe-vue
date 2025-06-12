import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Project } from '../types/Project';
import { apiService } from '../services/ApiService';

export const useProjectStore = defineStore('projects', () => {
	// Stan
	const projects = ref<Project[]>([]);
	const editMode = ref(false);
	const editId = ref<number | null>(null);
	const activeProject = ref<Project | null>(null);

	// Akcje
	const fetchProjects = () => {
		projects.value = apiService.getAllProjects();
	};

	const createProject = (name: string, description: string) => {
		apiService.createProject(name, description);
		fetchProjects();
	};

	const updateProject = (id: number, name: string, description: string) => {
		apiService.updateProject(id, name, description);
		fetchProjects();
	};

	const deleteProject = (id: number) => {
		apiService.deleteProject(id);
		fetchProjects();
	};

	const startEdit = (project: Project) => {
		editMode.value = true;
		editId.value = project.id;
		return project;
	};

	const cancelEdit = () => {
		editMode.value = false;
		editId.value = null;
	};

	const selectProject = (project: Project) => {
		activeProject.value = project;
	};

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
