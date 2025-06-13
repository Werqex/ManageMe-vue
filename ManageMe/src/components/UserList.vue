<template>
	<div class="user-list">
		<h3>Lista użytkowników</h3>
		<div
			v-for="user in userStore.getAllUsers()"
			:key="user.id"
			class="user-item">
			<span>
				{{ user.firstName }} {{ user.lastName }} ({{
					userStore.getRoleText(user.role)
				}})
			</span>
			<button
				v-if="user.id !== userStore.currentUser.id"
				@click="userStore.loginAs(user.id)">
				Zaloguj jako
			</button>
			<span v-else class="current-user">Zalogowany</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/userStore';

// Store
const userStore = useUserStore();
</script>
