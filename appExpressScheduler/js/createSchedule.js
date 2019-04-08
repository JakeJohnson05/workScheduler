var lastData;
let generateSchedule = function(date, employees, shifts, voidDays) {
	// var employees = emps;
	var shiftTrialMax = 30;
	// Update Calendar txt
	let calendarTitleCtn = document.getElementById('final-cal-title');
	while (calendarTitleCtn.lastChild) calendarTitleCtn.removeChild(calendarTitleCtn.lastChild);
	let calendarTitleNode = document.createElement('div');
	calendarTitleNode.innerHTML = `${ months[date['month']] } - ${ date['year'] }`;
	calendarTitleCtn.appendChild(calendarTitleNode);

	let outputNode = document.getElementsByClassName('tab-content tab5')[0];
	// clear any previous content
	while(outputNode.lastChild) outputNode.removeChild(outputNode.lastChild);

	var finalMonth = new Date(date['year'], date['month']);
	let daysInMonth = new Date(date['year'], date['month']+1, 0).getDate();
	var monthData = [];

	// set monthData to contain dict of keys as dayNum and shifts as values
	for (let i = 1; i <= daysInMonth; i++) {
		let day = [];
		finalMonth.setDate(i);
		dayOfWeek = finalMonth.getDay();

		// Apply shift value if applicable
		for (let j = 0; j < shifts.length; j++) {
			let shift = shifts[j];
			if (shift.daysInWeek[dayOfWeek] && !voidDays.includes(i)) {
				day.push({
					'time': shift.time,
					'totalMins': shift.shiftLength,
					'numEmp': shift.numEmployees,
					'req': shift.requirements,
					'empList': [],
					'date': i
				});
			}
		}
		monthData.push(day);
	}

	// get monthData in 3d array [[week1], [week2],...]
	var monthDataByWeek = getMonthDataByWeek(monthData, (new Date(date['year'], date['month'], 1)).getDay(), daysInMonth);


	/* ------------ Actual assigning emps to shifts ------------ */
	var weekEmpSumList = [];
	var day;
	var shift;
	var week;
	var shiftEmpTrialCounter;


	for (let k = 0; k < monthDataByWeek.length; k++) {
		week = monthDataByWeek[k];
		for (let i = 0; i < week.length; i++) {
			day = week[i];
			if (!day) continue;
			for (let empIndex = 0; empIndex < employees.length; empIndex++) {
				employees[empIndex].hasWorked = false;
			}

			for (let j = 0; j < day.length; j++) {
				shift = day[j];

				shiftEmpTrialCounter = 0;
				while (shift.numEmp > shift.empList.length) {
					shiftEmpTrialCounter++;
					var empToTest = getRandItemInList(employees);

					if (shiftEmpTrialCounter === shiftTrialMax - employees.length - 1) {
						console.log(`Warning: shift trial counter cap almost maxed: Week/Day/Shift/Counter: ${k}/${i}/${j}/${shiftEmpTrialCounter}`);
						employees.sort(Employee.sortPercMinsRemain);
						empToTest = employees[shiftTrialMax - shiftEmpTrialCounter];
					}

					if (!empToTest.hasWorked && empToTest.maxMins > (empToTest.minsThisWeek + Number(shift['totalMins']))) {
						empToTest.hasWorked = true;
						empToTest.minsThisWeek = Number(shift.totalMins);
						shift.empList.push(empToTest.name);
					}

					if (shiftEmpTrialCounter === shiftTrialMax) {
						shift.empList.push("Failed after: " + shiftEmpTrialCounter + " attempts.");
						break;
					}
				}
			}
		}

		var thisWeek = [];
		for (let i = 0; i < employees.length; i++) {
			thisWeek.push({
				'name': employees[i].name,
				'hours': employees[i].minsThisWeek
			});
			employees[i].setMinsThisWeek = 0;
		}
		weekEmpSumList.push(thisWeek);
	}

	/* ------------ generate content ------------ */
	// set week title for first week
	outputNode.appendChild(weekTitleNode(1));
	outputNode.appendChild(weekDayNode());
	var week = 2;

	// set space divs for previous month days
	finalMonth.setDate(1);
	for (let i = 0; i < finalMonth.getDay(); i++) {
		let node = document.createElement('div');
		node.classList.add('other-month');
		outputNode.appendChild(node);
	}

	// generate month days and rest of week titles
	for (let i = 0; i < monthData.length; i++) {
		// If start of the week
		finalMonth.setDate(i + 1);
		if (finalMonth.getDay() === 0 && i != 0) {
			outputNode.appendChild(weekTitleNode(week));
			outputNode.appendChild(weekDayNode());
			week++;
		}

		let dayData = monthData[i];
		let dayDataNodes = [];

		// generate day data
		for (let j = 0; j < dayData.length; j++) {
			dayDataNodes.push(shiftNode(dayData[j].time, dayData[j].totalMins, dayData[j].empList));
		}

		// append day with data
		outputNode.appendChild(workDayNode(i+1, dayDataNodes));
	}

}

