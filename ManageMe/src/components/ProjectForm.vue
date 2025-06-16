<template>
	<div class="bg-white rounded-lg shadow-md p-6">
		<h3 class="text-2xl font-semibold text-gray-800 mb-4">
			{{ isEditing ? 'Edytuj projekt' : 'Dodaj nowy projekt' }}
		</h3>
		<form @submit.prevent="handleSubmit" class="space-y-4">
			<div>
				<input
					v-model="localName"
					placeholder="Nazwa"
					required
					class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
			</div>
			<div>
				<input
					v-model="localDescription"
					placeholder="Opis"
					class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
			</div>
			<div class="flex space-x-3">
				<button
					type="submit"
					class="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors font-medium">
					{{ isEditing ? 'Zapisz' : 'Dodaj' }}
				</button>
				<button
					v-if="isEditing"
					type="button"
					@click="$emit('cancel')"
					class="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors font-medium">
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
