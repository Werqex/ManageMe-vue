<template>
	<div class="space-y-6">
		<button
			@click="handleGoBack"
			class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors font-medium cursor-pointer">
			Powrót do wszystkich projektów
		</button>

		<div class="bg-white rounded-lg shadow-md p-6">
			<h2 class="text-3xl font-bold text-gray-800 mb-2">
				Aktywny projekt: {{ project.name }}
			</h2>
			<p class="text-gray-600 mb-4">{{ project.description }}</p>

			<div class="flex space-x-3 mb-6">
				<button
					@click="handleEdit"
					class="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors font-medium cursor-pointer">
					Edytuj projekt
				</button>
				<button
					@click="handleDelete"
					class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors font-medium cursor-pointer">
					Usuń projekt
				</button>
			</div>
		</div>

		<StoryList :project-id="project.id" />
	</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import type { Project } from '../types/Project';
import StoryList from './StoryList.vue';
import { useStoryStore } from '../stores/storyStore';

const props = defineProps<{
	project: Project;
}>();

const emit = defineEmits<{
	goBack: [];
	edit: [project: Project];
	delete: [id: number];
}>();

const storyStore = useStoryStore();

// Funkcje które obsługują eventy
const handleGoBack = () => {
	emit('goBack');
};

const handleEdit = () => {
	emit('edit', props.project);
};

const handleDelete = () => {
	emit('delete', props.project.id);
};

onMounted(() => {
	storyStore.fetchStoriesByProject(props.project.id);
});
</script>
