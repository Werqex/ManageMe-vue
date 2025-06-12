<template>
	<form @submit.prevent="handleSubmit">
		<h4>{{ isEditing ? 'Edytuj historyjkę' : 'Dodaj nową historyjkę' }}</h4>

		<input v-model="localName" placeholder="Nazwa" required />
		<textarea v-model="localDescription" placeholder="Opis"></textarea>

		<!-- Select do wyboru priorytetu -->
		<select v-model="localPriority">
			<option value="low">Niski priorytet</option>
			<option value="medium">Średni priorytet</option>
			<option value="high">Wysoki priorytet</option>
		</select>

		<!-- Select statusu - pokazujemy tylko podczas edycji -->
		<select v-if="isEditing" v-model="localStatus">
			<option value="todo">Do zrobienia</option>
			<option value="doing">W trakcie</option>
			<option value="done">Zakończone</option>
		</select>

		<button type="submit">{{ isEditing ? 'Zapisz' : 'Dodaj' }}</button>
		<button v-if="isEditing" type="button" @click="$emit('cancel')">
			Anuluj
		</button>
	</form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

// Definicja typów dla props - interfejs komponentu
const props = defineProps<{
	name?: string;
	description?: string;
	priority?: 'low' | 'medium' | 'high';
	status?: 'todo' | 'doing' | 'done';
	isEditing?: boolean;
}>();

// Definicja eventów które komponent może emitować
const emit = defineEmits<{
	create: [
		name: string,
		description: string,
		priority: 'low' | 'medium' | 'high'
	];
	update: [
		name: string,
		description: string,
		priority: 'low' | 'medium' | 'high',
		status: 'todo' | 'doing' | 'done'
	];
	cancel: [];
}>();

// Reactive refs - lokalne kopie danych z props
// Potrzebne żeby móc edytować dane bez zmieniania props
const localName = ref(props.name || '');
const localDescription = ref(props.description || '');
const localPriority = ref<'low' | 'medium' | 'high'>(
	props.priority || 'medium'
);
const localStatus = ref<'todo' | 'doing' | 'done'>(props.status || 'todo');

// Watchers - reagują na zmiany props i aktualizują lokalne dane
// Potrzebne gdy parent component zmienia props
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

watch(
	() => props.priority,
	(newPriority) => {
		localPriority.value = newPriority || 'medium';
	}
);

watch(
	() => props.status,
	(newStatus) => {
		localStatus.value = newStatus || 'todo';
	}
);

// Funkcja obsługująca submit formularza
const handleSubmit = () => {
	if (props.isEditing) {
		// Dla edycji wysyłamy wszystkie dane włącznie ze statusem
		emit(
			'update',
			localName.value,
			localDescription.value,
			localPriority.value,
			localStatus.value
		);
	} else {
		// Dla dodawania nowej historyjki nie wysyłamy statusu (domyślnie 'todo')
		emit(
			'create',
			localName.value,
			localDescription.value,
			localPriority.value
		);
	}

	// Resetuj formularz tylko dla dodawania nowych elementów
	if (!props.isEditing) {
		localName.value = '';
		localDescription.value = '';
		localPriority.value = 'medium';
	}
};
</script>
