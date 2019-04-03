let generateSchedule = function(date, employees, shifts, voidDays) {
	// Update Calendar txt
	let calendarTitleNode = document.getElementById('final-cal-title');
	calendarTitleNode.innerHTML = `${ months[date['month']] } - ${ date['year'] }`

	let outputNode = document.getElementsByClassName('tab-content tab5')[0];

	// clear any previous content
	while(outputNode.lastChild) {
				outputNode.removeChild(outputNode.lastChild);
	}
	var month = new Date(date['year'], date['month']);
	let daysInMonth = new Date(date['year'], date['month']+1, 0).getDate();
	let monthData = [];

	// set monthData to contain dict of keys as dayNum and shifts as values
	for (let i = 1; i <= daysInMonth; i++) {
		let day = [];
		month.setDate(i)
		dayOfWeek = month.getDay();

		// Apply shift value if applicable
		for (let j = 0; j < shifts.length; j++) {
			let shift = shifts[j];
			if (shift.daysInWeek[dayOfWeek] && !voidDays.includes(i)) {
				day.push({
					'time': shift.time,
					'numEmp': shift.numEmployees,
					'req': shift.requirements,
				});
			}
		}
		monthData.push(day);
	}


	/* ------------ generate content ------------ */
	// set week title for first week
	outputNode.appendChild(weekTitleNode(1));
	outputNode.appendChild(weekDayNode());
	var week = 2;

	// set space divs for previous month days
	month.setDate(1);
	for (let i = 0; i < month.getDay(); i++) {
		let node = document.createElement('div');
		node.classList.add('other-month');
		outputNode.appendChild(node);
	}

	// generate month days and rest of week titles
	for (let i = 0; i < monthData.length; i++) {
		// If start of the week
		month.setDate(i + 1);
		if (month.getDay() === 0 && i != 0) {
			outputNode.appendChild(weekTitleNode(week));
			outputNode.appendChild(weekDayNode());
			week++;
		}

		let dayData = monthData[i];
		let dayDataNodes = [];

		// generate day data
		for (let j = 0; j < dayData.length; j++) {
			dayDataNodes.push(shiftNode(dayData[j]['time'], employees[0]));
		}

		// append day with data
		outputNode.appendChild(workDayNode(i+1, dayDataNodes));
	}

	console.log(monthData);
}


let weekTitleNode = function(weekNum) {
	let node = document.createElement('div');
	node.classList.add('week-title');
	node.appendChild(document.createTextNode(`Week ${weekNum}`));
	return node;
}

let weekDayNode = function() {
	let node = document.createElement('div');
	node.classList.add('weekdays', 'tab5');
	let weekDays = [
		'Sun', 'Mon', 'Tue', 'Wed',
		'Thu', 'Fri', 'Sat',
	];
	for (let i = 0; i < weekDays.length; i++) {
		let innerNode = document.createElement('div');
		innerNode.appendChild(document.createTextNode(weekDays[i]));
		node.appendChild(innerNode);
	}
	return node;
}

let workDayNode = function(dayNum, shiftNodes) {
	// create day node
	let node = document.createElement('div');
	node.classList.add('day', 'tab5');

	// append day of month (first child)
	let innerNode = document.createElement('div');
	innerNode.appendChild(document.createTextNode(dayNum));
	node.appendChild(innerNode);

	// append shift nodes as children
	for (let i = 0; i < shiftNodes.length; i++) {
		node.appendChild(shiftNodes[i]);
	}
	return node;
}

let shiftNode = function(time, ...employees) {
	let shift = document.createElement('div');
	shift.classList.add('tab5', 'shift');
	/* ------------ create time div ------------ */
	// outerNode
	let timeNode = document.createElement('div');
	timeNode.classList.add('time');

	// 'Time:' txt node
	let timeTxt = document.createElement('div');
	timeTxt.appendChild(document.createTextNode('Time:'));
	timeNode.appendChild(timeTxt);
	// work times txt node
	let workTimes = document.createElement('div');
	workTimes.appendChild(document.createTextNode(`${ prettyPrintTime(time['start']) } - ${ prettyPrintTime(time['end']) }`));
	workTimes.classList.add('work-times')
	timeNode.appendChild(workTimes);

	shift.appendChild(timeNode);

	/* ------------ create employees div ------------ */

	return shift;
}