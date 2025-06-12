<template>
	<div class="story-list">
		<h3>Historyjki projektu</h3>

		<!-- Formularz dodawania nowej historyjki -->
		<StoryForm @submit="handleCreate" />

		<!-- Formularz edycji -->
		<StoryForm
			v-if="storyStore.editMode && editingStory"
			:name="editingStory.name"
			:description="editingStory.description"
			:priority="editingStory.priority"
			:status="editingStory.status"
			:is-editing="true"
			@submit="handleUpdate"
			@cancel="storyStore.cancelEdit" />

		<!-- Sekcje z historyjkami wg statusu -->
		<div class="status-section">
			<h4>Do zrobienia ({{ storyStore.todoStories.length }})</h4>
			<StoryCard
				v-for="story in storyStore.todoStories"
				:key="story.id"
				:story="story"
				@edit="startEdit"
				@delete="handleDelete" />
		</div>

		<div class="status-section">
			<h4>W trakcie ({{ storyStore.doingStories.length }})</h4>
			<StoryCard
				v-for="story in storyStore.doingStories"
				:key="story.id"
				:story="story"
				@edit="startEdit"
				@delete="handleDelete" />
		</div>

		<div class="status-section">
			<h4>Zakończone ({{ storyStore.doneStories.length }})</h4>
			<StoryCard
				v-for="story in storyStore.doneStories"
				:key="story.id"
				:story="story"
				@edit="startEdit"
				@delete="handleDelete" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStoryStore } from '../stores/storyStore';
import { useUserStore } from '../stores/userStore';
import type { Story } from '../types/Story';
import StoryForm from './StoryForm.vue';
import StoryCard from './StoryCard.vue';

const props = defineProps<{
	projectId: number;
}>();

const storyStore = useStoryStore();
const userStore = useUserStore();

// Znajdź historyjkę którą edytujemy
const editingStory = computed(() => {
	if (storyStore.editId) {
		return storyStore.stories.find((s) => s.id === storyStore.editId);
	}
	return null;
});

// Funkcje
const handleCreate = (
	name: string,
	description: string,
	priority: 'low' | 'medium' | 'high'
) => {
	// Dla nowych historyjek zawsze używamy statusu 'todo'
	storyStore.createStory(
		name,
		description,
		priority,
		props.projectId,
		userStore.currentUser.id
	);
};

const handleUpdate = (
	name: string,
	description: string,
	priority: 'low' | 'medium' | 'high',
	status: 'todo' | 'doing' | 'done'
) => {
	if (storyStore.editId) {
		storyStore.updateStory(
			storyStore.editId,
			name,
			description,
			priority,
			status,
			props.projectId
		);
		storyStore.cancelEdit();
	}
};

const startEdit = (story: Story) => {
	storyStore.startEdit(story);
};

const handleDelete = (id: number) => {
	storyStore.deleteStory(id, props.projectId);
};
</script>
