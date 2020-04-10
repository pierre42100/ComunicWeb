/**
 * Calls controller
 * 
 * @author Pierre Hubert
 */

/**
 * @type {Map<number, CallWindow>}
 */
let OpenConversations = new Map();

class CallsController {

	/**
	 * Open a call for a conversation
	 * 
	 * @param {Conversation} conv Information about the target conversation
	 */
	static Open(conv) {
		if(OpenConversations.has(conv.ID))
			return;
		
		console.info("Open call for conversation " + conv.ID);
		
		// Create a new window for the conversation
		const window = new CallWindow(conv);
		OpenConversations.set(conv.ID, window)
	}

}