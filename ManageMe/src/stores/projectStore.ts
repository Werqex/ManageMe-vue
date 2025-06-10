import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Project } from '../types/Project';
import { projectApi } from '../services/api/ProjectApi';

export const useProjectStore = defineStore('projects', () => {
  // Stan
  const projects = ref<Project[]>([]);
  const editMode = ref(false);
  const editId = ref<number | null>(null);

  // Akcje
  const fetchProjects = () => {
    projects.value = projectApi.getAll();
  };

  const createProject = (name: string, description: string) => {
    projectApi.create(name, description);
    fetchProjects();
  };

  const updateProject = (id: number, name: string, description: string) => {
    projectApi.update(id, name, description);
    fetchProjects();
  };

  const deleteProject = (id: number) => {
    projectApi.delete(id);
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

  return {
    projects,
    editMode,
    editId,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    startEdit,
    cancelEdit
  };
});