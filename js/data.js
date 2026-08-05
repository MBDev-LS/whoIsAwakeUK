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


function updateCurrentlyAwake() {
	let now = new Date();
	let hours = now.getHours();
	let minutes = now.getMinutes();
	let dayOfTheWeek = now.getDay()

	let isWeekday = dayOfTheWeek !== 0 && dayOfTheWeek !== 6

	let currentTimeIndex = hours * 6 + Math.floor(minutes / 10)

	let currentTimeDataEntry = activityDataset['data']['weekday'][currentTimeIndex]

	console.log(hours, minutes)
	console.log(activityDataset['data']['weekday'][currentTimeIndex])
}

(async () => {
	activityDataset = await loadSleepData();

	updateCurrentlyAwake();
	setInterval(updateCurrentlyAwake, 60000);
})();



// let DateTime = luxon.DateTime;

// let dayOfTheWeek = DateTime.now().weekday
// let isWeekday = dayOfTheWeek <= 5

// let datetimeNow = DateTime.now()

// let minuteToNearestTen = Math.round(datetimeNow.minute / 10) * 10;
// let hourString

// if (minuteToNearestTen === 60) {
// 	let roundedHourValue = (datetimeNow.hour + 1) % 24;
// 	hourString = roundedHourValue.toString().padStart(2, '0') + ':';
// 	minuteToNearestTen = 0;
// } else {
// 	hourString = datetimeNow.toFormat('HH:');
// }


// let fullTimeString = hourString + minuteToNearestTen.toString().padStart(2, '0');

// console.log(isWeekday, fullTimeString);

// (async () => {
// 	let currentTimeLog = await loadSleepData()
// 	console.log(currentTimeLog.meta)

// 	if (!currentTimeLog) {
// 		return;
// 	}

// 	let percentageCurrentlyAwake = 100 - Math.round(currentTimeLog[1])
// 	let percentageCurrentlyAwakeText = percentageCurrentlyAwake.toString()

// 	$('#mainPercentageValue').text(`${percentageCurrentlyAwake}%`)
// })();