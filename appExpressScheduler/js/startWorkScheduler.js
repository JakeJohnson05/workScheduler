// Global variables
var currentTab = 0;
var visitedTabs = [false, false, false, false]
var employeeCopy;
var shiftCopy;
var shiftRestrictionCopy;
let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEK_ABV = ['su','mo','tu','we','th','fr','sa'];
let classifList = [
	'Associate',
	'Owner',
	'Manager',
	'Supervisor',
	'New Hire',
	'Assistant',
	'Clerk',
	'Receptionist',
	'Coordinator',
	'Administrator',
	'President',
	'Specialist',
]

let createYearOptions = function(currentYear) {
	let selectNode = document.getElementsByClassName('tab0 year input-field')[0].getElementsByClassName('data')[0];
	let optionNode;

	for (let i = 0; i < 5; i++) {
		optionNode = document.createElement('option');
		optionNode.value = optionNode.innerHTML = currentYear + i;
		selectNode.appendChild(optionNode);
	}
}

let createYearOptionsOnNode = function(node) {
	let currentYear = new Date.getFullYear();
	let optionNode;
	for (let i = 0; i < 5; i++) {
		optionNode = document.createElement('option');
		optionNode.value = optionNode.innerHTML = currentYear + i;
		node.appendChild(optionNode);
	}
}

let setTab = function(tab) {
	let formTabs = document.getElementsByClassName('form-tab');
	for (let i=0; i < formTabs.length; i++) {
		formTabs[i].style.display = (i === tab) ? 'grid' : 'none';
	}

	currentTab = tab;
	fixProgressBar();

	// set up tab as 'new' if it hasn't been visited
	if (!visitedTabs[currentTab]) {
		setUpCurrentTab();
		visitedTabs[currentTab] = true;
	}

	// change navigation buttons and progressbar due to current tab
	let backBtn = document.getElementById('back-button');
	let nextBtn = document.getElementById('next-button');
	let progressBar = document.getElementById('progress-container');

	backBtn.style.display = 'block';
	nextBtn.style.display = 'block';
	nextBtn.innerHTML = '<span>next &raquo;</span>';
	progressBar.style.display = 'block';
	nextBtn.onclick = () => nextTab();

	switch(currentTab) {
		case 0:
			backBtn.style.display = 'none';
			break;
		case 4:
			nextBtn.innerHTML = '<span>submit &raquo;</span>';
			nextBtn.onclick = () => {
				nextTab();
				consoleData();
			}
			break;
		case 5:
			nextBtn.style.display = 'none';
			progressBar.style.display = 'none';
			break;
	}
}

let nextTab = function() {
	if (isTabValid()){
		setTab((currentTab === 5) ? 5 : currentTab + 1);
	}
}

let prevTab = () => setTab((currentTab === 0) ? 0 : currentTab - 1);

let isTabValid = function () {
	let tabList = document.getElementsByClassName('form-tab');
	let requiredList;

	switch(currentTab) {
		case 0:
			return true;
			break;
		case 1:
			requiredList = tabList[1].getElementsByClassName('validate');
			let valid = true;
			let nameField;
			for (let i = 0; i < requiredList.length; i++) {
				nameField = requiredList[i];
				if (nameField.value.trim() === '') {
					nameField.classList.add('invalid');
					valid = false;
				} else {
					nameField.classList.remove('invalid');
				}
			}
			return valid;
			break;
		case 2:
			console.log(`tab 2 has defualted to true\nFIX:\n	Multiple 'at least' restrictions totaling larger than total employees`);
			return true;
			break;
		default:
			console.log(`tab ${currentTab} has defaulted to true`);
			return true;
	}
}

