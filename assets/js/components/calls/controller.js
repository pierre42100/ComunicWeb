/**
 * Calls controller
 * 
 * @author Pierre Hubert
 */

class CallsController {

	/**
	 * Open a call for a conversation
	 * 
	 * @param {Conversation} conv Information about the target conversation
	 */
	static Open(conv) {
		alert("Open call for conversation " + conv.ID);
	}

}