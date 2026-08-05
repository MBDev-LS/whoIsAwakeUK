
console.log('LOADED JS')

let wrapper, detailsLink, wrapperTop = 0
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
	measure() 
	updateProgress()
	console.log('LOADED HTML')
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
	} else {
		detailsLink.classList.remove('disabled-link');
		detailsLink.removeAttribute('aria-disabled');
		detailsLink.removeAttribute('tabindex');
	}
	}
	

	console.log(progress)
	ticking = false;
}

window.addEventListener('scroll', onScroll, { passive: true });
