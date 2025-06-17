import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount('#app');

// Inicjalizacja motywu przy starcie aplikacji
document.addEventListener('DOMContentLoaded', () => {
	const savedTheme = localStorage.getItem('theme-preference');
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

	if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
		document.documentElement.classList.add('dark');
	} else {
		document.documentElement.classList.remove('dark');
	}
});
