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

		<StoryList :project-id="project.id" />
	</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import type { Project } from '../types/Project';
import ProjectForm from './ProjectForm.vue';
import StoryList from './StoryList.vue';
import { useStoryStore } from '../stores/storyStore';

const props = defineProps<{
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

const storyStore = useStoryStore();

// Funkcje
const handleUpdate = (name: string, description: string) => {
	emit('update', name, description);
};

const handleCancel = () => {
	emit('cancelEdit');
};

// Załaduj historyjki gdy komponent się montuje
onMounted(() => {
	storyStore.fetchStoriesByProject(props.project.id);
});
</script>
