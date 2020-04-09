/**
 * Conversations list pane
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.conversations.listPane = {

	/**
	 * Save current list
	 */
	_curr_list: {},

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

		var interval = setInterval(function(){

			//Check if box body is still connected
			if(!boxBody.isConnected){
				clearInterval(interval);
				ComunicWeb.pages.conversations.listPane._curr_list = null;
				return;
			}

			//Load the list of conversations
			ComunicWeb.pages.conversations.listPane.refresh_list(boxBody);

		}, 5000);

		//Force load the list of conversations
		ComunicWeb.pages.conversations.listPane._curr_list = null;
		ComunicWeb.pages.conversations.listPane.refresh_list(boxBody);
		
	},

	/**
	 * Refresh the list of conversations
	 * 
	 * @param {HTMLElement} target The target for the list
	 */
	refresh_list: function(target){

		//Loading message, if required
		if(target.childElementCount == 0){
			var loadingMsg = createElem2({
				appendTo: target,
				type: "div",
				class: "conv-list-loading-msg",
				innerHTML: "Loading, please wait..."
			});
		}
		else
			//Create empty division
			var loadingMsg = document.createElement("div");
		

		//Perform a request over the interface
		ComunicWeb.components.conversations.interface.getList(function(result){

			//Check for errors
			if(result.error){
				loadingMsg.innerHTML = "An error occured !";
				return;
			}

			//Remove loading message
			loadingMsg.remove();

			//Check if it is required to apply new list
			if(JSON.stringify(ComunicWeb.pages.conversations.listPane._curr_list) == JSON.stringify(result))
				return;
			ComunicWeb.pages.conversations.listPane._curr_list = result;
			
			emptyElem(target); //Remove any previously shown list

			//Display the list of conversations
			ComunicWeb.pages.conversations.listPane._display_list(target, result);
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
		for (var num in list) {
			if (list.hasOwnProperty(num)) {
				var conversation = list[num];
				
				//Display conversation element
				this._display_entry(conversationsContainer, conversation);
			}
		}
		
		//Enable slimscroll
		ComunicWeb.pages.conversations.utils.enableSlimScroll(
			conversationsContainer, 
			ComunicWeb.pages.conversations.utils.getAvailableHeight(), 
			0);	
	},

	/**
	 * Display a single conversation entry
	 * 
	 * @param {HTMLElement} target The target for the conversation
	 * @param {Object} info Information about the conversation to display
	 */
	_display_entry: function(target, info) {

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

			//Force conversation list refresh
			ComunicWeb.pages.conversations.listPane._curr_list = {};

			//Make the choice visible
			convLink.className += " selected";

			//Open the conversation
			openPage("conversations/"+info.ID)
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
			type: info.saw_last_message ? "span" : "strong",
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