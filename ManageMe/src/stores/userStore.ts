import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '../types/User';

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User>({
    id: 1,
    firstName: 'Jan',
    lastName: 'Kowalski',
  });

  const getCurrentUser = () => currentUser.value;

  return {
    currentUser,
    getCurrentUser
  };
});