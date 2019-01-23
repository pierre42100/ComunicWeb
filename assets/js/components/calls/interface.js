/**
 * Calls interface
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.calls.interface = {

	/**
	 * Get calls configuration
	 * 
	 * @param {function} callback Function that will be called 
	 * once the operation has completed
	 */
	getConfig: function(callback){
		ComunicWeb.common.api.makeAPIrequest("calls/config", {}, true, callback);
	}

}