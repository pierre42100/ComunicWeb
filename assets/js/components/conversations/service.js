/**
 * Conversation service file
 * 
 * Ensure that the content of the conversations is up to date
 * 
 * @author Pierre HUBERT
 */

const ConvService = {

	/**
	 * @var {Object} __serviceCache The service cache
	 */
	__serviceCache: false,
	
	/**
	 * Initializate conversation service
	 * 
	 * @return {Boolean} True for a success
	 */
	init: function(){
		//Make sure the cache is empty
		this.emptyCache();
		
		//Success
		return true;
	},

	/**
	 * Register a new conversation
	 * 
	 * @param {Integer} conversationID The ID of the conversation to register
	 * @return {Boolean} True for a success
	 */
	registerConversation: async function(conversationID){

		try {

			//Create conversation object
			if(!this.__serviceCache)
				this.__serviceCache = {}; //Create service cache object

			// Get the last messages of the conversations
			const list = await ComunicWeb.components.conversations.interface.asyncRefreshSingle(conversationID, 0);

			//Register conversation locally
			this.__serviceCache['conversation-' + conversationID] = {
				conversationID: conversationID,
				first_message_id: list.length == 0 ? 0 : list[0].ID,
			};

			// Register conversation remotly
			await ComunicWeb.components.conversations.interface.register(conversationID)

			for(const msg of list)
				ComunicWeb.components.conversations.chatWindows.addMessage(conversationID, msg);

		} catch(e) {
			console.error(e);
			notify("Could not open conversation!", "danger");
		}
	},

	/**
	 * Unregister a conversation
	 * 
	 * @param {Integer} conversationID The ID of the conversation to remove
	 * @return {Boolean} True for a success
	 */
	unregisterConversation: async function(conversationID){

		//Log action
		ComunicWeb.debug.logMessage("Unregistering conversation " + conversationID + " from service.");

		if(this.__serviceCache && this.__serviceCache['conversation-'+conversationID]){
			delete this.__serviceCache['conversation-'+conversationID]; //Remove conversation
		}

		// Unregister remotly
		await ComunicWeb.components.conversations.interface.unregister(conversationID)
	},

	/**
	 * Get the oldest messages of a conversation
	 * 
	 * @param {number} conversationID The ID of the target conversation
	 * @return {numbert} The ID of the oldest message / -1 in case of failure
	 */
	getOldestMessageID: function(conversationID){

		//Try to fetch information
		if(this.__serviceCache){
			if(this.__serviceCache['conversation-'+conversationID]){
				return this.__serviceCache['conversation-'+conversationID].first_message_id;
			}
		}

		//The conversation was not found
		return -1;
	},

	/**
	 * Set the oldest messages of a conversation
	 * 
	 * @param {number} conversationID The ID of the target conversation
	 * @param {numbert} firstMessageID New value for the first known message id
	 */
	setOldestMessageID: function(conversationID, firstMessageID){

		//Try to fetch information
		if(this.__serviceCache){
			if(this.__serviceCache['conversation-'+conversationID]){
				this.__serviceCache['conversation-'+conversationID].first_message_id = firstMessageID;
			}
		}
	},

	/**
	 * Empty service cache (unregister all conversations)
	 * 
	 * @return {Boolean} True for a success
	 */
	emptyCache: function(){
		if(this.__serviceCache){
			clearObject(this.__serviceCache);
		}

		//Success
		return true;
	},
}

ComunicWeb.components.conversations.service = ConvService;

//Register service cache
ComunicWeb.common.cacheManager.registerCacheCleaner("ComunicWeb.components.conversations.service.emptyCache");

// Register to new messages
document.addEventListener("newConvMessage", (e) => {
	const msg = e.detail;
	
	if(ConvService.__serviceCache.hasOwnProperty("conversation-" + msg.convID))
		ComunicWeb.components.conversations.chatWindows.addMessage(msg.convID, msg);
})