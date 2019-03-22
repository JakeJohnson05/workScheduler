// Global variables
var currentTab = 0;
var visitedTabs = [false, false, false, false]
var calendarData = {
	'date': [],
	'employees': [],
	'shifts': [],
}
var employeeCopy;
var shiftCopy;

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

	if (!visitedTabs[currentTab]) {
		setUpCurrentTab();
		visitedTabs[currentTab] = true;
	}
	if (currentTab === 0) {
		document.getElementById('back-button').style.display = 'none';
	} else {
		document.getElementById('back-button').style.display = 'block';
	}
}

let nextTab = function() {
	if (isTabValid()){
		setTab((currentTab === 3) ? 3 : currentTab + 1);
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
		default:
			console.log(`tab ${currentTab} has defaulted to true`);
			return true;
	}
}

let consoleData = function(tab) {
	let tabList = document.getElementsByClassName('form-tab');
	calendarData = {
		'date': [],
		'employees': [],
		'shifts': [],
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
		calendarData['employees'].push(Employee.listToEmployee.apply(this, employeeData));
	}
	/**
	* -------------------- Just for Testing --------------------
	*/
	if (calendarData['employees'][0].name === "") calendarData['employees'] = [new Employee('Jake', '0', '40')];
	/**
	* ----------------------------------------------------------
	*/

	//tab2
	let shiftList = tabList[2].getElementsByClassName('shift');
	let shiftData;
	let getV = node => node.getAttribute('value');
	for (let i = 0; i < shiftList.length; i++) {
		let shiftData = shiftList[i].getElementsByClassName('data');
		let days = {
			'sun': shiftData[3].checked,
			'mon': shiftData[4].checked,
			'tue': shiftData[5].checked,
			'wed': shiftData[6].checked,
			'thu': shiftData[7].checked,
			'fri': shiftData[8].checked,
			'sat': shiftData[9].checked,
		}
		calendarData['shifts'].push(new Shift(getV(shiftData[0]), getV(shiftData[1]), getV(shiftData[2]), days));
	}

	console.log(calendarData);
}

let fixProgressBar = function() {
	let barWidths = ['10%', '35%', '60%', '85%'];
	let barTexts = ['0%', '25%', '50%', '75%'];
	let progressBar = document.getElementsByClassName('progress-bar')[0];
	progressBar.style.width = barWidths[currentTab];
	progressBar.getElementsByTagName('span')[0].innerHTML = barTexts[currentTab];
}

let setUpCurrentTab = function() {
	switch(currentTab) {
		case 0:
			break;
		case 1:
			employeeCopy = document.getElementsByClassName('employee')[0].cloneNode(true);
			break;
		case 2:
			shiftCopy = document.getElementsByClassName('shift')[0].cloneNode(true);
			createShiftTimeSlider(document.getElementsByClassName('shift')[0]);
			break;
		case 3:
			break;
	}
}

let updateSlider = function(slider) {
	let value = (slider.value > 60) ? '&infin;' : slider.value;
	slider.parentNode.parentNode.getElementsByTagName('div')[1].getElementsByTagName('span')[0].innerHTML = value;
}

let deleteNode = function(node) {
	node.parentNode.removeChild(node);
}

let editRestrictView = function(restrNode) {
	let restrList = restrNode.getElementsByClassName('restriction-list')[0];
	restrList.hidden = (restrList.hidden) ? false:true;
}

let addEmployee = function() {
	let employeeListDiv = document.getElementsByClassName('employee-list')[0];
	let newEmployee = employeeCopy.cloneNode(true);
	employeeListDiv.insertBefore(newEmployee, employeeListDiv.getElementsByClassName('new-employee-btn')[0]);
}

let deleteEmployee = function(employee) {
	deleteNode(employee);
	if (document.getElementsByClassName('employee').length < 1) {
		addEmployee();
	}
}

let addShift = function() {
	let shiftListDiv = document.getElementsByClassName('shift-list')[0];
	let newShift = shiftCopy.cloneNode(true);
	createShiftTimeSlider(newShift);
	shiftListDiv.insertBefore(newShift, shiftListDiv.getElementsByClassName('new-shift-btn')[0]);
		
}

let deleteShift = function(shift) {
	deleteNode(shift);
	if (document.getElementsByClassName('shift').length < 1) {
		addShift();
	}
}

let createShiftTimeSlider = function(shift) {
	let sliderDiv = shift.getElementsByClassName('shift-time-slider')[0];
	
	noUiSlider.create(sliderDiv, {
		range: {
			'min': 0,
			'max': 1440,
		},
		step: 10,
		start: [540, 1020],
		connect: true,
		margin: 90,
		behaviour: 'tap-drag',
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

	let hrs12 = (amORpm(hrs) === 'am' ) ? hrs:(hrs-12)
	return `${ hrs12 === 0 ? 12:hrs12 }:${ addZeros(minRemain) } ${ amORpm(hrs) }`
}

let ChngNumEmp = function(shiftNumNode, direction) {
	numDiv = shiftNumNode.getElementsByClassName('number data')[0];
	let newVal = Number(numDiv.getAttribute('value')) + (direction === 'u' ? 1 : -1);
	if (newVal > 99) {
		newVal = 99;
	} else if (newVal < 1) {
		newVal = 1;
	}

	numDiv.setAttribute('value', newVal);
	numDiv.innerHTML = addZeros(newVal);
}
