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

		//Conversation page is organized like an array with two columns
		//Left column : the list of conversations
		//Rigth column : the message of the currently opened conversation

		//Create a row
		var row = createElem2({
			appendTo: target,
			type: "div",
			class: "row conversations-page-container"
		});

		//Left area: The list of conversations
		var leftArea = createElem2({
			appendTo: row,
			type: "div",
			class: "col-md-3"
		});

		//Right area : The conversations
		var rightArea = createElem2({
			appendTo: row,
			type: "div",
			class: "col-md-9"
		});

		/**
		 * Open a conversation
		 * 
		 * @param {Number} id The ID of the conversation
		 */
		var conversationOpener = function(id){

			//Empty the target
			emptyElem(rightArea);

			//Open the conversation
			ComunicWeb.pages.conversations.conversation.open(id, rightArea);

			//Update website URI
			ComunicWeb.common.page.update_uri("Conversations", "conversations/" + id);
		}

		//Check if a conversation has to be opened
		if(args.subfolder){

			//Open the conversation
			conversationOpener(ComunicWeb.pages.conversations.main.getCurrentConversationID());
		}

		//Display the list of conversation
		ComunicWeb.pages.conversations.listPane.display(leftArea, {
			opener: conversationOpener,
			getCurrentID: this.getCurrentConversationID
		});
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