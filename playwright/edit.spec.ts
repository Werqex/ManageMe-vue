import { test, expect } from '@playwright/test';

test('Sprawdź czy działa edytowanie projektu', async ({ page }) => {
	await page.goto('http://localhost:5173/');
	await page.getByRole('textbox', { name: 'Login' }).fill('admin');
	await page.getByRole('textbox', { name: 'Hasło' }).fill('admin123');
	await page.getByRole('button', { name: 'Zaloguj się' }).click();

	// Czekaj na załadowanie strony z projektami
	await expect(page.getByText('Wszystkie projekty')).toBeVisible();

	// Czekaj na załadowanie przynajmniej jednego przycisku "Edytuj"
	await expect(
		page.getByRole('button', { name: 'Edytuj' }).last()
	).toBeVisible();

	// Pobierz oryginalną nazwę i opis PRZED edycją
	const originalNameText =
		(await page.getByRole('heading', { level: 4 }).last().textContent()) || '';
	const originalDescText = (await page.locator('p').last().textContent()) || '';

	// Kliknij w ostatni przycisk "Edytuj"
	await page.getByRole('button', { name: 'Edytuj' }).last().click();

	await page
		.getByRole('textbox', { name: 'Wpisz nazwę' })
		.fill('projekt testowy edytowany');
	await page
		.getByRole('textbox', { name: 'Wpisz opis' })
		.fill('projekt testowy edytowany');
	await page.getByRole('button', { name: 'Zapisz zmiany' }).click();

	// Sprawdź nową nazwę i opis PO edycji
	await expect(page.getByRole('heading', { level: 4 }).last()).toHaveText(
		'projekt testowy edytowany'
	);
	await expect(page.locator('p').last()).toHaveText(
		'projekt testowy edytowany'
	);

	const newNameText =
		(await page.getByRole('heading', { level: 4 }).last().textContent()) || '';
	const newDescText = (await page.locator('p').last().textContent()) || '';

	// Sprawdź czy coś się zmieniło i zaloguj
	const nameChanged = originalNameText !== newNameText;
	const descChanged = originalDescText !== newDescText;

	if (!nameChanged && !descChanged) {
		console.log(
			'Nic nie zostało zmienione - nazwa i opis pozostały takie same'
		);
	} else if (!nameChanged) {
		console.log('Nazwa nie została zmieniona, tylko opis');
	} else if (!descChanged) {
		console.log('Opis nie został zmieniony, tylko nazwa');
	} else {
		console.log('Nazwa i opis zostały zmienione');
	}

	// Sprawdź końcowy rezultat
	expect(newNameText).toBe('projekt testowy edytowany');
	expect(newDescText).toBe('projekt testowy edytowany');
});

test('Sprawdź czy działa edytowanie historyjki', async ({ page }) => {
	await page.goto('http://localhost:5173/');
	await page.getByRole('textbox', { name: 'Login' }).fill('admin');
	await page.getByRole('textbox', { name: 'Hasło' }).fill('admin123');
	await page.getByRole('button', { name: 'Zaloguj się' }).click();

	// Czekaj na załadowanie strony z projektami
	await expect(page.getByText('Wszystkie projekty')).toBeVisible();
	await expect(
		page.getByRole('button', { name: 'Wybierz projekt' }).last()
	).toBeVisible();
	await page.getByRole('button', { name: 'Wybierz projekt' }).last().click();

	// Czekaj na załadowanie historyjek
	await expect(
		page.getByRole('button', { name: 'Edytuj' }).last()
	).toBeVisible();

	// Pobierz oryginalną nazwę i opis PRZED edycją
	const originalName = (await page.locator('h5').last().textContent()) || '';
	const originalDesc =
		(await page.locator('h5').last().locator('+ p').textContent()) || '';

	// Kliknij w ostatni przycisk "Edytuj"
	await page.getByRole('button', { name: 'Edytuj' }).last().click();

	// Edytuj historyjkę
	await page
		.getByRole('textbox', { name: 'Wpisz nazwę' })
		.fill('historyjka testowa edytowana');
	await page
		.getByRole('textbox', { name: 'Wpisz opis' })
		.fill('historyjka testowa edytowana');

	await page.getByRole('button', { name: 'Zapisz zmiany' }).click();

	// Sprawdź konkretne elementy zamiast ogólnego tekstu
	const newNameElement = page.locator(
		'h5:has-text("historyjka testowa edytowana")'
	);
	const newDescElement = page.locator(
		'h5:has-text("historyjka testowa edytowana") + p'
	);

	await expect(newNameElement).toBeVisible();
	await expect(newDescElement).toBeVisible();

	const newName = (await newNameElement.textContent()) || '';
	const newDesc = (await newDescElement.textContent()) || '';

	// Sprawdź czy coś się zmieniło i zaloguj
	const nameChanged = originalName !== newName;
	const descChanged = originalDesc !== newDesc;

	if (!nameChanged && !descChanged) {
		console.log(
			'Nic nie zostało zmienione - nazwa i opis pozostały takie same'
		);
	} else if (!nameChanged) {
		console.log('Nazwa nie została zmieniona, tylko opis');
	} else if (!descChanged) {
		console.log('Opis nie został zmieniony, tylko nazwa');
	} else {
		console.log('Nazwa i opis zostały zmienione');
	}

	// Sprawdź końcowy rezultat
	expect(newName).toBe('historyjka testowa edytowana');
	expect(newDesc).toBe('historyjka testowa edytowana');
});

test('Sprawdź czy działa edytowanie zadań', async ({ page }) => {
	await page.goto('http://localhost:5173/');
	await page.getByRole('textbox', { name: 'Login' }).fill('admin');
	await page.getByRole('textbox', { name: 'Hasło' }).fill('admin123');
	await page.getByRole('button', { name: 'Zaloguj się' }).click();

	// Czekaj na załadowanie strony z projektami
	await expect(page.getByText('Wszystkie projekty')).toBeVisible();
	await expect(
		page.getByRole('button', { name: 'Wybierz projekt' }).last()
	).toBeVisible();
	await page.getByRole('button', { name: 'Wybierz projekt' }).last().click();

	// Czekaj na załadowanie historyjek
	await expect(
		page.getByRole('button', { name: 'Edytuj' }).last()
	).toBeVisible();

	await page.getByRole('button', { name: 'Zadania' }).last().click();

	await expect(
		page.getByRole('button', { name: 'Edytuj' }).last()
	).toBeVisible();

	await page.getByRole('button', { name: 'Edytuj' }).last().click();
	await page.getByRole('textbox', { name: 'Wpisz nazwę' }).click();
	await page
		.getByRole('textbox', { name: 'Wpisz nazwę' })
		.fill('zadanie test edytuj');
	await page.getByRole('textbox', { name: 'Wpisz opis' }).click();
	await page
		.getByRole('textbox', { name: 'Wpisz opis' })
		.fill('zadanie test edytuj');
	await page.getByRole('button', { name: 'Zapisz zmiany' }).click();

	await expect(
		page.getByRole('button', { name: 'Edytuj' }).last()
	).toBeVisible();
});
