<template>
	<div>
		<h1>ManageMe</h1>

		<!-- Zalogowany użytkownik -->
		<div>
			Zalogowany: {{ userStore.currentUser.firstName }}
			{{ userStore.currentUser.lastName }}
			({{ userStore.getRoleText(userStore.currentUser.role) }})
		</div>

		<UserList />

		<!-- Widok gdy wybrany jest aktywny projekt -->
		<ActiveProject
			v-if="projectStore.activeProject"
			:project="projectStore.activeProject"
			:show-edit-form="projectStore.editMode"
			@go-back="projectStore.goBackToAllProjects()"
			@edit="startEdit"
			@delete="deleteActiveProject"
			@update="updateProject"
			@cancel-edit="cancelEdit" />

		<!-- Widok wszystkich projektów -->
		<div v-else>
			<!-- Formularz dodawania nowego projektu -->
			<ProjectForm @submit="createProject" />

			<!-- Lista wszystkich projektów -->
			<ProjectList
				:projects="projectStore.projects"
				@select="projectStore.selectProject"
				@delete="projectStore.deleteProject" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useProjectStore } from './stores/projectStore';
import { useUserStore } from './stores/userStore';
import type { Project } from './types/Project';

import ActiveProject from './components/ActiveProject.vue';
import ProjectForm from './components/ProjectForm.vue';
import ProjectList from './components/ProjectList.vue';
import UserList from './components/UserList.vue';

// Stores
const projectStore = useProjectStore();
const userStore = useUserStore();

// Funkcje
const createProject = (name: string, description: string) => {
	projectStore.createProject(name, description);
};

const updateProject = (name: string, description: string) => {
	if (projectStore.editId) {
		projectStore.updateProject(projectStore.editId, name, description);
		projectStore.cancelEdit();
	}
};

const startEdit = (project: Project) => {
	projectStore.startEdit(project);
};

const cancelEdit = () => {
	projectStore.cancelEdit();
};

const deleteActiveProject = (id: number) => {
	projectStore.deleteProject(id);
	projectStore.goBackToAllProjects();
};

onMounted(() => {
	projectStore.fetchProjects();
});
</script>
