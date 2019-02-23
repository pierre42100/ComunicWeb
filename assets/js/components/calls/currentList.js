/**
 * Currents calls list management
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.calls.currentList = {

	/**
	 * This variable contains the name of the session storage
	 * variable that contains active calls
	 */
	_local_storage_list_calls_name: "current-calls",


	/**
	 * Get the list of active calls
	 * 
	 * @return {number[]} The list of calls
	 */
	getCurrentCallsList: function(){
		var string = localStorage.getItem(this._local_storage_list_calls_name);

		if(string === null || string == "")
			return [];
		else
			return string.split(",");
	},

	/**
	 * Check if a call ID is in the list of opened calls
	 * 
	 * @param {Number} id The ID of the call to check
	 */
	isCallInList: function(id){
		return this.getCurrentCallsList().includes(""+id);
	},

	/**
	 * Save a new list of calls
	 * 
	 * @param {number[]} list The new list of calls to save
	 */
	saveNewCallsList: function(list){
		localStorage.setItem(this._local_storage_list_calls_name, list.join(","));
	},

	/**
	 * Add a call to the list of opened call
	 * 
	 * @param {number} id The ID of the call to add
	 */
	addCallToList: function(id){
		var list = this.getCurrentCallsList();

		if(!list.includes(""+id))
			list.push(id);
		
		this.saveNewCallsList(list);
	},

	/**
	 * Remove a call from the list of calls
	 * 
	 * @param {Number} id The ID of the call to remove
	 */
	removeCallFromList: function(id){

		var list = this.getCurrentCallsList();

		while(list.includes(""+id))
			list.splice(list.indexOf(""+id), 1);
		
		this.saveNewCallsList(list);

	},

	/**
	 * Remove all the calls from the list
	 */
	removeAllCalls: function(){
		this.saveNewCallsList([]);
	}
}