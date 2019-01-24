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
	},

	/**
	 * Create a call for a conversation
	 * 
	 * @param {Number} convID The ID of the target conversation
	 * @param {function} callback
	 */
	createForConversation : function(convID, callback){
		ComunicWeb.common.api.makeAPIrequest(
			"calls/createForConversation",
			{
				conversationID: convID
			},
			true,
			callback
		);
	}
}