let setUpCurrentTab = function() {
	switch(currentTab) {
		case 0:
			break;
		case 1:
			generateEmpNoWorkNodes();
			employeeCopy = document.getElementsByClassName('employee')[0].cloneNode(true);
			break;
		case 2:
			shiftRestrictionCopy = document.getElementsByClassName('shift')[0].getElementsByClassName('shift-restriction')[0].cloneNode(true);
			deleteNode(document.getElementsByClassName('shift')[0].getElementsByClassName('shift-restriction')[0]);
			shiftCopy = document.getElementsByClassName('shift')[0].cloneNode(true);
			createShiftTimeSlider(document.getElementsByClassName('shift')[0]);
			break;
		case 3:
			let selects = document.getElementsByClassName('tab-content tab0')[0].getElementsByTagName('select');
			let titles = document.getElementsByClassName('tab-content tab3')[0].getElementsByClassName('title');
			titles[0].innerHTML = months[selects[0].value];
			titles[1].innerHTML = selects[1].value;

			let calContent = document.getElementsByClassName('calendar-content tab3')[0];
			while(calContent.lastChild) calContent.removeChild(calContent.lastChild);
			generateTab3Cal(Number(selects[0].value), Number(selects[1].value))
			break;
	}
}

let consoleData = function() {
	let tabList = document.getElementsByClassName('form-tab');
	let calendarData = {
		'date': {},
		'employees': [],
		'shifts': [],
		'voidDays': [],
	}

	// Tab 0
	let selectList = tabList[0].getElementsByTagName('select');
	calendarData['date'] = {
		'month': Number(selectList[0].value),
		'year': Number(selectList[1].value),
	}

	//tab1
	let employeeList = tabList[1].getElementsByClassName('employee');
	let empoyeeData;
	for (let i = 0; i < employeeList.length; i++) {
		employeeData = employeeList[i].getElementsByClassName('data');
		let newEmp = Employee.listToEmployee.apply(this, employeeData);
		let empDaysUnav = employeeList[i].getElementsByClassName('emp-days-ctn')[0].getElementsByClassName('selected');
		for (let j = 0; j < empDaysUnav.length; j++) {
			newEmp.addRestrictions(Number(empDaysUnav[j].getAttribute('value')));
		}
		calendarData['employees'].push(newEmp);
	}

	//tab2
	let shiftList = tabList[2].getElementsByClassName('shift');
	let shiftData;
	let getV = node => Number(node.getAttribute('value'));

	for (let i = 0; i < shiftList.length; i++) {
		let shift = shiftList[i];
		let shiftData = shift.getElementsByClassName('data');
		let days = [3,4,5,6,7,8,9].map(i => shiftData[i].checked);

		let reqList = [];
		let options = ['At Least', 'Only', 'At Most'];

		let shiftRestrictions = shift.getElementsByClassName('shift-restriction');
		for (let j = 0; j < shiftRestrictions.length; j++) {
			let restrictionData = shiftRestrictions[j].getElementsByClassName('data');
			reqList.push([
				options[Number(restrictionData[0].value)],
				getV(restrictionData[1]),
				Number(restrictionData[2].value),
			]);
		}

		calendarData['shifts'].push(new Shift(getV(shiftData[0]), getV(shiftData[1]), getV(shiftData[2]), days, reqList));
	}

	//tab3
	let voidDays = tabList[3].getElementsByClassName('calendar-content')[0].getElementsByClassName('selected');
	for (let i = 0; i < voidDays.length; i++) {
		calendarData['voidDays'].push(Number(voidDays[i].textContent));
	}

	generateSchedule(calendarData['date'], calendarData['employees'], calendarData['shifts'], calendarData['voidDays']);
}

let fixProgressBar = function() {
	let barWidths = ['10%', '25%', '50%', '70%', '100%'];
	let barTexts = ['0%', '25%', '50%', '75%', '100%'];
	let progressBar = document.getElementsByClassName('progress-bar')[0];
	progressBar.style.width = barWidths[currentTab];
	progressBar.children[0].innerHTML = barTexts[currentTab];
}

let updateSlider = function(slider) {
	let value = (slider.value > 60) ? '&infin;' : slider.value;
	slider.parentNode.parentNode.getElementsByTagName('div')[1].getElementsByTagName('span')[0].innerHTML = value;
}

