class Employee {
	constructor(name, classification, maxMinutes, ...restrictions) {
		this._empName = name;
		this._empClass = Number(classification);
		this._empMaxMinutes = Number(maxMinutes) * 60;
		this._empRestr = (restrictions) ? restrictions:[];
		this._minsThisWeek = 0;
		this._hasWorked = false;
		// this._shifts = {};
	}

	static listToEmployee (name, classification, maxMinutes) {
		return new Employee(name.value, classification.value, maxMinutes.value);
	}

	get name() {
		return this._empName;
	}
	get classif() {
		return this._empClass;
	}
	get maxMins() {
		return this._empMaxMinutes;
	}
	get restr() {
		return this._empRestr;
	}

	get hasWorked() {
		return this._hasWorked;
	}
	set hasWorked(worked) {
		this._hasWorked = worked;
	}

	get minsThisWeek() {
		return this._minsThisWeek;
	}
	set minsThisWeek(mins) {
		this._minsThisWeek += mins;
	}
	set setMinsThisWeek(num) {
		this._minsThisWeek = num;
	}

	addRestrictions(...args) {
		for (let i = 0; i < args.length; i++) {
			this._empRestr.push(args[i]);
		}
	}

	/**
	*	Sorts Employees by porp of Mins remaining first, then remaining Mins
	*/
	static sortPercMinsRemain(empA, empB) {
		return empA.percWeekMinsRemain() - empB.percWeekMinsRemain();
	}

}


