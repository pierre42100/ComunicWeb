/**
 * Virtual directories interface
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.virtualDirectory.interface = {

	/**
	 * Find the user / group related to a virtual directory
	 * 
	 * @param {String} directory The directory to find
	 * @param {Function} callback
	 */
	find: function(directory, callback){
		var apiURI = "virtualDirectory/find";
		var params = {
			directory: directory
		};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
	},

}