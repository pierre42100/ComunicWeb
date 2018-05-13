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

		//Load the list of conversations
		ComunicWeb.components.conversations.interface.getList(function(result){

			//Check for errors
			if(result.error){
				loadingMsg.innerHTML = "An error occured !";
				return;
			}

			//Remove loading message
			loadingMsg.remove();

			//Display the list of conversations
			ComunicWeb.pages.conversations.listPane._display_list(boxBody, result);
		});
	},


	/**
	 * Display the list of conversations
	 * 
	 * @param {HTMLElement} target The target for the list
	 * @param {Object} list The list of conversations
	 */
	_display_list: function(target, list){

		//Create the conversations container
		var conversationsContainer = createElem2({
			appendTo: target,
			type: "ul", 
			class: "nav nav-pills nav-stacked"
		});

		//Process the list of conversations
		for (const num in list) {
			if (list.hasOwnProperty(num)) {
				const conversation = list[num];
				
				//Display conversation element
				this._display_entry(conversationsContainer, conversation);
			}
		}

	},

	/**
	 * Display a single conversation entry
	 * 
	 * @param {HTMLElement} target The target for the conversation
	 * @param {Object} info Information about the conversation to display
	 */
	_display_entry: function(target, info){

		//Create conversation container element
		var convContainer = createElem2({
			appendTo: target,
			type: "li"
		});

		//Create conversation link element
		var convLink = createElem2({
			appendTo: convContainer,
			type: "a"
		});

		//Add conversation last activity on the rigth
		var lastActivityContainer = createElem2({
			appendTo: convLink,
			type: "small",
			class: "pull-right last-activity",
			innerHTML: "<i class='fa fa-clock-o'></i> "
		});

		//Add last activity
		createElem2({
			appendTo: lastActivityContainer,
			type: "span",
			innerHTML: ComunicWeb.common.date.timeDiffToStr(info.last_active)
		});

		//Add conversation name
		var conversationName = createElem2({
			appendTo: convLink,
			type: "strong",
			innerHTML: "Loading..."
		});
		ComunicWeb.components.conversations.utils.getName(info, function(name){
			conversationName.innerHTML = name;
		});

		//Append the number of members of the conversation
		var membersNumberContainer = createElem2({
			appendTo: convLink,
			type: "p",
			class: "number-members-conversation"
		});

		var membersNumberContainerSmall = createElem2({
			appendTo: membersNumberContainer,
			type: "small",
			innerHTML: "<i class='fa fa-users'></i> "
		});
		createElem2({
			appendTo: membersNumberContainerSmall,
			type: "span",
			innerHTML: (info.members.length === 1 ? "1 member" : info.members.length + " members")
		});

	}

}