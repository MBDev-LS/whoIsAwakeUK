async function loadSleepData() {
	try {
		const response = await fetch("/data/finalData_FINAL-THISONE.json");
		if (!response.ok) {
		throw new Error(`Failed to fetch data: ${response.status}`);
		}
		const sleepData = await response.json();
		return sleepData;
	} catch (error) {
		console.error("Could not load sleep data:", error);
	}
}


let activityDataset;


function updatePage(roundedPercentageAwake, activitiesDictsList) {
	document.querySelector('#mainPercentageValue').textContent = `${roundedPercentageAwake}%`

	const activityList = document.querySelector('.activity-list');
	const itemTemplate = document.querySelector('#activity-item-template');

	activityList.replaceChildren();

	for (const activity of activitiesDictsList) {
		const item = itemTemplate.content.cloneNode(true);

		item.querySelector('.activity-number data').textContent = `${activity.percentOfAwake}%`;
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
	let roundedPercentageAwake = Math.round(percentageAwake)

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

	updatePage(roundedPercentageAwake, activitiesDictsList);

	console.log(hours, minutes);
	console.log(activityDataset['data']['weekday'][currentTimeIndex]);
}

(async () => {
	activityDataset = await loadSleepData();

	updateCurrentlyAwake();
	setInterval(updateCurrentlyAwake, 60000);
})();

