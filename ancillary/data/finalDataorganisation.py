
import json
from pprint import pprint

from datetime import datetime

with open('ancillary/data/finalData.json') as jsonFile:
	inputDataDict = json.loads(jsonFile.read())

SHORT_HEADERS = inputDataDict['meta']['shortHeadings']


def processTimeseriesToJson(timeSeriesList: list[list]) -> dict:
	outputTimeseriesDict = {}

	for timeEntryList in timeSeriesList:
		timeEntryDict = {}

		for i in range(1, len(timeEntryList)):
			timeEntryDict[SHORT_HEADERS[i]] = timeEntryList[i]

		outputTimeseriesDict[timeEntryList[0]] = timeEntryDict

	return outputTimeseriesDict


def sortTimeseriesData(timeSeriesList: list[list]) -> list:
	for timeEntryList in timeSeriesList:
		timeEntryList.append(datetime.strptime(timeEntryList[0], r'%H:%M'))

	sortedTimeseriesList = sorted(timeSeriesList, key=lambda timeEntryList: timeEntryList[-1])

	for timeEntryList in timeSeriesList:
		timeEntryList.pop(0)
		timeEntryList.pop(-1)

	return sortedTimeseriesList
	


newOutDict = {
	'meta': {
		'start': '00:00',
		'minuteInterval': 10,
		'shortHeadings': inputDataDict['meta']['shortHeadings'],
		'verboseActivities': inputDataDict['meta']['verboseActivities']
	},
	'data': {}
}


for dataKey in inputDataDict['data']:
	# pprint(sortTimeseriesData(inputDataDict['data'][dataKey]))

	newOutDict['data'][dataKey] = sortTimeseriesData(inputDataDict['data'][dataKey])




with open('data/finalData_FINAL-THISONE.json', 'w+') as f:
	f.write(json.dumps(newOutDict))