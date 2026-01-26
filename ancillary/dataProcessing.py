
import json

with open('ancillary/notepad.json', 'r') as f:
	oldFileList = json.loads(f.read())

newFileList = [oldFileList[0]]
oldFileList.pop(0)

for oldlst in oldFileList:
	newList = [item if i == 0 else float(item) for i, item in enumerate(oldlst)]

	newFileList.append(newList)


with open('ancillary/notepadOutput.json', 'w') as f:
	f.write(json.dumps(newFileList))

