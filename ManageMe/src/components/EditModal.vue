<template>
	<div
		v-if="show"
		class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
		@click="handleBackdropClick">
		<div
			class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto transition-colors"
			@click.stop>
			<div
				class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-600">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
					{{ title }}
				</h3>
				<button
					@click="$emit('close')"
					class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 text-2xl font-bold cursor-pointer">
					x
				</button>
			</div>
			<div class="p-6">
				<form @submit.prevent="handleSubmit" class="space-y-4">
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Nazwa
						</label>
						<input
							v-model="formData.name"
							placeholder="Wpisz nazwę"
							required
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
					</div>
					<div>
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Opis
						</label>
						<textarea
							v-model="formData.description"
							placeholder="Wpisz opis"
							rows="4"
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-vertical min-h-[100px]"></textarea>
					</div>
					<div v-if="type === 'story'">
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Priorytet
						</label>
						<select
							v-model="formData.priority"
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer">
							<option value="low">Niski priorytet</option>
							<option value="medium">Średni priorytet</option>
							<option value="high">Wysoki priorytet</option>
						</select>
					</div>
					<div v-if="type === 'task'" class="space-y-4">
						<div>
							<label
								class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								Priorytet
							</label>
							<select
								v-model="formData.priority"
								class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer">
								<option value="low">Niski priorytet</option>
								<option value="medium">Średni priorytet</option>
								<option value="high">Wysoki priorytet</option>
							</select>
						</div>
						<div>
							<label
								class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								Przewidywany czas (godziny)
							</label>
							<input
								v-model.number="formData.estimatedHours"
								type="number"
								min="0.5"
								step="0.5"
								placeholder="Np. 8"
								required
								class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
						</div>
					</div>
					<div class="flex space-x-3 pt-4">
						<button
							type="submit"
							class="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-md transition-colors font-medium cursor-pointer">
							{{ isEditing ? 'Zapisz zmiany' : 'Dodaj' }}
						</button>
						<button
							type="button"
							@click="$emit('close')"
							class="px-4 py-2 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white rounded-md transition-colors font-medium cursor-pointer">
							Anuluj
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onBeforeUnmount } from 'vue';
import { disableScroll, enableScroll } from '../utils/scrollLock';
import type { FormData } from '../types/FormData';

type EditType = 'project' | 'story' | 'task';

const props = defineProps<{
	show: boolean;
	type: EditType;
	data?: any;
	isEditing?: boolean;
}>();

const emit = defineEmits<{
	close: [];
	submit: [data: FormData];
}>();

const formData = ref<FormData>({
	name: '',
	description: '',
	priority: 'medium',
	status: 'todo',
	estimatedHours: 1,
});

const title = computed(() => {
	if (props.type === 'project') {
		return props.isEditing ? 'Edytuj projekt' : 'Dodaj nowy projekt';
	} else if (props.type === 'story') {
		return props.isEditing ? 'Edytuj historyjkę' : 'Dodaj nową historyjkę';
	} else {
		return props.isEditing ? 'Edytuj zadanie' : 'Dodaj nowe zadanie';
	}
});

// Obserwuj zmiany w show prop i zarządzaj scroll'em
watch(
	() => props.show,
	(newShow) => {
		if (newShow) {
			disableScroll();
		} else {
			enableScroll();
		}
	}
);

// Obserwujemy zmiany w danych i aktualizujemy formularz
watch(
	() => props.data,
	(newData) => {
		if (newData) {
			formData.value = {
				name: newData.name || '',
				description: newData.description || '',
				priority: newData.priority || 'medium',
				status: newData.status || 'todo',
				estimatedHours: newData.estimatedHours || 1,
			};
		} else {
			formData.value = {
				name: '',
				description: '',
				priority: 'medium',
				status: 'todo',
				estimatedHours: 1,
			};
		}
	},
	{ immediate: true }
);

const handleBackdropClick = (event: Event) => {
	if (event.target === event.currentTarget) {
		emit('close');
	}
};

const handleSubmit = () => {
	emit('submit', { ...formData.value });

	if (!props.isEditing) {
		formData.value = {
			name: '',
			description: '',
			priority: 'medium',
			status: 'todo',
			estimatedHours: 1,
		};
	}
};

// Cleanup przy unmount
onBeforeUnmount(() => {
	if (props.show) {
		enableScroll();
	}
});
</script>