let deleteNode = node => node.parentNode.removeChild(node);

let editRestrictView = function(restrNode) {
	let restrList = restrNode.getElementsByClassName('restriction-list')[0];
	restrList.hidden = !(restrList.hidden);
}

let generateEmpNoWorkNodes = function() {
	let selects = document.getElementsByClassName('tab-content tab0')[0].getElementsByTagName('select');
	let empDaysInMonth = new Date(selects[1].value, Number(selects[0].value) + 1, 0).getDate();
	let empFirstDayOfWeek = new Date(selects[1].value, selects[0].value, 1).getDay();

	let allEmpNoWorkCtn = document.getElementsByClassName('emp-days-ctn');
	for (let j = 0; j < allEmpNoWorkCtn.length; j++) {
		let empNoWorkCtn = allEmpNoWorkCtn[j];

		while(empNoWorkCtn.lastChild) empNoWorkCtn.removeChild(empNoWorkCtn.lastChild);

		for (let i = 0; i < 7; i++) {
			let node = document.createElement('div');
			node.classList.add('emp-days-week-day');
			node.innerHTML = WEEK_ABV[i];
			empNoWorkCtn.appendChild(node);
		}

		for (let i = 0; i < empFirstDayOfWeek; i++) {
			empNoWorkCtn.appendChild(document.createElement('div'));
		}

		for (let i = 0; i < 31; i++) {
			let node = document.createElement('div');
			node.classList.add('emp-no-work-day');
			node.setAttribute('value', i);
			node.innerHTML = i + 1;
			node.setAttribute('onclick', "this.classList.toggle('selected')");
			empNoWorkCtn.appendChild(node);
		}
	}
}

let addEmployee = function() {
	let employeeListDiv = document.getElementsByClassName('employee-list')[0];
	employeeListDiv.insertBefore(employeeCopy.cloneNode(true), employeeListDiv.getElementsByClassName('new-employee-btn')[0]);
}

let deleteEmployee = function(employee) {
	deleteNode(employee);
	if (document.getElementsByClassName('employee').length < 1) addEmployee();
}

let addShift = function() {
	let shiftListDiv = document.getElementsByClassName('shift-list')[0];
	let newShift = shiftCopy.cloneNode(true);
	createShiftTimeSlider(newShift);
	shiftListDiv.insertBefore(newShift, shiftListDiv.getElementsByClassName('new-shift-btn')[0]);
}

let deleteShift = function(shift) {
	deleteNode(shift);
	if (document.getElementsByClassName('shift').length < 1) addShift();
}

let createShiftTimeSlider = function(shift) {
	let sliderDiv = shift.getElementsByClassName('shift-time-slider')[0];
	let STEP = 10;
	noUiSlider.create(sliderDiv, {
		range: {
			'min': 0,
			'max': 1440 - STEP
		},
		step: STEP,
		start: [540, 1020],
		connect: true,
		margin: 60,
		behaviour: 'tap-drag'
	});

	let valueDisplays = [
		sliderDiv.parentNode.getElementsByClassName('shift-time-start')[0],
		sliderDiv.parentNode.getElementsByClassName('shift-time-end')[0],
	];

	sliderDiv.noUiSlider.on('update', (values, handle) => {
		valueDisplays[handle].setAttribute('value', Math.floor(values[handle]));
		valueDisplays[handle].innerHTML = prettyPrintTime(values[handle]);
	});
}

let addZeros = value => Number(value) < 10 ? '0' + Number(value) : Number(value);

let prettyPrintTime = function(minutes) {
	let hrs = Math.floor(Number(minutes) / 60);
	let minRemain = Math.floor(Number(minutes)) % 60;

	let amORpm = value => hrs < 12 ? 'am':'pm';
	let hrs12 = (amORpm(hrs) === 'am' ) ? hrs:(hrs-12);

	return `${ hrs12 === 0 ? 12:hrs12 }:${ addZeros(minRemain) }${ amORpm(hrs) }`
}

