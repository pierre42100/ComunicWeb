/**
 * Page title management
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.common.pageTitle = {

	/**
	 * Current page title
	 */
	_curr_title: "Comunic",

	/**
	 * Current number of notifications
	 */
	_curr_notifications_number: 0,

	/**
	 * Set a new title to the page
	 * 
	 * @param {string} title The new title for the page
	 */
	setTitle: function(title){
		this._curr_title = title;
		this.__refresh();
	},

	/**
	 * Set new number of notifications
	 * 
	 * @param {number} number The new number of notifications
	 */
	setNotificationsNumber: function(number){
		this._curr_notifications_number = number;
		this.__refresh();
	},

	/**
	 * Refresh document title
	 */
	__refresh: function(){
		let title = "";

		if(this._curr_notifications_number > 0)
			title += "(" + this._curr_notifications_number + ") ";
		
		title += this._curr_title;

		document.title = title;
	}

}