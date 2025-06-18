<template>
	<div class="relative">
		<!-- Przycisk przełącznika motywu -->
		<button
			@click="toggleDropdown"
			class="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
			:class="{ 'ring-2 ring-blue-500': isDropdownOpen }">
			<span class="text-sm font-medium">{{ currentThemeText }}</span>
			<svg
				class="w-4 h-4 transition-transform"
				:class="{ 'rotate-180': isDropdownOpen }"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M19 9l-7 7-7-7" />
			</svg>
		</button>

		<!-- Rozwijana lista opcji motywu -->
		<div
			v-if="isDropdownOpen"
			class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
			<div class="py-1">
				<!-- Opcja jasnego motywu -->
				<button
					@click="selectTheme('light')"
					class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
					:class="{
						'bg-gray-100 dark:bg-gray-700':
							!themeStore.isDark && !themeStore.isSystemPreference,
					}">
					Jasny motyw
				</button>

				<!-- Opcja ciemnego motywu -->
				<button
					@click="selectTheme('dark')"
					class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
					:class="{
						'bg-gray-100 dark:bg-gray-700':
							themeStore.isDark && !themeStore.isSystemPreference,
					}">
					Ciemny motyw
				</button>

				<!-- Opcja automatycznego motywu (ustawienia systemowe) -->
				<button
					@click="selectTheme('system')"
					class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
					:class="{
						'bg-gray-100 dark:bg-gray-700': themeStore.isSystemPreference,
					}">
					Automatyczny
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useThemeStore } from '../stores/themeStore';

// Store motywu z Pinia
const themeStore = useThemeStore();
// Stan rozwinięcia menu wyboru motywu
const isDropdownOpen = ref(false);

// Właściwości obliczane
// Zwraca tekst dla aktualnego motywu
const currentThemeText = computed(() => {
	if (themeStore.isSystemPreference) return 'Automatyczny';
	return themeStore.isDark ? 'Ciemny' : 'Jasny';
});

// Funkcje obsługi interfejsu
// Przełącza widoczność rozwijanej listy opcji
const toggleDropdown = () => {
	isDropdownOpen.value = !isDropdownOpen.value;
};

// Wybiera motyw na podstawie przekazanego parametru
const selectTheme = (theme: 'light' | 'dark' | 'system') => {
	switch (theme) {
		case 'light':
			themeStore.setLightTheme();
			break;
		case 'dark':
			themeStore.setDarkTheme();
			break;
		case 'system':
			themeStore.useSystemTheme();
			break;
	}
	isDropdownOpen.value = false;
};

// Zamyka dropdown po kliknięciu poza nim
const handleClickOutside = (event: Event) => {
	const target = event.target as Element;
	const dropdown = document.querySelector('.relative');
	if (dropdown && !dropdown.contains(target)) {
		isDropdownOpen.value = false;
	}
};

// Hooks cyklu życia komponentu
// Dodaje nasłuchiwanie kliknięć po zamontowaniu komponentu
onMounted(() => {
	document.addEventListener('click', handleClickOutside);
});

// Usuwa nasłuchiwanie kliknięć przed usunięciem komponentu
onBeforeUnmount(() => {
	document.removeEventListener('click', handleClickOutside);
});
</script>
