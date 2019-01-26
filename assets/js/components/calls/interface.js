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
	},

	/**
	 * Get information about a single call
	 * 
	 * @param {Number} callID The ID of the target call
	 * @param {function} callback Function called on request result
	 */
	getInfo: function (callID, callback){
		ComunicWeb.common.api.makeAPIrequest(
			"calls/getInfo",
			{
				call_id: callID
			},
			true,
			callback
		);
	},

	/**
	 * Get and return the next pending call for the
	 * user
	 * 
	 * @param {function} callback
	 */
	getNextPendingCall: function(callback){
		ComunicWeb.common.api.makeAPIrequest(
			"calls/nextPending",
			{},
			true,
			callback
		);
	},

	/**
	 * Respond to call
	 * 
	 * @param {number} call_id The ID of the target call
	 * @param {boolean} accept TRUE to accept call / FALSE els
	 * @param {function} callback Function to call once response has been set
	 */
	respondToCall: function(call_id, accept, callback){
		ComunicWeb.common.api.makeAPIrequest(
			"calls/respond",
			{
				call_id: call_id,
				accept: accept
			},
			true,
			callback
		);
	},

	/**
	 * Hang up a call
	 * 
	 * @param {Number} call_id The ID of the target call
	 * @param {function} callback Function to call on call callback
	 */
	hangUp: function(call_id, callback){
		ComunicWeb.common.api.makeAPIrequest(
			"calls/hangUp",
			{
				call_id: call_id,
			},
			true,
			callback
		);
	}
}