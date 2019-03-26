class Employee {
	constructor(name, classification, maxHours, restrictions) {
		this._empName = name;
		this._empClass = Number(classification);
		this._empMaxHrs = Number(maxHours);
		this._empRestr = (restrictions) ? restrictions:null;
		this._shifts = {};
	}

	static listToEmployee (name, classification, maxHours, restrictions) {
		return new Employee(name.value, classification.value, maxHours.value, restrictions);
	}

	get name () {
		return this._empName.toString();
	}
	get class () {
		return this._empClass;
	}
	get classif () {
		return this._empClass;
	}
	get maxHrs () {
		return this._empmMaxHrs;
	}
	get restr () {
		return this._restrictions;
	}

	deleteAllShifts() {
		this._shifts = {};
	}

	addShift(day, shift) {
		this._shifts['day'] = shift;
	}
}