<template>
	<div
		class="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md dark:hover:shadow-lg transition-all">
		<h4 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
			{{ project.name }}
		</h4>
		<p class="text-gray-600 dark:text-gray-300 mb-4">
			{{ project.description }}
		</p>
		<div class="flex space-x-2">
			<button
				@click="$emit('select', project)"
				class="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-md transition-colors font-medium cursor-pointer">
				Wybierz projekt
			</button>
			<button
				@click="$emit('edit', project)"
				class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white rounded-md transition-colors font-medium cursor-pointer">
				Edytuj
			</button>
			<button
				@click="$emit('delete', project.id)"
				class="px-4 py-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-md transition-colors font-medium cursor-pointer">
				Usuń
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Project } from '../types/Project';

defineProps<{
	project: Project;
}>();

defineEmits<{
	select: [project: Project];
	edit: [project: Project];
	delete: [id: string];
}>();
</script>
