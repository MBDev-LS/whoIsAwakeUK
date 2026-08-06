// activityDataset comes from js/activityData.js, loaded just before this file.

const UK_ADULT_POPULATION = 54_000_000; // TODO: approximate adult (18+) UK population — verify/update against a current ONS estimate.

let showAsHeadcount = false;

function formatCount(count) {
	if (count >= 1_000_000) {
		return `${(count / 1_000_000).toFixed(1)} million`;
	}
	return Math.round(count).toLocaleString('en-GB');
}

function formatStat(percentage, baseCount) {
	return showAsHeadcount
		? formatCount(baseCount * (percentage / 100))
		: `${Math.round(percentage)}%`;
}

function updatePage(percentageAwake, activitiesDictsList) {
	document.body.classList.toggle('numbers-mode', showAsHeadcount);

	document.querySelector('#mainPercentageValue').textContent = formatStat(percentageAwake, UK_ADULT_POPULATION);

	const peopleAwakeCount = UK_ADULT_POPULATION * (percentageAwake / 100);

	const activityList = document.querySelector('.activity-list');
	const itemTemplate = document.querySelector('#activity-item-template');

	activityList.replaceChildren();

	for (const activity of activitiesDictsList) {
		const item = itemTemplate.content.cloneNode(true);

		item.querySelector('.activity-number data').textContent = formatStat(activity.percentOfAwake, peopleAwakeCount);
		item.querySelector('.activity-group').textContent = activity.verboseActivity;

		activityList.appendChild(item);
	}
}


function updateCurrentlyAwake() {
	let now = new Date();
	let hours = now.getHours();
	let minutes = now.getMinutes();
	let dayOfTheWeek = now.getDay();

	let isWeekday = dayOfTheWeek !== 0 && dayOfTheWeek !== 6;

	let currentTimeIndex = hours * 6 + Math.floor(minutes / 10);

	let currentTimeDataEntry = activityDataset['data']['weekday'][currentTimeIndex];

	let percentageAwake = 100 - currentTimeDataEntry[0]

	let activitiesDictsList = [];

	for (let i = 1; i < currentTimeDataEntry.length; i++) {
		const rawActivityPercent = currentTimeDataEntry[i];
		let currentActivityDict = {
			'verboseActivity': activityDataset['meta']['verboseActivities'][i],
			'currentRawPercentage': rawActivityPercent,
			'percentOfAwake': Math.round(rawActivityPercent / percentageAwake * 100)
		};

		// console.log(currentActivityDict)
		
		activitiesDictsList.push(currentActivityDict);
	};
	console.log(activitiesDictsList)
	activitiesDictsList.sort((a, b) => b.currentRawPercentage - a.currentRawPercentage)
	console.log(activitiesDictsList)

	updatePage(percentageAwake, activitiesDictsList);

	console.log(hours, minutes);
	console.log(activityDataset['data']['weekday'][currentTimeIndex]);
}

const switchToNumbersButton = document.querySelector('#switch-numbers-toggle');
switchToNumbersButton.addEventListener('click', () => {
	showAsHeadcount = !showAsHeadcount;
	switchToNumbersButton.innerHTML = showAsHeadcount ? 'Switch to<br>percentages' : 'Switch to<br>numbers';
	updateCurrentlyAwake();
});

updateCurrentlyAwake();
setInterval(updateCurrentlyAwake, 60000);