let ChngNumEmp = function(shiftNumNode, direction, max) {
	numDiv = shiftNumNode.getElementsByClassName('number data')[0];
	let newVal = Number(numDiv.getAttribute('value')) + (direction === 'u' ? 1 : -1);

	if (newVal > 99) { newVal = 99;
	} else if (newVal > Number(max)) { newVal = Number(max);
	} else if (newVal < 1) { newVal = 1; }

	numDiv.setAttribute('value', newVal);
	numDiv.innerHTML = addZeros(newVal);
}

let addShiftRestriction = restrictionList => restrictionList.insertBefore(shiftRestrictionCopy.cloneNode(true), restrictionList.getElementsByClassName('new-restriction-btn')[0]);
let deleteShiftRestriction = restrictionNode => deleteNode(restrictionNode);

let updateRestrDescrip = function(node) {
	let desc = node.getElementsByClassName('restriction-description')[0];
	let dataValues = node.getElementsByClassName('data');
	let options = ['at least', 'only', 'at most'];

	desc.innerHTML = `<div>There will be ${ options[dataValues[0].value] }
	${ dataValues[1].getAttribute('value') }
	${ classifList[dataValues[2].value].toLowerCase() }${ Number(dataValues[1].getAttribute('value')) > 1 ? 's':'' }
	</div><div>on this shift</div>`;
}

let editRestrMax = function(maxValue, restrictionList){
	let allRestrs = restrictionList.getElementsByClassName('number data');

	for (let i=0; i < allRestrs.length; i++) {
		let numberNode = allRestrs[i];

		numberNode.setAttribute('value', (numberNode.getAttribute('value') > maxValue ? maxValue:numberNode.getAttribute('value')));
		numberNode.innerHTML = addZeros(Number(numberNode.getAttribute('value')));

		updateRestrDescrip(numberNode.parentNode.parentNode);
	}
}

let generateTab3Cal = function(month, year) {
	let numDaysInMonth = new Date(year, month+1, 0).getDate();
	let startWeekDay = new Date(year, month, 1).getDay();
	let calendar = document.getElementsByClassName('calendar-content tab3')[0];

	for (let i=0; i < startWeekDay; i++) {
		let newDay = document.createElement('div');
		newDay.classList.add('other-month');
		calendar.appendChild(newDay);
	}
	for(let i=1; i <= numDaysInMonth; i++) {
		let newDay = document.createElement('div');
		newDay.innerHTML = i;
		newDay.setAttribute('onclick',
			"if(this.classList.contains('selected')){this.classList.remove('selected')}else{this.classList.add('selected')}");
		calendar.appendChild(newDay);
	}
}



let loadExampleData = function() {
	setTab(5);

	let fakeCalendarData = {
		'date': {'month': 4, 'year': 2019},
		'employees': [
			new Employee('Jake', 1, 50, 10, 17, 18, 19),
			new Employee('Todd', 0, 20, 5, 6, 7, 8),
			new Employee('Ryland', 0, 16, 19, 21, 22, 28),
			new Employee('John', 0, 36, 5, 12, 29, 26),
			new Employee('Brynn', 3, 36, 29, 30),
			new Employee('Felicia', 3, 10, 21, 22, 23),
			new Employee('Dinosuar', 3, 60, 13, 17, 18, 21),
			new Employee('Kyle', 0, 30),
			new Employee('Kira', 0, 25),
		],
		'shifts': [
			new Shift(480, 780, 2, [false, true, true, true, true, true, false]),
			new Shift(720, 1020, 2, [false, true, true, true, true, true, false]),
			new Shift(720, 1080, 2, [true, false, false, false, false, false, false]),
			new Shift(900, 1080, 1, [false, false, false, false, false, true, false]),
		],
		'voidDays': [17, 24, 25, 26, 27],
	}

	generateSchedule(fakeCalendarData['date'], fakeCalendarData['employees'], fakeCalendarData['shifts'], fakeCalendarData['voidDays']);
}
