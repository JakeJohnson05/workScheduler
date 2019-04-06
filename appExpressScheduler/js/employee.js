class Employee {
	constructor(name, classification, maxHours) {
		this._empName = name;
		this._empClass = Number(classification);
		this._empMaxHrs = Number(maxHours);
		this._empRestr = [];
		this._shifts = {};
	}

	static listToEmployee (name, classification, maxHours) {
		return new Employee(name.value, classification.value, maxHours.value);
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

	addRestrictions(...args) {
		for (let i = 0; i < args.length; i++) {
			this._empRestr.push(args[i]);
		}
	}

	deleteAllShifts() {
		this._shifts = {};
	}

	addShift(day, shift) {
		this._shifts['day'] = shift;
	}


}
