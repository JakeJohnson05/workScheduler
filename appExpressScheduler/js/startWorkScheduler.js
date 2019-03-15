// Global variables
var currentTab = 0;
var visitedTabs = [false, false, false, false]
var calendarData = {
	'date': [],
	'employeeList': [],
	'shiftList': [],
}
var employeeCopy;

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
			for (let i = 0; i < requiredList.length; i++) {
				let nameField = requiredList[i];
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
	// Tab 0
	let selectList = tabList[0].getElementsByTagName('select');
	console.log('Month:', selectList[0].value, 'Year: ', selectList[1].value);
	//tab1
	let employeeList = tabList[1].getElementsByClassName('employee');
	console.log('employeeList:')
	for (let i = 0; i < employeeList.length; i++) {
		let employeeData = employeeList[i].getElementsByClassName('data');
		Array.from(employeeData).forEach((value) => console.log(value.value));
	}
	//tab2
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

let editRestrict = function(restrNode) {
	let restrList = restrNode.getElementsByClassName('restriction-list')[0];
	restrList.hidden = (restrList.hidden === true) ? false:true;
}