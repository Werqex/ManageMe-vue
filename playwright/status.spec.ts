import { test, expect } from '@playwright/test';

test('Sprawdź czy działa zmiana statusu zadań', async ({ page }) => {
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
	const doingTextBefore = await page.locator('text=W trakcie').textContent();
	const doneTextBefore = await page.locator('text=Zakończone').textContent();

	// Usuń zadanie
	await page.getByRole('button', { name: 'Zakończ' }).last().click();

	// Poczekaj aż którykolwiek z nagłówków się zmieni (zamiast waitForTimeout)
	await page.waitForFunction(
		({ doing, done }) => {
			const todoElement = document.querySelector('h4');
			const doingAfter = Array.from(document.querySelectorAll('h4')).find((h) =>
				h.textContent?.includes('W trakcie')
			)?.textContent;
			const doneAfter = Array.from(document.querySelectorAll('h4')).find((h) =>
				h.textContent?.includes('Zakończone')
			)?.textContent;

			return doingAfter !== doing || doneAfter !== done;
		},
		{
			doing: doingTextBefore,
			done: doneTextBefore,
		}
	);

	// Pobierz teksty po usunięciu
	const doingTextAfter = await page.locator('text=W trakcie').textContent();
	const doneTextAfter = await page.locator('text=Zakończone').textContent();

	// Sprawdź czy którykolwiek tekst się zmienił
	const hasChanged =
		doingTextBefore !== doingTextAfter || doneTextBefore !== doneTextAfter;

	// Sprawdź z której kolumny zostało usunięte zadanie
	if (doingTextBefore !== doingTextAfter && doneTextBefore !== doneTextAfter) {
		console.log('Zadanie zostało przeniesiane z "W trakcie" do "Zakończone"');
	}

	// Główna asercja - sprawdź czy nastąpiła jakakolwiek zmiana
	expect(hasChanged).toBe(true);
});
