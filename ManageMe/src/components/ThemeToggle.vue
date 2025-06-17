<template>
	<div class="relative">
		<button
			@click="toggleDropdown"
			class="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
			:class="{ 'ring-2 ring-blue-500': isDropdownOpen }">
			<component :is="currentIcon" class="w-5 h-5" />
			<span class="text-sm font-medium hidden sm:block">{{
				currentThemeText
			}}</span>
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
		<div
			v-if="isDropdownOpen"
			class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
			<div class="py-1">
				<button
					@click="selectTheme('light')"
					class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
					:class="{
						'bg-gray-100 dark:bg-gray-700':
							!themeStore.isDark && !themeStore.isSystemPreference,
					}">
					<SunIcon class="w-4 h-4 mr-3" />
					Jasny motyw
					<CheckIcon
						v-if="!themeStore.isDark && !themeStore.isSystemPreference"
						class="w-4 h-4 ml-auto text-blue-500" />
				</button>

				<button
					@click="selectTheme('dark')"
					class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
					:class="{
						'bg-gray-100 dark:bg-gray-700':
							themeStore.isDark && !themeStore.isSystemPreference,
					}">
					<MoonIcon class="w-4 h-4 mr-3" />
					Ciemny motyw
					<CheckIcon
						v-if="themeStore.isDark && !themeStore.isSystemPreference"
						class="w-4 h-4 ml-auto text-blue-500" />
				</button>

				<button
					@click="selectTheme('system')"
					class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
					:class="{
						'bg-gray-100 dark:bg-gray-700': themeStore.isSystemPreference,
					}">
					<ComputerIcon class="w-4 h-4 mr-3" />
					Automatyczny
					<CheckIcon
						v-if="themeStore.isSystemPreference"
						class="w-4 h-4 ml-auto text-blue-500" />
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useThemeStore } from '../stores/themeStore';

const themeStore = useThemeStore();
const isDropdownOpen = ref(false);

// Ikony SVG jako komponenty
const SunIcon = {
	template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    `,
};

const MoonIcon = {
	template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
    `,
};

const ComputerIcon = {
	template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    `,
};

const CheckIcon = {
	template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
    `,
};

// Computed properties
const currentIcon = computed(() => {
	if (themeStore.isSystemPreference) return ComputerIcon;
	return themeStore.isDark ? MoonIcon : SunIcon;
});

const currentThemeText = computed(() => {
	if (themeStore.isSystemPreference) return 'Automatyczny';
	return themeStore.isDark ? 'Ciemny' : 'Jasny';
});

// Funkcje
const toggleDropdown = () => {
	isDropdownOpen.value = !isDropdownOpen.value;
};

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

// Zamknij dropdown po kliknięciu poza nim
const handleClickOutside = (event: Event) => {
	const target = event.target as Element;
	const dropdown = document.querySelector('.relative');
	if (dropdown && !dropdown.contains(target)) {
		isDropdownOpen.value = false;
	}
};

onMounted(() => {
	document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
	document.removeEventListener('click', handleClickOutside);
});
</script>
