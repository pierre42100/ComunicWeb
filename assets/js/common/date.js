/**
 * The date library
 * 
 * @author Pierre HUBERT
 */

const ComunicDate = {
	/**
	 * Get current timestamp
	 * 
	 * @return {Integer} The current timestamp
	 */
	time: function(){
		return Math.floor(new Date().getTime()/1000);
	},

	/**
	 * Convert a difference in second into a date
	 * 
	 * @param {Integer} difference The difference between two values
	 * @return {String} The generated date
	 */
	diffToStr: function(difference){

		//Check if difference is less than one second
		if(difference < 0)
			difference = 0;

		//Calculate seconds
		var seconds = difference-Math.floor(difference/60)*60;
		var difference = (difference - seconds)/60;

		//Check there was less than one minute
		if(difference == 0)
			return lang("dates_s", [seconds]);


		//Calculate minutes
		var minutes = difference-Math.floor(difference/60)*60;
		var difference = (difference - minutes)/60;

		//Check there was less than one hour
		if(difference == 0)
			return lang("dates_min", [minutes]);


		//Calculate hours
		var hours = difference-Math.floor(difference/24)*24;
		var difference = (difference - hours)/24;

		//Check there was less than a day
		if(difference == 0)
			return lang("dates_h", [hours]);


		//Calculate days
		var days = difference-Math.floor(difference/30)*30;
		var difference = (difference - days)/30;

		//Check there was less than a month
		if(difference == 0){
			if(days == 1)
				return lang("dates_one_day");
			else
				return lang("dates_days", [days]);
		}
			

		//Calculate months
		var months = difference-Math.floor(difference/12)*12;
		var difference = (difference - months)/12;

		//Check there was less than a year
		if(difference == 0){
			if(months == 1)
				return lang("dates_one_month");
			else
				return lang("dates_months", [months]);
		}
			

		//Calculate years
		var years = difference;
		if(years == 1){
			return lang("dates_one_year");
		}
		else {
			return lang("dates_years", [years]);
		}
	},

	/**
	 * Get the difference of time from now to a specified
	 * timestamp and return it as a string
	 * 
	 * @param {Integer} time The base time
	 * @return {String} Computed difference
	 */
	timeDiffToStr: function(time){
		return this.diffToStr(this.time() - time);
	},
}

ComunicWeb.common.date = ComunicDate;

/**
 * Add a day to a date
 * 
 * @param {Date} date Target date
 */
function addOneDay(date) {
	return new Date(date.getTime() + 1000*60*60*24);
}

/**
 * Get all the days of a specified range
 * 
 * @param {Date} start 
 * @param {Date} end (exclusive)
 */
function getDaysOfRange(start, end) {
	let curr = start;
	let list = [];

	while (curr < end) {
		list.push(curr);
		curr = addOneDay(curr);
	}

	return list;
}