/**
* Get a random item from an array.
*
* @param {Array<any>}	array	The array to select items from.
*
* @return {any}			item	The item chosen from the array.
*/
var getRandItemInList = function(array) {
	if (!Array.isArray(array)) throw Error("getRandItemInList(array) - Parameter must be an array.");
	if (Array.length === 0) throw Error("getRandItemInList(array) - array must contain at least 1 item");
	return array[Math.floor(Math.random()*array.length)];
}

let getMonthDataByWeek = function(monthArray, firstDayOfWeek, daysInMonth) {
	let monthDataByWeek = [];

	// Push remaining days from last month to firstWeek
	let firstWeek = [];
	for (let i =0; i < firstDayOfWeek; i++) firstWeek.push(null);

	// Push remaining actual days to firstWeek
	var i = 0;
	while (firstWeek.length < 7) {
		firstWeek.push(monthArray[i]);
		i++;
	}
	monthDataByWeek.push(firstWeek);

	// Add rest of monthArray
	var weekArray = [];
	while (i < monthArray.length) {
		// Add next day to weekArray
		weekArray.push(monthArray[i]);
		i++;

		// If weekArray.len = 7, push weekArray and clear weekArray
		if (weekArray.length === 7) {
			monthDataByWeek.push(weekArray);
			weekArray = [];
		}
	}

	// push any possible remaining days IF week not finished
	if (weekArray.length > 0) monthDataByWeek.push(weekArray);

	return monthDataByWeek;
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
	let weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

let round = function (value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

let shiftNode = function(time, shiftLength, employees) {
	let shift = document.createElement('div');
	shift.classList.add('tab5', 'shift');

	/* ------------ create time div ------------ */
	// outerNode
	let timeNode = document.createElement('div');
	timeNode.classList.add('time');

	// 'Time:' txt node
	let timeTxt = document.createElement('div');
	timeTxt.innerHTML = 'Time: <span style="font-size:60%;color:#000">(' + round(shiftLength / 60, 1) +' hrs)</span>'
	timeNode.appendChild(timeTxt);

	// work times node
	let workTimes = document.createElement('div');
	workTimes.appendChild(document.createTextNode(`${ prettyPrintTime(time['start']) }
		- ${ prettyPrintTime(time['end']) }`));
	workTimes.classList.add('work-times')
	timeNode.appendChild(workTimes);


	/* ------------ create employees div ------------ */
	// outerNode
	let empNode = document.createElement('div');
	empNode.classList.add('emp');

	// 'Employees:' txt node
	let empTxt = document.createElement('div');
	empTxt.innerHTML = 'Employees:';
	empNode.appendChild(empTxt);

	// node of actual employees
	let shiftEmployees = document.createElement('div');
	shiftEmployees.classList.add('employee-list');
	var empListTxt = '';

	for (empIndex = 0; empIndex < employees.length; empIndex++) {
		if (empIndex != 0) empListTxt += ', ';
		empListTxt += employees[empIndex];
	}

	shiftEmployees.innerHTML = empListTxt;
	empNode.appendChild(shiftEmployees);

	shift.appendChild(timeNode);
	shift.appendChild(empNode);
	return shift;
}
