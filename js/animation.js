
console.log('LOADED JS')

let wrapper
let detailsLink = document.querySelector('#details-button');

window.addEventListener('load', function () {
	wrapper = document.querySelector('.pinned-wrapper');
	detailsLink = document.querySelector('#details-button');
	updateProgress()
	console.log('LOADED HTML')
}, false);


let ticking = false;

function onScroll() {
	if (!ticking) {
		requestAnimationFrame(updateProgress);
		ticking = true;
	}
}

function updateProgress() {
	const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
	const budget = window.innerHeight;
	let progress = (window.scrollY - wrapperTop) / budget;
	progress = Math.min(1, Math.max(0, progress));
	document.documentElement.style.setProperty('--t', progress);

	// Don't love that at least one of these
	// runs every time. Ideally it would only run
	// at the point the link disppears. Unfortunately
	// initial attempts to do it based on progress
	// movement (lastProgress vs progress) did not
	// work.
	if (progress > 0.1) {
		detailsLink.classList.add('disabled-link');
        detailsLink.setAttribute('aria-disabled', 'true'); // For screen readers
        detailsLink.setAttribute('tabindex', '-1');        // Skips keyboard tabbing
	} else {
		detailsLink.classList.remove('disabled-link');
        detailsLink.removeAttribute('aria-disabled');
        detailsLink.removeAttribute('tabindex');
	}
	

	console.log(progress)
	ticking = false;
}

window.addEventListener('scroll', onScroll);
