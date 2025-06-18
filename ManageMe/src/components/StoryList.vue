<template>
	<div
		class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
		<!-- Widok zadań dla wybranej historyjki -->
		<div v-if="selectedStoryId">
			<div class="flex items-center mb-6">
				<button
					@click="goBackToStories"
					class="px-4 py-2 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white rounded-md transition-colors cursor-pointer mr-4">
					Powrót do historyjek
				</button>
				<h3 class="text-2xl font-semibold text-gray-800 dark:text-gray-100">
					Zadania: {{ selectedStoryName }}
				</h3>
			</div>

			<TaskKanban
				:story-id="selectedStoryId"
				:story-name="selectedStoryName"
				@add-task="openTaskCreateModal"
				@assign-task="openAssignUserModal"
				@edit-task="openTaskEditModal"
				@task-details="openTaskDetailsModal" />
		</div>
		<div v-else>
			<h3 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
				Historyjki projektu
			</h3>
			<div class="mb-8">
				<button
					@click="openStoryCreateModal"
					class="w-full px-4 py-3 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-md transition-colors font-medium cursor-pointer">
					Dodaj nową historyjkę
				</button>
			</div>
			<div class="grid gap-6 lg:grid-cols-3">
				<div
					class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-colors">
					<h4
						class="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
						Do zrobienia
						<span
							class="ml-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm px-2 py-1 rounded-full">
							{{ storyStore.todoStories.length }}
						</span>
					</h4>
					<div class="space-y-3">
						<StoryCard
							v-for="story in storyStore.todoStories"
							:key="story.id"
							:story="story"
							@edit="openStoryEditModal"
							@delete="handleDelete"
							@change-status="handleChangeStatus"
							@view-tasks="selectStory" />
					</div>
				</div>

				<div
					class="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 transition-colors">
					<h4
						class="text-lg font-semibold text-blue-700 dark:text-blue-200 mb-4 flex items-center">
						W trakcie
						<span
							class="ml-2 bg-blue-200 dark:bg-blue-700 text-blue-700 dark:text-blue-200 text-sm px-2 py-1 rounded-full">
							{{ storyStore.doingStories.length }}
						</span>
					</h4>
					<div class="space-y-3">
						<StoryCard
							v-for="story in storyStore.doingStories"
							:key="story.id"
							:story="story"
							@edit="openStoryEditModal"
							@delete="handleDelete"
							@change-status="handleChangeStatus"
							@view-tasks="selectStory" />
					</div>
				</div>

				<div
					class="bg-green-50 dark:bg-green-900 rounded-lg p-4 transition-colors">
					<h4
						class="text-lg font-semibold text-green-700 dark:text-green-200 mb-4 flex items-center">
						Zakończone
						<span
							class="ml-2 bg-green-200 dark:bg-green-700 text-green-700 dark:text-green-200 text-sm px-2 py-1 rounded-full">
							{{ storyStore.doneStories.length }}
						</span>
					</h4>
					<div class="space-y-3">
						<StoryCard
							v-for="story in storyStore.doneStories"
							:key="story.id"
							:story="story"
							@edit="openStoryEditModal"
							@delete="handleDelete"
							@change-status="handleChangeStatus"
							@view-tasks="selectStory" />
					</div>
				</div>
			</div>
		</div>

		<!-- Modal do edycji historyjek -->
		<EditModal
			:show="storyModalState.show"
			:type="storyModalState.type"
			:data="storyModalState.data"
			:is-editing="storyModalState.isEditing"
			@close="closeStoryModal"
			@submit="handleStoryModalSubmit" />

		<!-- Modal do edycji zadań -->
		<EditModal
			:show="taskModalState.show"
			:type="taskModalState.type"
			:data="taskModalState.data"
			:is-editing="taskModalState.isEditing"
			@close="closeTaskModal"
			@submit="handleTaskModalSubmit" />

		<!-- Modal szczegółów zadania -->
		<TaskDetails
			:show="taskDetailsState.show"
			:task-details="taskDetailsState.details"
			@close="closeTaskDetailsModal"
			@assign="openAssignUserModal"
			@complete="handleCompleteTask"
			@reset="handleResetTask"
			@edit="openTaskEditModal" />

		<!-- Modal przypisywania użytkownika -->
		<AssignUserModal
			:show="assignUserState.show"
			:task-id="assignUserState.taskId"
			:task-name="assignUserState.taskName"
			@close="closeAssignUserModal"
			@assign="handleAssignUser" />
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStoryStore } from '../stores/storyStore';
import { useTaskStore } from '../stores/taskStore';
import { useUserStore } from '../stores/userStore';
import type { Story } from '../types/Story';
import type { Task } from '../types/Task';
import StoryCard from './StoryCard.vue';
import TaskKanban from './TaskList.vue';
import TaskDetails from './TaskDetails.vue';
import AssignUserModal from './AssignUserModal.vue';
import EditModal from './EditModal.vue';

const props = defineProps<{
	projectId: number;
}>();

const storyStore = useStoryStore();
const taskStore = useTaskStore();
const userStore = useUserStore();

// Stan dla widoku zadań
const selectedStoryId = ref<number | null>(null);
const selectedStoryName = ref<string>('');

