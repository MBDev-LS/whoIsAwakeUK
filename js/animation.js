
console.log('LOADED JS')

let wrapper

window.addEventListener('load', function () {
	wrapper = document.querySelector('.pinned-wrapper');
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

	console.log(progress)
	ticking = false;
}

window.addEventListener('scroll', onScroll);