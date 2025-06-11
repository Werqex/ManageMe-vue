<template>
	<form @submit.prevent="handleSubmit">
		<h3>{{ isEditing ? 'Edytuj projekt' : 'Dodaj nowy projekt' }}</h3>
		<input v-model="localName" placeholder="Nazwa" required />
		<input v-model="localDescription" placeholder="Opis" />
		<button type="submit">{{ isEditing ? 'Zapisz' : 'Dodaj' }}</button>
		<button v-if="isEditing" type="button" @click="$emit('cancel')">
			Anuluj
		</button>
	</form>
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
