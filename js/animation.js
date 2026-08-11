let wrapper, detailsLink, detailsActionsItems, wrapperTop = 0
let wrapperHeight = 0;

let ticking = false;
let isDisabled = false;

function measure() {
	wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
	wrapperHeight = wrapper.offsetHeight;
}

window.addEventListener('resize', measure);

window.addEventListener('load', function () {
	wrapper = document.querySelector('.pinned-wrapper');
	detailsLink = document.querySelector('#details-button');
	detailsActionsItems = document.querySelectorAll('.details-actions-item');
	measure()
	updateProgress()
}, false);



function onScroll() {
	if (!ticking) {
		requestAnimationFrame(updateProgress);
		ticking = true;
	}
}


function updateProgress() {
	
	const scrollableRange = wrapperHeight - window.innerHeight;
	let progress = (window.scrollY - wrapperTop) / scrollableRange;
	progress = Math.min(1, Math.max(0, progress));
	if (progress < 0.005) {progress = 0};

	wrapper.style.setProperty('--t', progress);

	const shouldDisable = progress > 0.1;
	if (shouldDisable !== isDisabled) {
		isDisabled = shouldDisable;
	if (isDisabled) {
		detailsLink.classList.add('disabled-link');
		detailsLink.setAttribute('aria-disabled', 'true');
		detailsLink.setAttribute('tabindex', '-1');

		// .details-actions-item elements are the mirror case: they're
		// invisible (opacity 0, transformed off-screen) below this same
		// threshold, so they go the opposite direction — becoming reachable
		// only once the reveal has actually started, instead of sitting in
		// the tab order as invisible dead stops.
		detailsActionsItems.forEach(function (el) {
			el.classList.remove('disabled-link');
			el.removeAttribute('aria-disabled');
			el.removeAttribute('tabindex');
		});
	} else {
		detailsLink.classList.remove('disabled-link');
		detailsLink.removeAttribute('aria-disabled');
		detailsLink.removeAttribute('tabindex');

		detailsActionsItems.forEach(function (el) {
			el.classList.add('disabled-link');
			el.setAttribute('aria-disabled', 'true');
			el.setAttribute('tabindex', '-1');
		});
	}
	}

	ticking = false;
}

window.addEventListener('scroll', onScroll, { passive: true });
