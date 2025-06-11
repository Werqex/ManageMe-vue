<template>
	<div>
		<button @click="$emit('goBack')">Powrót do wszystkich projektów</button>

		<h2>Aktywny projekt: {{ project.name }}</h2>
		<p>{{ project.description }}</p>

		<button @click="$emit('edit', project)">Edytuj projekt</button>
		<button @click="$emit('delete', project.id)">Usuń projekt</button>

		<ProjectForm
			v-if="showEditForm"
			:name="project.name"
			:description="project.description"
			:is-editing="true"
			@submit="handleUpdate"
			@cancel="handleCancel" />
	</div>
</template>

<script setup lang="ts">
import type { Project } from '../types/Project';
import ProjectForm from './ProjectForm.vue';

defineProps<{
	project: Project;
	showEditForm: boolean;
}>();

const emit = defineEmits<{
	goBack: [];
	edit: [project: Project];
	delete: [id: number];
	update: [name: string, description: string];
	cancelEdit: [];
}>();

// Funckja emitująca dla rodzica aktualizację projektu
const handleUpdate = (name: string, description: string) => {
	emit('update', name, description);
};

// Funckja emitująca dla rodzica anulowanie edycji projektu
const handleCancel = () => {
	emit('cancelEdit');
};
</script>
