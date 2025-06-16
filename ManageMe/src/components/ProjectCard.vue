<template>
	<div
		class="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
		<h4 class="text-lg font-semibold text-gray-800 mb-2">{{ project.name }}</h4>
		<p class="text-gray-600 mb-4">{{ project.description }}</p>
		<div class="flex space-x-2">
			<button
				@click="$emit('select', project)"
				class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium cursor-pointer">
				Wybierz projekt
			</button>
			<button
				@click="$emit('delete', project.id)"
				class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors font-medium cursor-pointer">
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
	delete: [id: number];
}>();
</script>
