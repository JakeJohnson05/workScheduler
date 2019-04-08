class Employee {
	constructor(name, classification, maxHours, ...restrictions) {
		this._empName = name;
		this._empClass = Number(classification);
		this._empMaxHrs = Number(maxHours);
		this._empRestr = (restrictions) ? restrictions:[];
		this._hoursInCurrentWeek = 0;
		this._hasWorked = false;
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

	get percWeekHrsRemain () {
		return this.weekHrsRemain / ((this.hoursThisWeek) ? this.hoursThisWeek:1);
	}

	addRestrictions(...args) {
		for (let i = 0; i < args.length; i++) {
			this._empRestr.push(args[i]);
		}
	}

	canWork(hrs, date) {
		let canWork = true;
		if (this.weekHrsRemain + Number(hrs) <= this._empMaxHrs) {
			canWork = false;
		} else if (Array.isArray(this._restrictions)
			&& !this._restrictions.includes(date)){
			canWork = false;
		} else if (this.hasWorked) {
			canWork = false;
		}
		return canWork;
	}

	addShift(hrs) {
		this._hoursInCurrentWeek += hrs;
		this._hasWorked = true;
	}

	resetWeekHours() {
		this._hoursInCurrentWeek = 0;
	}

	work() {
		this._hasWorked = true;
	}

	noWork() {
		this._hasWorked = false;
	}

	static resetHasWorked(empList) {
		for (let i = 0; i < empList.length; i++) {
			// if (Array.isArray(empList[i])) Employee.resetHasWorked(empList[i]);
			empList[i].noWork();
		}
	}

	static resetAllWeekHours(empList) {
		for (let i = 0; i < empList.length; i++) {
			empList[i].resetWeekHours();
			empList[i].noWork();
		}
	}

	/**
	*	Sorts Employees by porp of hours remaining first, then remaining hours
	*/
	static sortPercHrsRemain(empA, empB) {
		return empA.percWeekHrsRemain - empB.percWeekHrsRemain;
	}

}


