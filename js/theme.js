(function () {
	const themeToggle = document.querySelector('.btn--display-mode-toggle');
	const themeColorMetas = document.querySelectorAll('meta[name="theme-color"]');
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

	function syncThemeColorMeta() {
		const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg-color').trim();
		if (!bg) return;
		themeColorMetas.forEach(function (meta) {
			// Once JS is driving the theme, our resolved class (which may
			// reflect a manual override) is authoritative over the OS
			// media query these tags started with.
			meta.removeAttribute('media');
			meta.setAttribute('content', bg);
			// iOS Safari caches the chrome color and won't reliably repaint
			// it from an in-place attribute change alone; re-inserting the
			// node forces a re-read.
			meta.parentNode.appendChild(meta);
		});
	}

	function setTheme(isDark) {
		document.documentElement.classList.toggle('dark', isDark);
		themeToggle.setAttribute('aria-pressed', String(isDark));
		syncThemeColorMeta();
	}

	// The inline <head> script already applied the right class before paint;
	// this brings the button and theme-color meta tags in sync with that choice.
	setTheme(document.documentElement.classList.contains('dark'));

	themeToggle.addEventListener('click', function () {
		const isDark = !document.documentElement.classList.contains('dark');
		localStorage.setItem('color-scheme', isDark ? 'dark' : 'light');
		setTheme(isDark);
	});

	// Follow the OS setting live, but only for visitors who haven't made an explicit choice.
	prefersDark.addEventListener('change', function (event) {
		if (localStorage.getItem('color-scheme')) return;
		setTheme(event.matches);
	});
})();
