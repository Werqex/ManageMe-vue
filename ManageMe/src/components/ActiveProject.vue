<template>
	<div class="space-y-6">
		<div
			class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-colors">
			<div class="flex justify-between items-center">
				<button
					@click="handleGoBack"
					class="px-3 py-2 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white text-sm rounded-md transition-colors font-medium cursor-pointer">
					Wszystkie projekty
				</button>
				<div class="flex-1 text-center">
					<h2 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">
						{{ project.name }}
					</h2>
					<p class="text-gray-600 dark:text-gray-300 text-sm">
						{{ project.description }}
					</p>
				</div>
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
}>();

const storyStore = useStoryStore();

// Funkcje które obsługują eventy
const handleGoBack = () => {
	emit('goBack');
};

onMounted(() => {
	storyStore.fetchStoriesByProject(props.project.id);
});
</script>
