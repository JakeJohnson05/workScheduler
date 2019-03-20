class Employee {
	constructor(name, classification, maxHours, restrictions) {
		this._empName = name;
		this._empClass = classification;
		this._empMaxHrs = maxHours;
		this._empRestr = (restrictions) ? restrictions:null;
		this._empCurrentHrs = 0;
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
	get hrs () {
		return this._empCurrentHrs;
	}

	addHrs (hrs) {
		this._empCurrentHrs += hrs;
	}
	resetHrs () {
		this._empCurrentHrs = 0;
	}

	static listToEmployee (name, classification, maxHours, restrictions) {
		return new Employee(name.value, classification.value, maxHours.value, restrictions);
	}
}