import { test, expect } from '@playwright/test';

test('Stwórz Projekt następnie stwórz historyjke następnie stwórz zadanie', async ({
	page,
}) => {
	await page.goto('http://localhost:5173/');
	await page.getByRole('textbox', { name: 'Login' }).fill('admin');
	await page.getByRole('textbox', { name: 'Hasło' }).fill('admin123');
	await page.getByRole('button', { name: 'Zaloguj się' }).click();

	// Czekaj na pojawienie się tekstu
	await expect(
		page.getByRole('button', { name: 'Wybierz projekt' }).last()
	).toBeVisible();

	// Policz projekty po załadowaniu danych
	const initialProjectCount = await page
		.getByRole('button', { name: 'Wybierz projekt' })
		.count();

	await page.getByRole('button', { name: 'Dodaj nowy projekt' }).click();
	await page
		.getByRole('textbox', { name: 'Wpisz nazwę' })
		.fill('projekt testowy');
	await page
		.getByRole('textbox', { name: 'Wpisz opis' })
		.fill('projekt testowy');
	await page.getByRole('button', { name: 'Dodaj', exact: true }).click();

	// Czekaj aż użytkownik zobaczy że liczba projektów się zwiększyła
	await expect(
		page.getByRole('button', { name: 'Wybierz projekt' })
	).toHaveCount(initialProjectCount + 1);

	// Teraz kliknij ostatni (najnowszy) projekt
	await page.getByRole('button', { name: 'Wybierz projekt' }).last().click();

	await expect(
		page.getByRole('button', { name: 'Zadania' }).last()
	).toBeVisible();

	// Policz historyjki przed dodaniem
	const initialStoryCount = await page
		.getByRole('button', { name: 'Zadania' })
		.count();

	await page.getByRole('button', { name: 'Dodaj nową historyjkę' }).click();
	await page
		.getByRole('textbox', { name: 'Wpisz nazwę' })
		.fill('historyjka testowa');
	await page
		.getByRole('textbox', { name: 'Wpisz opis' })
		.fill('historyjka testowa');
	await page.getByRole('button', { name: 'Dodaj', exact: true }).click();

	// Czekaj aż użytkownik zobaczy że liczba historyjek się zwiększyła
	await expect(page.getByRole('button', { name: 'Zadania' })).toHaveCount(
		initialStoryCount + 1
	);

	await page.getByRole('button', { name: 'Zadania' }).last().click();

	const beforeText = await page.locator('text=Do zrobienia').textContent();

	// Utwórz zadanie
	await page.getByRole('button', { name: 'Dodaj zadanie' }).click();
	await page
		.getByRole('textbox', { name: 'Wpisz nazwę' })
		.fill('zadanie testowe');
	await page
		.getByRole('textbox', { name: 'Wpisz opis' })
		.fill(`zadanie testowe`);
	await page.getByRole('button', { name: 'Dodaj', exact: true }).click();

	await expect(page.locator('text=Do zrobienia')).not.toHaveText(
		beforeText || ''
	);
});
