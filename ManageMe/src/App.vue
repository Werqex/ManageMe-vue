<template>
  <div>
    <h1>ManageMe</h1>

    <!-- Zalogowany użytkownik -->
    <div class="user-info">
      Zalogowany: {{ userStore.currentUser.firstName }} {{ userStore.currentUser.lastName }}
    </div>

    <!-- Formularz -->
    <form @submit.prevent="handleSubmit">
      <input v-model="name" placeholder="Nazwa" required />
      <input v-model="description" placeholder="Opis" />
      <button type="submit">{{ projectStore.editMode ? 'Zapisz' : 'Dodaj' }}</button>
      <button v-if="projectStore.editMode" type="button" @click="cancelEdit">Anuluj</button>
    </form>

    <!-- Lista -->
    <div v-for="project in projectStore.projects" :key="project.id">
      <h3>{{ project.name }}</h3>
      <p>{{ project.description }}</p>
      <button @click="editProject(project)">Edytuj</button>
      <button @click="projectStore.deleteProject(project.id)">Usuń</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useProjectStore } from './stores/projectStore';
import { useUserStore } from './stores/userStore';

// Stores
const projectStore = useProjectStore();
const userStore = useUserStore();

// Lokalne zmienne formularza
const name = ref('');
const description = ref('');

// Funkcje
const handleSubmit = () => {
  if (projectStore.editMode && projectStore.editId) {
    projectStore.updateProject(projectStore.editId, name.value, description.value);
  } else {
    projectStore.createProject(name.value, description.value);
  }
  clearForm();
};

const editProject = (project: any) => {
  name.value = project.name;
  description.value = project.description;
  projectStore.startEdit(project);
};

const cancelEdit = () => {
  projectStore.cancelEdit();
  clearForm();
};

const clearForm = () => {
  name.value = '';
  description.value = '';
};

onMounted(() => {
  projectStore.fetchProjects();
});
</script>