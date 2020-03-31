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
	 * Get the number of unread news such as notifications or conversations
	 * 
	 * @param {boolean} get_calls Get the number of pending calls
	 * @param {function} callback
	 */
	getAllUnread: function(get_calls, callback){

		//Perform API request
		var apiURI = "notifications/count_all_news";
		var params = {};

		//Check if we have to get the number of pending calls
		if(get_calls)
			params.include_calls = true;

		//Perform the request
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);

	},

	// ASync version of previous request
	asyncGetAllUnread: async function(getCalls) {
		return await new Promise((res, err) => {
			this.getAllUnread(getCalls, (data) => {
				if(data.error)
					err(data.error);
				else
					res(data)
			})
		});
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

	/**
	 * Mark a notification as seen
	 * 
	 * @param {number} id The ID of the notification to mark as seen
	 * @param {boolean} delete_similar Specify if the similar notifications
	 * associated to the user have to be delete too
	 * @param {function} callback (Optionnal)
	 */
	mark_seen: function(id, delete_similar, callback){

		//Perform an API request
		var apiURI = "notifications/mark_seen";
		var params = {
			notifID: id,
			delete_similar: delete_similar
		};

		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);

	},

	/**
	 * Delete all the notifications of the user
	 * 
	 * @param {function} callback
	 */
	delete_all: function(callback){

		//Perform an API request
		var apiURI = "notifications/delete_all";
		var params = {};

		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);

	}
}