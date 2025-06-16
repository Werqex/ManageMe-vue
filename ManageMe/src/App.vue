<template>
	<div class="min-h-screen bg-gray-50">
		<div class="container mx-auto px-4 py-8">
			<h1 class="text-4xl font-bold text-center text-gray-800 mb-8">
				ManageMe
			</h1>
			<div class="bg-blue-100 border border-blue-300 rounded-lg p-4 mb-6">
				<p class="text-blue-800 font-medium">
					Zalogowany: {{ userStore.currentUser.firstName }}
					{{ userStore.currentUser.lastName }}
					({{ userStore.getRoleText(userStore.currentUser.role) }})
				</p>
			</div>

			<UserList />
			<ActiveProject
				v-if="projectStore.activeProject"
				:project="projectStore.activeProject"
				@go-back="projectStore.goBackToAllProjects()"
				@edit="openProjectEditModal"
				@delete="deleteActiveProject" />
			<div v-else class="space-y-6">
				<div class="bg-white rounded-lg shadow-md p-6">
					<button
						@click="openProjectCreateModal"
						class="w-full px-4 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors font-medium text-lg cursor-pointer">
						Dodaj nowy projekt
					</button>
				</div>
				<ProjectList
					:projects="projectStore.projects"
					@select="projectStore.selectProject"
					@delete="projectStore.deleteProject" />
			</div>
		</div>
		<EditModal
			:show="modalState.show"
			:type="modalState.type"
			:data="modalState.data"
			:is-editing="modalState.isEditing"
			@close="closeModal"
			@submit="handleModalSubmit" />
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useProjectStore } from './stores/projectStore';
import { useUserStore } from './stores/userStore';
import type { Project } from './types/Project';

import ActiveProject from './components/ActiveProject.vue';
import ProjectList from './components/ProjectList.vue';
import EditModal from './components/EditModal.vue';
import UserList from './components/UserList.vue';

// Stores
const projectStore = useProjectStore();
const userStore = useUserStore();

// Stan modala - jeden stan dla wszystkich typów edycji
const modalState = ref({
	show: false,
	type: 'project' as 'project' | 'story',
	data: null as any,
	isEditing: false,
});

// Funkcje dla projektu
const openProjectCreateModal = () => {
	modalState.value = {
		show: true,
		type: 'project',
		data: null,
		isEditing: false,
	};
};

const openProjectEditModal = (project: Project) => {
	modalState.value = {
		show: true,
		type: 'project',
		data: project,
		isEditing: true,
	};
};

// Funkcja zamykająca modal
const closeModal = () => {
	modalState.value = {
		show: false,
		type: 'project',
		data: null,
		isEditing: false,
	};
};

// Funkcja obsługująca wysłanie danych z modala
const handleModalSubmit = (formData: any) => {
	if (modalState.value.type === 'project') {
		// Obsługa projektu
		if (modalState.value.isEditing) {
			// Edycja istniejącego projektu
			const projectId = modalState.value.data.id;
			projectStore.updateProject(
				projectId,
				formData.name,
				formData.description
			);
		} else {
			// Dodawanie nowego projektu
			projectStore.createProject(formData.name, formData.description);
		}
	}
	// W przyszłości tutaj będziemy obsługiwać historyjki

	closeModal();
};

const deleteActiveProject = (id: number) => {
	projectStore.deleteProject(id);
	projectStore.goBackToAllProjects();
};

onMounted(() => {
	projectStore.fetchProjects();
});
</script>
