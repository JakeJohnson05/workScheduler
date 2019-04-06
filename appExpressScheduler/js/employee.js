class Employee {
	constructor(name, classification, maxHours, ...restrictions) {
		this._empName = name;
		this._empClass = Number(classification);
		this._empMaxHrs = Number(maxHours);
		this._empRestr = (restrictions) ? restrictions:[];
		this._hoursInCurrentWeek = 0;
		// this._shifts = {};
	}

	static listToEmployee (name, classification, maxHours) {
		return new Employee(name.value, classification.value, maxHours.value);
	}

	get name () {
		return this._empName;
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
	get hoursThisWeek () {
		return this._hoursInCurrentWeek;
	}

	get weekHrsRemain () {
		return this._empMaxHrs - this._hoursInCurrentWeek;
	}

	addRestrictions(...args) {
		for (let i = 0; i < args.length; i++) {
			this._empRestr.push(args[i]);
		}
	}

	canWork(hrs, date) {
		let canWork = true;
		if (this.weekHrsRemain + Number(hrs) < this._empMaxHrs) {
			canWork = false;
		} else if (this._restrictions.includes(date)) {
			canWork = false;
		}
		return canWork

	}

	addWeekHours(hrs) {
		this._hoursInCurrentWeek += hrs;
	}

	resetWeekHours() {
		this._hoursInCurrentWeek = 0;
	}

	// deleteAllShifts() {
	// 	this._shifts = {};
	// }

	// addShift(day, shift) {
	// 	this._shifts['day'] = shift;
	// }


}
