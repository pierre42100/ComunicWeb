/**
 * Notifications interface
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.notifications.interface = {

	/**
	 * Get the number of unread notifications
	 * 
	 * @param {function} callback
	 */
	getNbUnreads: function(callback){

		//Perform API request
		var apiURI = "notifications/count_unread";
		var params = {};

		//Perform the request
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);

	},

	/**
	 * Get the list of unread notifications
	 * 
	 * @param {function} callback
	 */
	get_list_unread: function(callback){

		//Perform API request
		var apiURI = "notifications/get_list_unread";
		var params = {};

		//Perform the request
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);

	},

}