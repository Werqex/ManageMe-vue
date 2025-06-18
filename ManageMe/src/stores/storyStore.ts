import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Story } from '../types/Story';
import { apiService } from '../services/ApiService';

export const useStoryStore = defineStore('stories', () => {
	// Stan historii i UI
	const stories = ref<Story[]>([]);
	const editMode = ref(false);
	const editId = ref<number | null>(null);

	// Filtrowane historie wedlug statusu
	// Umozliwia latwe grupowanie dla widoku kanban
	const todoStories = computed(() =>
		stories.value.filter((story) => story.status === 'todo')
	);

	const doingStories = computed(() =>
		stories.value.filter((story) => story.status === 'doing')
	);

	const doneStories = computed(() =>
		stories.value.filter((story) => story.status === 'done')
	);

	// Pobiera historie dla wybranego projektu
	// Aktualizuje stan lokalny na podstawie danych z API
	const fetchStoriesByProject = async (projectId: number) => {
		try {
			stories.value = await apiService.getStoriesByProject(projectId);
		} catch (error) {
			console.error('Failed to fetch stories:', error);
		}
	};

	// Tworzy nowa historie w projekcie
	// Odswieza liste po zakonczeniu
	const createStory = async (
		name: string,
		description: string,
		priority: 'low' | 'medium' | 'high',
		projectId: number,
		ownerId: number
	) => {
		try {
			await apiService.createStory(
				name,
				description,
				priority,
				projectId,
				ownerId
			);
			await fetchStoriesByProject(projectId);
		} catch (error) {
			console.error('Failed to create story:', error);
		}
	};

	// Aktualizuje istniejaca historie
	// Odswieza liste historii po modyfikacji
	const updateStory = async (
		id: number,
		name: string,
		description: string,
		priority: 'low' | 'medium' | 'high',
		status: 'todo' | 'doing' | 'done',
		projectId: number
	) => {
		try {
			await apiService.updateStory(id, name, description, priority, status);
			await fetchStoriesByProject(projectId);
		} catch (error) {
			console.error('Failed to update story:', error);
		}
	};

	// Usuwa historie z systemu
	// Odswieza liste po usunieciu
	const deleteStory = async (id: number, projectId: number) => {
		try {
			await apiService.deleteStory(id);
			await fetchStoriesByProject(projectId);
		} catch (error) {
			console.error('Failed to delete story:', error);
		}
	};

	// Aktywuje tryb edycji dla historii
	// Zapisuje ID edytowanej historii
	const startEdit = (story: Story) => {
		editMode.value = true;
		editId.value = story.id;
	};

	// Przerywa proces edycji
	// Resetuje flagi edycji
	const cancelEdit = () => {
		editMode.value = false;
		editId.value = null;
	};

	return {
		stories,
		editMode,
		editId,
		todoStories,
		doingStories,
		doneStories,
		fetchStoriesByProject,
		createStory,
		updateStory,
		deleteStory,
		startEdit,
		cancelEdit,
	};
});
