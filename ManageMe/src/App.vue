<template>
	<div>
		<h1>ManageMe</h1>

		<!-- Formularz -->
		<form @submit.prevent="handleSubmit">
			<input v-model="name" placeholder="Nazwa" required />
			<input v-model="description" placeholder="Opis" />
			<button type="submit">{{ editMode ? 'Zapisz' : 'Dodaj' }}</button>
			<button v-if="editMode" type="button" @click="cancelEdit">Anuluj</button>
		</form>

		<!-- Lista -->
		<div v-for="project in projects" :key="project.id">
			<h3>{{ project.name }}</h3>
			<p>{{ project.description }}</p>
			<button @click="editProject(project)">Edytuj</button>
			<button @click="deleteProject(project.id)">Usuń</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Project {
	id: number;
	name: string;
	description: string;
}

// Dedykowana klasa API
class ProjectApi {
	private storageKey = 'projects';

	getAll(): Project[] {
		const data = localStorage.getItem(this.storageKey);
		return data ? JSON.parse(data) : [];
	}

	save(projects: Project[]): void {
		localStorage.setItem(this.storageKey, JSON.stringify(projects));
	}

	create(name: string, description: string): Project {
		const projects = this.getAll();
		const newProject = {
			id: Date.now(),
			name,
			description,
		};
		projects.push(newProject);
		this.save(projects);
		return newProject;
	}

	update(id: number, name: string, description: string): void {
		const projects = this.getAll();
		const project = projects.find((p) => p.id === id);
		if (project) {
			project.name = name;
			project.description = description;
			this.save(projects);
		}
	}

	delete(id: number): void {
		const projects = this.getAll();
		const filtered = projects.filter((p) => p.id !== id);
		this.save(filtered);
	}
}

// Instancja API
const api = new ProjectApi();

// Stan aplikacji
const projects = ref<Project[]>([]);
const name = ref('');
const description = ref('');
const editMode = ref(false);
const editId = ref<number | null>(null);

// Funkcje używające API
const getProjects = () => {
	projects.value = api.getAll();
};

const handleSubmit = () => {
	if (editMode.value && editId.value) {
		api.update(editId.value, name.value, description.value);
	} else {
		api.create(name.value, description.value);
	}

	clearForm();
	getProjects();
};

const editProject = (project: Project) => {
	name.value = project.name;
	description.value = project.description;
	editMode.value = true;
	editId.value = project.id;
};

const deleteProject = (id: number) => {
	api.delete(id);
	getProjects();
};

const cancelEdit = () => {
	clearForm();
};

const clearForm = () => {
	name.value = '';
	description.value = '';
	editMode.value = false;
	editId.value = null;
};

onMounted(getProjects);
</script>