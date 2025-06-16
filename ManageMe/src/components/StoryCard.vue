<template>
	<div
		class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
		<h5 class="text-md font-semibold text-gray-800 mb-2">{{ story.name }}</h5>
		<p class="text-gray-600 text-sm mb-3">{{ story.description }}</p>
		<div class="space-y-2 mb-4">
			<div class="flex items-center">
				<span class="text-xs font-medium text-gray-500 mr-2">Priorytet:</span>
				<span
					:class="getPriorityClass(story.priority)"
					class="text-xs px-2 py-1 rounded-full font-medium">
					{{ getPriorityText(story.priority) }}
				</span>
			</div>
			<p class="text-xs text-gray-500">
				<span class="font-medium">Data:</span>
				{{ formatDate(story.createdDate) }}
			</p>
		</div>
		<div class="mb-3">
			<div class="flex space-x-1">
				<button
					v-if="story.status !== 'todo'"
					@click="$emit('changeStatus', story.id, 'todo')"
					class="flex-1 px-2 py-1 bg-gray-400 text-white text-xs rounded hover:bg-gray-500 transition-colors cursor-pointer">
					← Do zrobienia
				</button>

				<button
					v-if="story.status !== 'doing'"
					@click="$emit('changeStatus', story.id, 'doing')"
					class="flex-1 px-2 py-1 bg-blue-400 text-white text-xs rounded hover:bg-blue-500 transition-colors cursor-pointer">
					{{ story.status === 'todo' ? '→ W trakcie' : '← W trakcie' }}
				</button>

				<button
					v-if="story.status !== 'done'"
					@click="$emit('changeStatus', story.id, 'done')"
					class="flex-1 px-2 py-1 bg-green-400 text-white text-xs rounded hover:bg-green-500 transition-colors cursor-pointer">
					→ Zakończone
				</button>
			</div>
		</div>
		<div class="flex space-x-1">
			<button
				@click="$emit('viewTasks', story.id)"
				class="flex-1 px-2 py-1 bg-indigo-500 text-white text-xs rounded hover:bg-indigo-600 transition-colors cursor-pointer">
				Zadania
			</button>
			<button
				@click="$emit('edit', story)"
				class="flex-1 px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 transition-colors cursor-pointer">
				Edytuj
			</button>
			<button
				@click="$emit('delete', story.id)"
				class="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors cursor-pointer">
				Usuń
			</button>
		</div>
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
	changeStatus: [id: number, status: 'todo' | 'doing' | 'done'];
	viewTasks: [storyId: number];
}>();

const getPriorityText = (priority: 'low' | 'medium' | 'high') => {
	const priorities = {
		low: 'Niski',
		medium: 'Średni',
		high: 'Wysoki',
	};
	return priorities[priority];
};

const getPriorityClass = (priority: 'low' | 'medium' | 'high') => {
	const classes = {
		low: 'bg-green-100 text-green-800',
		medium: 'bg-yellow-100 text-yellow-800',
		high: 'bg-red-100 text-red-800',
	};
	return classes[priority];
};

const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString('pl-PL');
};
</script>
