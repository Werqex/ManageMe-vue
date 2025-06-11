<template>
	<div>
		<h3>Wszystkie projekty:</h3>
		<ProjectCard
			v-for="project in projects"
			:key="project.id"
			:project="project"
			@select="$emit('select', $event)"
			@delete="$emit('delete', $event)" />
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
