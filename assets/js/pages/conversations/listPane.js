/**
 * Conversations list pane
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.conversations.listPane = {

	/**
	 * Display the list of conversation
	 * 
	 * @param {HTMLElement} target The target of the page
	 */
	display: function(target){

		//Create the box
		var listBox = createElem2({
			appendTo: target,
			type: "div",
			class: "box box-solid"
		});

		//Box header
		var boxHeader = createElem2({
			appendTo: listBox,
			type: "div",
			class: "box-header with-border"
		});

		//Box title
		createElem2({
			appendTo: boxHeader,
			type: "h3",
			class: "box-title",
			innerHTML: "Conversations"
		});

		//Box body
		var boxBody = createElem2({
			appendTo: listBox,
			type: "div",
			class: "box-body no-padding"
		});

		//Loading message
		var loadingMsg = createElem2({
			appendTo: boxBody,
			type: "div",
			class: "conv-list-loading-msg",
			innerHTML: "Loading, please wait..."
		});
	}

}