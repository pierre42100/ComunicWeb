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
	 * @param {Object} args Additional arguments
	 */
	display: function(target, args){

		//Create the box
		var listBox = createElem2({
			appendTo: target,
			type: "div",
			class: "box box-solid conversations-list-box"
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
			emptyElem(boxBody); //Remove any previously shown list

			//Display the list of conversations
			ComunicWeb.pages.conversations.listPane._display_list(boxBody, result, args);
		});
	},


	/**
	 * Display the list of conversations
	 * 
	 * @param {HTMLElement} target The target for the list
	 * @param {Object} list The list of conversations
	 * @param {Object} args Additional arguments
	 */
	_display_list: function(target, list, args){

		//Create the conversations container
		var conversationsContainer = createElem2({
			appendTo: target,
			type: "ul", 
			class: "nav nav-pills nav-stacked"
		});

		//Process the list of conversations
		for (var num in list) {
			if (list.hasOwnProperty(num)) {
				var conversation = list[num];
				
				//Display conversation element
				this._display_entry(conversationsContainer, conversation, args);
			}
		}
		
		//Enable slimscroll
		$(conversationsContainer).slimScroll({
			height: '100%'
		});

	},

	/**
	 * Display a single conversation entry
	 * 
	 * @param {HTMLElement} target The target for the conversation
	 * @param {Object} info Information about the conversation to display
	 * @param {Object} args Additional arguments
	 */
	_display_entry: function(target, info, args) {

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
		convLink.addEventListener("click", function(e){
			args.opener(info.ID);
		});

		//Check if it is the current conversation
		if(args.currConvID == info.ID)
			convLink.className = " selected";

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