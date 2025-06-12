import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Story } from '../types/Story';
import { apiService } from '../services/ApiService';

export const useStoryStore = defineStore('stories', () => {
	// Stan
	const stories = ref<Story[]>([]);
	const editMode = ref(false);
	const editId = ref<number | null>(null);

	const todoStories = computed(() =>
		stories.value.filter((story) => story.status === 'todo')
	);

	const doingStories = computed(() =>
		stories.value.filter((story) => story.status === 'doing')
	);

	const doneStories = computed(() =>
		stories.value.filter((story) => story.status === 'done')
	);

	// Akcje
	const fetchStoriesByProject = (projectId: number) => {
		stories.value = apiService.getStoriesByProject(projectId);
	};

	const createStory = (
		name: string,
		description: string,
		priority: 'low' | 'medium' | 'high',
		projectId: number,
		ownerId: number
	) => {
		apiService.createStory(name, description, priority, projectId, ownerId);
		fetchStoriesByProject(projectId);
	};

	const updateStory = (
		id: number,
		name: string,
		description: string,
		priority: 'low' | 'medium' | 'high',
		status: 'todo' | 'doing' | 'done',
		projectId: number
	) => {
		apiService.updateStory(id, name, description, priority, status);
		fetchStoriesByProject(projectId);
	};

	const deleteStory = (id: number, projectId: number) => {
		apiService.deleteStory(id);
		fetchStoriesByProject(projectId);
	};

	const startEdit = (story: Story) => {
		editMode.value = true;
		editId.value = story.id;
	};

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
