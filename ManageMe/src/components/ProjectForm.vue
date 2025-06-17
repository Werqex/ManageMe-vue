<template>
	<div
		class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
		<h3 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
			{{ isEditing ? 'Edytuj projekt' : 'Dodaj nowy projekt' }}
		</h3>
		<form @submit.prevent="handleSubmit" class="space-y-4">
			<div>
				<label
					class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
					Nazwa projektu
				</label>
				<input
					v-model="localName"
					placeholder="Nazwa"
					required
					class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
			</div>
			<div>
				<label
					class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
					Opis projektu
				</label>
				<textarea
					v-model="localDescription"
					placeholder="Opis"
					rows="4"
					class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-vertical min-h-[100px]"></textarea>
			</div>
			<div class="flex space-x-3">
				<button
					type="submit"
					class="px-6 py-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-md transition-colors font-medium cursor-pointer">
					{{ isEditing ? 'Zapisz' : 'Dodaj' }}
				</button>
				<button
					v-if="isEditing"
					type="button"
					@click="$emit('cancel')"
					class="px-6 py-2 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white rounded-md transition-colors font-medium cursor-pointer">
					Anuluj
				</button>
			</div>
		</form>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
	name?: string;
	description?: string;
	isEditing?: boolean;
}>();

const emit = defineEmits<{
	submit: [name: string, description: string];
	cancel: [];
}>();

const localName = ref(props.name || '');
const localDescription = ref(props.description || '');

watch(
	() => props.name,
	(newName) => {
		localName.value = newName || '';
	}
);

watch(
	() => props.description,
	(newDescription) => {
		localDescription.value = newDescription || '';
	}
);

const handleSubmit = () => {
	emit('submit', localName.value, localDescription.value);
	if (!props.isEditing) {
		localName.value = '';
		localDescription.value = '';
	}
};
</script>
