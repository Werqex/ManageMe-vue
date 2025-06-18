import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {
	// Stan motywu aplikacji
	const isDark = ref(false);
	const isSystemPreference = ref(true);

	// Inicjalizacja motywu przy starcie
	// Zapobiega migotaniu UI
	const initializeTheme = () => {
		const savedTheme = localStorage.getItem('theme-preference');

		if (savedTheme === 'dark') {
			isDark.value = true;
			isSystemPreference.value = false;
		} else if (savedTheme === 'light') {
			isDark.value = false;
			isSystemPreference.value = false;
		} else {
			// Brak preferencji = ustawienia systemowe
			isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
			isSystemPreference.value = true;
		}

		applyTheme();
	};

	// Nasluchuje zmian w ustawieniach systemu
	// Reaguje na dzialania uzytkownika
	const setupSystemThemeListener = () => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

		const handleSystemThemeChange = (e: MediaQueryListEvent) => {
			if (isSystemPreference.value) {
				isDark.value = e.matches;
				applyTheme();
			}
		};

		mediaQuery.addEventListener('change', handleSystemThemeChange);

		// Funkcja czyszczaca listener
		return () =>
			mediaQuery.removeEventListener('change', handleSystemThemeChange);
	};

	// Aplikuje motyw przez modyfikacje klas DOM
	const applyTheme = () => {
		document.documentElement.classList.remove('dark');
		if (isDark.value) {
			document.documentElement.classList.add('dark');
		}
	};

	// Ustawia jasny motyw
	const setLightTheme = () => {
		isDark.value = false;
		isSystemPreference.value = false;
		localStorage.setItem('theme-preference', 'light');
		applyTheme();
	};

	// Ustawia ciemny motyw
	const setDarkTheme = () => {
		isDark.value = true;
		isSystemPreference.value = false;
		localStorage.setItem('theme-preference', 'dark');
		applyTheme();
	};

	// Przywraca uzywanie ustawien systemowych
	const useSystemTheme = () => {
		isSystemPreference.value = true;
		isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
		localStorage.removeItem('theme-preference');
		applyTheme();
	};

	// Inteligentnie przelacza miedzy motywami
	const toggleTheme = () => {
		if (isSystemPreference.value) {
			// Wybor manualny zamiast auto
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
