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
	refresh_list_conversations: async function(target) {

		try {

			//Perform a request through the interface
			const list = await ConversationsInterface.getUnreadConversations();

			//Get the list of users ID
			let usersID = new Set();

			//Process the list of conversations
			for (let entry of list) {
				ConversationsUtils.getUsersIDForMessage(entry.message).forEach(id => usersID.add(id))
			}

			const users = await getUsers([...usersID]);

			this._display_list(target, list, users);
		}

		catch(e) {
			console.error(e);
			ComunicWeb.common.notificationSystem.showNotification(lang("conversations_dropdown_err_get_list"), "danger");
		}
	},

	/**
	 * Display the list of conversations
	 * 
	 * @param {HTMLElement} target The target for the fields
	 * @param {UnreadConversation[]} conversations The list of conversations
	 * @param {UsersList} usersInfo Information about related users
	 */
	_display_list: function(target, conversations, usersInfo){

		//Empty the target
		target.innerHTML = "";

		//Process each conversation
		for (let conversation of conversations) {

			//Get informations about the user
			const user = usersInfo.get(ConversationsUtils.getMainUserForMessage(conversation.message))
			
			//Create list element
			var convLi = createElem2({
				appendTo: target,
				type: "li"
			});

			//Create the conversation link element
			var convLink = createElem2({
				appendTo: convLi,
				type: "a"
			});
			convLink.setAttribute("data-conversation-id", conversation.conv.id);

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
				src: conversation.conv.logo ? conversation.conv.logo : user.image
			});

			//Add item top informations
			var liTop = createElem2({
				appendTo: convLink,
				type: "h4",
				innerHTML: user.fullName
			});

			//Add item top small informations
			var liTopSmall = createElem2({
				appendTo: liTop,
				type: "small"
			});

			//Add the message post time
			createElem2({
				appendTo: liTopSmall,
				type: "span",
				innerHTML: '<i class="fa fa-clock-o"></i> ' + ComunicWeb.common.date.timeDiffToStr(conversation.conv.last_activity) + " ago"
			});

			//Add conversation name (if available)
			if(conversation.conv.name != "" && conversation.conv.name != null){

				createElem2({
					appendTo: convLink,
					type: "p",
					innerHTML: conversation.conv.name,
				});

			}

			// Add the message
			if (conversation.message.message) {
				createElem2({
					appendTo: convLink,
					type: "p",
					class: "message-content",
					innerHTML: removeHtmlTags(conversation.message.message)
				});
			}

			// In case of server message
			if (conversation.message.server_message) {
				createElem2({
					appendTo: convLink,
					type: "p",
					class: "message-content",
					innerHTML: ConversationsUtils.getServerMessage(conversation.message, usersInfo)
				});
			}

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