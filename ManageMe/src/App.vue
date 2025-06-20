<template>
	<LoginForm
		v-if="!userStore.isAuthenticated"
		@login-success="handleLoginSuccess" />

	<div
		v-else
		class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
		<div class="container mx-auto px-4 py-8">
			<div class="flex justify-between items-center mb-8">
				<h1 class="text-4xl font-bold text-gray-800 dark:text-gray-100">
					ManageMe
				</h1>

				<div class="flex items-center space-x-4">
					<ThemeToggle />

					<button
						@click="handleLogout"
						class="px-4 py-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-md transition-colors cursor-pointer">
						Wyloguj się
					</button>
				</div>
			</div>

			<div
				class="bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 rounded-lg p-4 mb-6"
				v-if="userStore.currentUser">
				<p class="text-blue-800 dark:text-blue-200 font-medium">
					Zalogowany: {{ userStore.currentUser.firstName }}
					{{ userStore.currentUser.lastName }} ({{
						userStore.getRoleText(userStore.currentUser.role)
					}})
				</p>
			</div>

			<ActiveProject
				v-if="projectStore.activeProject"
				:project="projectStore.activeProject"
				@go-back="projectStore.goBackToAllProjects()" />
			<div v-else class="space-y-6">
				<ProjectList
					:projects="projectStore.projects"
					@select="projectStore.selectProject"
					@edit="openProjectEditModal"
					@delete="deleteProject"
					@create="openProjectCreateModal" />
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
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { useProjectStore } from './stores/projectStore';
import { useUserStore } from './stores/userStore';
import { useThemeStore } from './stores/themeStore';
import type { Project } from './types/Project';

import ActiveProject from './components/ActiveProject.vue';
import ProjectList from './components/ProjectList.vue';
import EditModal from './components/EditModal.vue';
import LoginForm from './components/LoginForm.vue';
import ThemeToggle from './components/ThemeToggle.vue';

// Stores
const projectStore = useProjectStore();
const userStore = useUserStore();
const themeStore = useThemeStore();

// Stan modala
const modalState = ref({
	show: false,
	type: 'project' as 'project' | 'story',
	data: null as any,
	isEditing: false,
});

// Referencja do funkcji usuwającej listener
let removeSystemThemeListener: (() => void) | null = null;

// Logowanie
const handleLoginSuccess = (user: any) => {
	userStore.login(user);
	projectStore.fetchProjects();
};

// Wylogowanie
const handleLogout = () => {
	userStore.logout();
	projectStore.goBackToAllProjects();
};

// Modal tworzenia projektu
const openProjectCreateModal = () => {
	modalState.value = {
		show: true,
		type: 'project',
		data: null,
		isEditing: false,
	};
};

// Modal edycji projektu
const openProjectEditModal = (project: Project) => {
	modalState.value = {
		show: true,
		type: 'project',
		data: project,
		isEditing: true,
	};
};

// Zamykanie modala
const closeModal = () => {
	modalState.value = {
		show: false,
		type: 'project',
		data: null,
		isEditing: false,
	};
};

// Wysyłanie danych z modala
const handleModalSubmit = (formData: any) => {
	if (modalState.value.type === 'project') {
		if (modalState.value.isEditing) {
			const projectId = modalState.value.data.id;
			projectStore.updateProject(
				projectId,
				formData.name,
				formData.description
			);
		} else {
			projectStore.createProject(formData.name, formData.description);
		}
	}
	closeModal();
};

// Usuwanie projektu
const deleteProject = (id: string) => {
	projectStore.deleteProject(id);
};

onMounted(async () => {
	// Inicjalizuj motyw
	themeStore.initializeTheme();
	removeSystemThemeListener = themeStore.setupSystemThemeListener();

	// Sprawdź autoryzację
	await userStore.checkAuth();
	if (userStore.isAuthenticated) {
		projectStore.fetchProjects();
	}
});

onBeforeUnmount(() => {
	if (removeSystemThemeListener) {
		removeSystemThemeListener();
	}
});
</script>
