<template>
	<div class="bg-white rounded-lg shadow-md p-6">
		<h3 class="text-2xl font-semibold text-gray-800 mb-4">
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
