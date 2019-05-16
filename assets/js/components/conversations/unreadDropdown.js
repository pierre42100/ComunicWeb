/**
 * List of unread conversations dropdown
 * 
 * @author Pierre HUERT
 */

ComunicWeb.components.conversations.unreadDropdown = {

	/**
	 * Display unread conversations dropdown
	 * 
	 * @param {HTMLElement} target The target of the conversations dropdown
	 * @return {HTMLElement} The HTML element that contains the number of unread conversations
	 */
	display_dropdown: function(target){

		//Create the button
		var dropdown = createElem2({
			appendTo: target,
			type: "li",
			class: "dropdown messages-menu new-conversations-dropdown"
		});

		//Add dropdown toggle
		var dropdownToggle = createElem2({
			appendTo: dropdown,
			type: "a",
			class: "dropdown-toggle",
			href: "#",
			innerHTML: '<i class="fa fa-comments-o"></i>'
		});
		dropdownToggle.setAttribute("data-toggle", "dropdown");

		//Add conversations number
		var conversationsNumber = createElem2({
			appendTo: dropdownToggle,
			type: "span",
			class: "label label-danger",
			innerHTML: "0"
		});

		//Add dropdown menu
		var dropdownMenu = createElem2({
			appendTo: dropdown,
			type: "ul",
			class: "dropdown-menu"
		});

		//Add dropdown header
		var dropdownHeader = createElem2({
			appendTo: dropdownMenu,
			type: "li",
			class: "header",
			innerHTML: lang("conversations_dropdown_header")
		});

		//Add conversations list
		var conversationsListContainer = createElem2({
			appendTo: dropdownMenu,
			type: "li"
		});
		var conversationsList = createElem2({
			appendTo: conversationsListContainer,
			type: "ul",
			class: "menu"
		});

		//Add dropdown bottom
		var dropdownBottom = createElem2({
			appendTo: dropdownMenu,
			type: "li",
			class: "footer"
		});

		//Add a button to offer the user to delete all his conversations
		var openConversations = createElem2({
			appendTo: dropdownBottom,
			type: "a",
			href: "#",
			innerHTML: " "
		});

		//Enable slimscroll
		$(conversationsList).slimScroll({
			height: '100%'
		});

		//Refresh the unread conversations list if the user click the dropdown button
		dropdownToggle.onclick = function(){
			ComunicWeb.components.conversations.unreadDropdown.refresh_list_conversations(conversationsList);
		}
		
		//Return the number of conversations target
		return conversationsNumber;
	},

	/**
	 * Refresh the list of conversations
	 * 
	 * @param {HTMLElement} target The target to display the conversations
	 */
	refresh_list_conversations: function(target){

		//Perform a request through the interface
		ComunicWeb.components.conversations.interface.getUnreadConversations(function(conversations){

			//Check for errors
			if(conversations.error){
				//Display an error
				ComunicWeb.common.notificationSystem.showNotification(lang("conversations_dropdown_err_get_list"), "danger");
				return;
			}

			//Get the list of users ID
			var usersID = [];

			//Process the list of conversations
			for (var index = 0; index < conversations.length; index++) {
				const entry = conversations[index];
				
				var userID = entry.userID;
				if(!usersID.includes(userID))
					usersID.push(userID);
			}

			//Get informations about the users
			ComunicWeb.user.userInfos.getMultipleUsersInfo(usersID, function(usersInfos){

				//Check for errors
				if(usersInfos.error){
					//Display an error
					ComunicWeb.common.notificationSystem.showNotification(lang("conversations_dropdown_err_get_user_info"), "danger");
					return;
				}

				//Display the list of conversations
				ComunicWeb.components.conversations.unreadDropdown._display_list(target, conversations, usersInfos);
			});
		});

	},

	/**
	 * Display the list of conversations
	 * 
	 * @param {HTMLElement} target The target for the fields
	 * @param {array} conversations The list of conversations
	 * @param {object} usersInfos Informations about related users
	 */
	_display_list: function(target, conversations, usersInfos){

		//Empty the target
		target.innerHTML = "";

		//Process each conversation
		for (var index = 0; index < conversations.length; index++) {
			
			//Get the conversation
			const conversation = conversations[index];

			//Get informations about the user
			const userInfos = usersInfos["user-" + conversation.userID];
			
			//Create list element
			var convLi = createElem2({
				appendTo: target,
				type: "li"
			});

			//Create the conversation link element
			var convLink = createElem2({
				appendTo: convLi,
				type: "a",
				href: "#"
			});
			convLink.setAttribute("data-conversation-id", conversation.id);

			//Add left elements
			var leftElems = createElem2({
				appendTo: convLink,
				type: "div",
				class: "pull-left"
			});

			//Add user account image on the left
			var userAccountImage = createElem2({
				appendTo: leftElems,
				type: "img",
				class: "img-circle",
				src: userInfos.accountImage
			});

			//Add item top informations
			var liTop = createElem2({
				appendTo: convLink,
				type: "h4",
				innerHTML: userFullName(userInfos)
			});

			//Add item top small informations
			var liTopSmall = createElem2({
				appendTo: liTop,
				type: "small"
			});

			//Add the message post time
			var conversationLastActive = createElem2({
				appendTo: liTopSmall,
				type: "span",
				innerHTML: '<i class="fa fa-clock-o"></i> ' + ComunicWeb.common.date.timeDiffToStr(conversation.last_active) + " ago"
			});

			//Add conversation name (if available)
			if(conversation.conv_name != ""){

				var	targetConversation = createElem2({
					appendTo: convLink,
					type: "p",
					innerHTML: conversation.conv_name,
				});

			}

			//Add the message
			var conversationMessage = createElem2({
				appendTo: convLink,
				type: "p",
				class: "message-content",
				innerHTML: removeHtmlTags(conversation.message)
			});

			//Make the conversation link lives
			convLink.onclick = function(){
				openConversation(this.getAttribute("data-conversation-id"));
			}
		}

		//Display a specific message if there is not any new conversation
		if(conversations.length == 0){

			//Display a message in the target
			createElem2({
				appendTo: target,
				type: "p",
				class: "no-unread-conversation-msg",
				innerHTML: lang("conversations_dropdown_no_unread_notice")
			});

		}

	},
}