<template>
	<div
		class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
		<div class="flex justify-between items-center mb-4">
			<h3 class="text-2xl font-semibold text-gray-800 dark:text-gray-100">
				Wszystkie projekty
			</h3>
			<button
				@click="$emit('create')"
				class="px-4 py-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-md transition-colors font-medium cursor-pointer">
				Dodaj nowy projekt
			</button>
		</div>
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			<ProjectCard
				v-for="project in projects"
				:key="project.id"
				:project="project"
				@select="$emit('select', $event)"
				@edit="$emit('edit', $event)"
				@delete="$emit('delete', $event)" />
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Project } from '../types/Project';
import ProjectCard from './ProjectCard.vue';

defineProps<{
	projects: Project[];
}>();

defineEmits<{
	select: [project: Project];
	edit: [project: Project];
	delete: [id: string];
	create: [];
}>();
</script>
