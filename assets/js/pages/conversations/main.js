/**
 * Conversation page main script file
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.conversations.main = {

	/**
	 * Open settings page
	 * 
	 * @param {object} args Optionnal arguments
	 * @param {HTMLElement} target The target for the page
	 */
	open: function(args, target){

		//Create a container
		const container = createElem2({
			appendTo: target,
			type: "div",
			class: "conversations-page-container"
		});

		//Check if a conversation has to be opened
		if(args.subfolder){

			// Add a target for video calls
			createElem2({
				appendTo: container,
				type: "div",
				id: "target-for-video-call-"+this.getCurrentConversationID()
			})

			ComunicWeb.pages.conversations.conversation.open(this.getCurrentConversationID(), container);
		}

		// Otherwise display the list of conversations
		else {
			ConversationsPageListPane.display(container);
		}	
	},

	/**
	 * Determine the current conversation ID
	 * 
	 * @return {Number} The ID of the current conversation (0 if none found)
	 */
	getCurrentConversationID: function(){

		var id = location.toString().split("/conversations/");
		id = id[id.length - 1];

		//Check if no ID is specified
		if(id.length < 1)
			return 0;
		else
			return Number(id);

	}
}