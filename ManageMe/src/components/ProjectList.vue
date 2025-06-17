<template>
	<div
		class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
		<h3 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
			Wszystkie projekty
		</h3>
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			<ProjectCard
				v-for="project in projects"
				:key="project.id"
				:project="project"
				@select="$emit('select', $event)"
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
	delete: [id: number];
}>();
</script>
