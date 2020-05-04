/**
 * Countdown timer component
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.countdown = {

	/**
	 * Initializate countdown timer
	 * 
	 * @param {int} time_end The end time for the countdown timer
	 * @param {HTMLElement} target The target for the countdown timer
	 */
	init: function(time_end, target){
		
		//Initialise variable
		var days, hours, minutes, seconds;

		//Setup interval
		var interval = setInterval(function(){

			//Check if target still exists or not
			if(!target.isConnected)
				clearInterval(interval);
			
			// find the amount of "seconds" between now and target
			var current_date = parseInt(new Date().getTime() / 1000);
			var seconds_left = time_end - current_date;

			if(seconds_left < 0) {
				seconds_left = 0;
				clearInterval(interval);
			}
		
			// do some time calculations
			days = parseInt(seconds_left / 86400);
			seconds_left = seconds_left % 86400;
			
			hours = parseInt(seconds_left / 3600);
			seconds_left = seconds_left % 3600;
			
			minutes = parseInt(seconds_left / 60);
			seconds = parseInt(seconds_left % 60);
			
			// format countdown string + set tag value
			target.innerHTML = '<span class="days">' + days +  ' <b>Days</b></span> <span class="hours">' + hours + ' <b>Hours</b></span> <span class="minutes">'
			+ minutes + ' <b>Minutes</b></span> <span class="seconds">' + seconds + ' <b>Seconds</b></span>';

		}, 1000);

	},

}