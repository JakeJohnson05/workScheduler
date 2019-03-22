class Shift {
	constructor(startTime, endTime, numEmployees, days, requirements) {
		this._time = {
			'start': Number(startTime),
			'end': Number(endTime),
		}
		this._numEmployees = Number(numEmployees);
		this._days = days;
		this._requirements = (requirements) ? requirements:null;
	}

	get time() {
		return this._time;
	}
	get numEmployees() {
		return this._numEmployees;
	}
	get daysInWeek() {
		return this._days;
	}
	get requirements() {
		return this._requirements;
	}
}