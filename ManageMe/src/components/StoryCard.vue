<template>
	<div class="story-card">
		<h5>{{ story.name }}</h5>
		<p>{{ story.description }}</p>
		<p><strong>Priorytet:</strong> {{ getPriorityText(story.priority) }}</p>
		<p><strong>Data:</strong> {{ formatDate(story.createdDate) }}</p>

		<button @click="$emit('edit', story)">Edytuj</button>
		<button @click="$emit('delete', story.id)">Usuń</button>
	</div>
</template>

<script setup lang="ts">
import type { Story } from '../types/Story';

defineProps<{
	story: Story;
}>();

defineEmits<{
	edit: [story: Story];
	delete: [id: number];
}>();

const getPriorityText = (priority: 'low' | 'medium' | 'high') => {
	const priorities = {
		low: 'Niski',
		medium: 'Średni',
		high: 'Wysoki',
	};
	return priorities[priority];
};

const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString('pl-PL');
};
</script>
