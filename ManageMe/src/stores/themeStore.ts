import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {
	const isDark = ref(false);
	const isSystemPreference = ref(true);

	// Inicjalizacja motywu
	const initializeTheme = () => {
		const savedTheme = localStorage.getItem('theme-preference');

		if (savedTheme === 'dark') {
			isDark.value = true;
			isSystemPreference.value = false;
		} else if (savedTheme === 'light') {
			isDark.value = false;
			isSystemPreference.value = false;
		} else {
			// Użyj preferencji systemu
			isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
			isSystemPreference.value = true;
		}

		// Natychmiast zastosuj motyw
		applyTheme();
	};

	// Nasłuchiwanie zmian preferencji systemu
	const setupSystemThemeListener = () => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

		const handleSystemThemeChange = (e: MediaQueryListEvent) => {
			if (isSystemPreference.value) {
				isDark.value = e.matches;
				applyTheme();
			}
		};

		mediaQuery.addEventListener('change', handleSystemThemeChange);

		return () =>
			mediaQuery.removeEventListener('change', handleSystemThemeChange);
	};

	// Zastosuj motyw do dokumentu
	const applyTheme = () => {
		// Force remove and add classes to ensure they apply
		document.documentElement.classList.remove('dark');
		if (isDark.value) {
			document.documentElement.classList.add('dark');
		}

		// Debug log
		console.log(
			'Theme applied:',
			isDark.value ? 'dark' : 'light',
			document.documentElement.classList.contains('dark')
		);
	};

	// Ustaw jasny motyw
	const setLightTheme = () => {
		isDark.value = false;
		isSystemPreference.value = false;
		localStorage.setItem('theme-preference', 'light');
		applyTheme();
	};

	// Ustaw ciemny motyw
	const setDarkTheme = () => {
		isDark.value = true;
		isSystemPreference.value = false;
		localStorage.setItem('theme-preference', 'dark');
		applyTheme();
	};

	// Użyj preferencji systemu
	const useSystemTheme = () => {
		isSystemPreference.value = true;
		isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
		localStorage.removeItem('theme-preference');
		applyTheme();
	};

	// Przełącz między jasnym a ciemnym
	const toggleTheme = () => {
		if (isSystemPreference.value) {
			if (isDark.value) {
				setLightTheme();
			} else {
				setDarkTheme();
			}
		} else {
			if (isDark.value) {
				setLightTheme();
			} else {
				setDarkTheme();
			}
		}
	};

	return {
		isDark,
		isSystemPreference,
		initializeTheme,
		setupSystemThemeListener,
		setLightTheme,
		setDarkTheme,
		useSystemTheme,
		toggleTheme,
	};
});
