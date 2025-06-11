<template>
	<div class="project-card">
		<h4>{{ project.name }}</h4>
		<p>{{ project.description }}</p>
		<button @click="$emit('select', project)">Wybierz projekt</button>
		<button @click="$emit('delete', project.id)">Usuń</button>
	</div>
</template>

<script setup lang="ts">
import type { Project } from '../types/Project';

defineProps<{
	project: Project;
}>();

defineEmits<{
	select: [project: Project];
	delete: [id: number];
}>();
</script>
