import { test, expect } from '@playwright/test';

test('Sprawdź czy działa usuwanie projektów', async ({ page }) => {
	await page.goto('http://localhost:5173/');
	await page.getByRole('textbox', { name: 'Login' }).fill('admin');
	await page.getByRole('textbox', { name: 'Hasło' }).fill('admin123');
	await page.getByRole('button', { name: 'Zaloguj się' }).click();

	await expect(
		page.getByRole('button', { name: 'Wybierz projekt' }).last()
	).toBeVisible();

	// Policz projekty po załadowaniu danych
	const initialProjectCount = await page
		.getByRole('button', { name: 'Wybierz projekt' })
		.count();

	await page.getByRole('button', { name: 'Usuń' }).last().click();

	await expect(
		page.getByRole('button', { name: 'Wybierz projekt' })
	).toHaveCount(initialProjectCount - 1);
});

test('Sprawdź czy działa usuwanie historyjek', async ({ page }) => {
	await page.goto('http://localhost:5173/');
	await page.getByRole('textbox', { name: 'Login' }).fill('admin');
	await page.getByRole('textbox', { name: 'Hasło' }).fill('admin123');
	await page.getByRole('button', { name: 'Zaloguj się' }).click();

	await expect(
		page.getByRole('button', { name: 'Wybierz projekt' }).last()
	).toBeVisible();

	await page.getByRole('button', { name: 'Wybierz projekt' }).last().click();

	await expect(
		page.getByRole('button', { name: 'Zadania' }).last()
	).toBeVisible();

	// Policz historyjki przed dodaniem
	const initialStoryCount = await page
		.getByRole('button', { name: 'Zadania' })
		.count();

	await page.getByRole('button', { name: 'Usuń' }).last().click();

	await expect(page.getByRole('button', { name: 'Zadania' })).toHaveCount(
		initialStoryCount - 1
	);
});

test('Sprawdź czy działa usuwanie zadań', async ({ page }) => {
	await page.goto('http://localhost:5173/');
	await page.getByRole('textbox', { name: 'Login' }).fill('admin');
	await page.getByRole('textbox', { name: 'Hasło' }).fill('admin123');
	await page.getByRole('button', { name: 'Zaloguj się' }).click();

	await expect(
		page.getByRole('button', { name: 'Wybierz projekt' }).last()
	).toBeVisible();

	await page.getByRole('button', { name: 'Wybierz projekt' }).last().click();

	await expect(
		page.getByRole('button', { name: 'Zadania' }).last()
	).toBeVisible();

	await page.getByRole('button', { name: 'Zadania' }).last().click();

	await expect(page.getByRole('button', { name: 'Usuń' }).last()).toBeVisible();

	// Pobierz tekst przed usunięciem
	const todoTextBefore = await page.locator('text=Do zrobienia').textContent();
	const doingTextBefore = await page.locator('text=W trakcie').textContent();
	const doneTextBefore = await page.locator('text=Zakończone').textContent();

	// Usuń zadanie
	await page.getByRole('button', { name: 'Usuń' }).last().click();

	// Poczekaj aż którykolwiek z nagłówków się zmieni (zamiast waitForTimeout)
	await page.waitForFunction(
		({ todo, doing, done }) => {
			const todoElement = document.querySelector('h4');
			const todoAfter = Array.from(document.querySelectorAll('h4')).find((h) =>
				h.textContent?.includes('Do zrobienia')
			)?.textContent;
			const doingAfter = Array.from(document.querySelectorAll('h4')).find((h) =>
				h.textContent?.includes('W trakcie')
			)?.textContent;
			const doneAfter = Array.from(document.querySelectorAll('h4')).find((h) =>
				h.textContent?.includes('Zakończone')
			)?.textContent;

			return todoAfter !== todo || doingAfter !== doing || doneAfter !== done;
		},
		{
			todo: todoTextBefore,
			doing: doingTextBefore,
			done: doneTextBefore,
		}
	);

	// Pobierz teksty po usunięciu
	const todoTextAfter = await page.locator('text=Do zrobienia').textContent();
	const doingTextAfter = await page.locator('text=W trakcie').textContent();
	const doneTextAfter = await page.locator('text=Zakończone').textContent();

	// Sprawdź czy którykolwiek tekst się zmienił
	const hasChanged =
		todoTextBefore !== todoTextAfter ||
		doingTextBefore !== doingTextAfter ||
		doneTextBefore !== doneTextAfter;

	// Sprawdź z której kolumny zostało usunięte zadanie
	if (todoTextBefore !== todoTextAfter) {
		console.log('Zadanie zostało usunięte z kolumny "Do zrobienia"');
	} else if (doingTextBefore !== doingTextAfter) {
		console.log('Zadanie zostało usunięte z kolumny "W trakcie"');
	} else if (doneTextBefore !== doneTextAfter) {
		console.log('Zadanie zostało usunięte z kolumny "Zakończone"');
	}

	// Główna asercja - sprawdź czy nastąpiła jakakolwiek zmiana
	expect(hasChanged).toBe(true);
});
