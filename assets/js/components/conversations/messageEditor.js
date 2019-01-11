/**
 * Conversation message editor
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.conversations.messageEditor = {

	/**
	 * Open conversation message editor
	 * 
	 * @param {Object} message Information about the message to open
	 * @param {(newcontent : String) => any} callback Callback function called only
	 * when the new message content has been applied
	 */
	open: function(message, callback){
		
		ComunicWeb.common.messages.inputString(
			"Update message content",
			"Please specify the new content of the message:",
			message.message,

			function(content){

				//Intend to update message content
				ComunicWeb.components.conversations.interface.UpdateSingleMessage(
					message.ID,
					content,
					
					function(result){

						if(!result)
							return notify("Could not update conversation message content!", "danger");
						
						message.message = content;
						callback(content);

					}
				);

			}
		);

	}

}