// Stan modala dla historyjek
const storyModalState = ref({
	show: false,
	type: 'story' as 'project' | 'story' | 'task',
	data: null as any,
	isEditing: false,
});

// Stan modala dla zadań
const taskModalState = ref({
	show: false,
	type: 'task' as 'project' | 'story' | 'task',
	data: null as any,
	isEditing: false,
});

// Stan modala szczegółów zadania
const taskDetailsState = ref({
	show: false,
	details: null as { task: Task; story: Story } | null,
});

// Stan modala przypisywania użytkownika
const assignUserState = ref({
	show: false,
	taskId: null as number | null,
	taskName: '',
});

// Funkcje do zarządzania widokiem historyjek vs zadań
const selectStory = (storyId: number) => {
	const story = storyStore.stories.find((s) => s.id === storyId);
	if (story) {
		selectedStoryId.value = storyId;
		selectedStoryName.value = story.name;
		taskStore.fetchTasksByStory(storyId);
	}
};

const goBackToStories = () => {
	selectedStoryId.value = null;
	selectedStoryName.value = '';
};

// Funkcje dla historyjek
const openStoryCreateModal = () => {
	storyModalState.value = {
		show: true,
		type: 'story',
		data: null,
		isEditing: false,
	};
};

const openStoryEditModal = (story: Story) => {
	storyModalState.value = {
		show: true,
		type: 'story',
		data: story,
		isEditing: true,
	};
};

const closeStoryModal = () => {
	storyModalState.value = {
		show: false,
		type: 'story',
		data: null,
		isEditing: false,
	};
};

const handleStoryModalSubmit = (formData: any) => {
	if (storyModalState.value.isEditing) {
		const story = storyModalState.value.data;
		storyStore.updateStory(
			story.id,
			formData.name,
			formData.description,
			formData.priority,
			story.status,
			props.projectId
		);
	} else {
		storyStore.createStory(
			formData.name,
			formData.description,
			formData.priority,
			props.projectId,
			userStore.currentUser!.id
		);
	}
	closeStoryModal();
};

// Funkcje dla zadań
const openTaskCreateModal = () => {
	taskModalState.value = {
		show: true,
		type: 'task',
		data: null,
		isEditing: false,
	};
};

const openTaskEditModal = (task: Task) => {
	closeTaskDetailsModal();

	taskModalState.value = {
		show: true,
		type: 'task',
		data: task,
		isEditing: true,
	};
};

const closeTaskModal = () => {
	taskModalState.value = {
		show: false,
		type: 'task',
		data: null,
		isEditing: false,
	};
};

const handleTaskModalSubmit = (formData: any) => {
	if (!selectedStoryId.value) return;

	if (taskModalState.value.isEditing) {
		const task = taskModalState.value.data;
		taskStore.updateTask(
			task.id,
			formData.name,
			formData.description,
			formData.priority,
			formData.estimatedHours
		);
	} else {
		taskStore.createTask(
			formData.name,
			formData.description,
			formData.priority,
			selectedStoryId.value,
			formData.estimatedHours
		);
	}
	closeTaskModal();
};

// Funkcje dla szczegółów zadania
const openTaskDetailsModal = async (taskId: number) => {
	try {
		const details = await taskStore.getTaskDetails(taskId);
		taskDetailsState.value = {
			show: true,
			details,
		};
	} catch (error) {
		console.error('Failed to load task details:', error);
		// Pokaż błąd użytkownikowi
		taskDetailsState.value = {
			show: true,
			details: null,
		};
	}
};

const closeTaskDetailsModal = () => {
	taskDetailsState.value = {
		show: false,
		details: null,
	};
};

// Funkcje dla przypisywania użytkownika
const openAssignUserModal = (taskId: number) => {
	const task = taskStore.tasks.find((t) => t.id === taskId);
	if (task) {
		assignUserState.value = {
			show: true,
			taskId: taskId,
			taskName: task.name,
		};
	}
};

const closeAssignUserModal = () => {
	assignUserState.value = {
		show: false,
		taskId: null,
		taskName: '',
	};
};

const handleAssignUser = (taskId: number, userId: number) => {
	taskStore.assignUserToTask(taskId, userId);
	closeAssignUserModal();
	closeTaskDetailsModal();
};

// Inne funkcje dla zadań
const handleCompleteTask = (taskId: number) => {
	taskStore.completeTask(taskId);
	closeTaskDetailsModal();
};

const handleResetTask = (taskId: number) => {
	taskStore.resetTaskToTodo(taskId);
	closeTaskDetailsModal();
};

// Funkcje dla historyjek
const handleChangeStatus = (
	storyId: number,
	newStatus: 'todo' | 'doing' | 'done'
) => {
	const story = storyStore.stories.find((s) => s.id === storyId);
	if (story) {
		storyStore.updateStory(
			story.id,
			story.name,
			story.description,
			story.priority,
			newStatus,
			props.projectId
		);
	}
};

const handleDelete = (id: number) => {
	storyStore.deleteStory(id, props.projectId);
};

onMounted(() => {
	storyStore.fetchStoriesByProject(props.projectId);
});
</script>
