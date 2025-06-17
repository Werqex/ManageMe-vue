export const disableScroll = () => {
	// Zapisz aktualną pozycję scroll'a
	const scrollY = window.scrollY;

	// Dodaj style do body
	document.body.style.position = 'fixed';
	document.body.style.top = `-${scrollY}px`;
	document.body.style.width = '100%';
	document.body.style.overflow = 'hidden';

	// Zapisz pozycję w atrybucie dla późniejszego przywrócenia
	document.body.setAttribute('data-scroll-y', scrollY.toString());
};

export const enableScroll = () => {
	// Przywróć style body
	document.body.style.position = '';
	document.body.style.top = '';
	document.body.style.width = '';
	document.body.style.overflow = '';

	// Przywróć pozycję scroll'a
	const scrollY = document.body.getAttribute('data-scroll-y');
	if (scrollY) {
		window.scrollTo(0, parseInt(scrollY));
		document.body.removeAttribute('data-scroll-y');
	}
};
