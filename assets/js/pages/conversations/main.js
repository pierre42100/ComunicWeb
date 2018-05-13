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

		//Display the list of conversation
		ComunicWeb.pages.conversations.listPane.display(leftArea);
	}
}