<template>
	<div
		class="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 transition-colors">
		<h4 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
			{{ isEditing ? 'Edytuj historyjkę' : 'Dodaj nową historyjkę' }}
		</h4>

		<form @submit.prevent="handleSubmit" class="space-y-4">
			<div>
				<input
					v-model="localName"
					placeholder="Nazwa"
					required
					class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
			</div>
			<div>
				<textarea
					v-model="localDescription"
					placeholder="Opis"
					rows="4"
					class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-vertical min-h-[100px]"></textarea>
			</div>

			<div class="grid gap-4 sm:grid-cols-2">
				<div>
					<select
						v-model="localPriority"
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer">
						<option value="low">Niski priorytet</option>
						<option value="medium">Średni priorytet</option>
						<option value="high">Wysoki priorytet</option>
					</select>
				</div>
				<div v-if="isEditing">
					<select
						v-model="localStatus"
						class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer">
						<option value="todo">Do zrobienia</option>
						<option value="doing">W trakcie</option>
						<option value="done">Zakończone</option>
					</select>
				</div>
			</div>
			<div class="flex space-x-3">
				<button
					type="submit"
					class="px-4 py-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-md transition-colors font-medium cursor-pointer">
					{{ isEditing ? 'Zapisz' : 'Dodaj' }}
				</button>
				<button
					v-if="isEditing"
					type="button"
					@click="$emit('cancel')"
					class="px-4 py-2 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white rounded-md transition-colors font-medium cursor-pointer">
					Anuluj
				</button>
			</div>
		</form>
	</div>
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
const localName = ref(props.name || '');
const localDescription = ref(props.description || '');
const localPriority = ref<'low' | 'medium' | 'high'>(
	props.priority || 'medium'
);
const localStatus = ref<'todo' | 'doing' | 'done'>(props.status || 'todo');

// Watchers - reagują na zmiany props i aktualizują lokalne dane
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
		emit(
			'update',
			localName.value,
			localDescription.value,
			localPriority.value,
			localStatus.value
		);
	} else {
		emit(
			'create',
			localName.value,
			localDescription.value,
			localPriority.value
		);
	}

	if (!props.isEditing) {
		localName.value = '';
		localDescription.value = '';
		localPriority.value = 'medium';
	}
};
</script>
