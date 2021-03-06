/**
 * Conversation chat window functions
 * 
 * @author Pierre HUBERT
 */

const ConvChatWindow = {

	/**
	 * @var {Object} __conversationsCache Chat windows cache
	 */
	__conversationsCache: {},

	/**
	 * Open a new conversation window
	 * 
	 * @param {Integer} conversationID The ID of the window to open
	 * @return {Boolean} True for a success
	 */
	openConversation: function(conversationID){
		
		//Log action
		ComunicWeb.debug.logMessage("Opening conversation " + conversationID);

		//Create a conversation window
		var conversationWindow = this.create({
			target: byId(ComunicWeb.components.conversations.manager.__conversationsContainerID),
			conversationID: conversationID,
		});

		//Load the conversation
		this.load(conversationID, conversationWindow);

		//Success
		return true;
	},


	/**
	 * Create a new chat window
	 * 
	 * @param {Object} infos Informations required for the new chat window
	 * @info {HTMLElement} target The target of the new chat window
	 * @info {Integer} conversationID The ID of the target conversation
	 * @return {Object} Informations about the new chat window
	 */
	create: function(infos){

		//Log action
		ComunicWeb.debug.logMessage("Create a new chat window");
		
		//First, create the generic conversation window
		var infosBox = ComunicWeb.components.conversations.windows.create(infos.target.children[0]);

		//Save conversation ID
		infosBox.conversationID = infos.conversationID;

		//Change box root class name
		infosBox.rootElem.className += " chat-window direct-chat direct-chat-primary";

		//Adapt close button behaviour
		infosBox.closeFunction = function(){
			
			//Remove root element
			infosBox.rootElem.remove();

			//Remove the conversation from opened ones
			ComunicWeb.components.conversations.cachingOpened.remove(infosBox.conversationID);

			//Unload conversation
			ComunicWeb.components.conversations.chatWindows.unload(infosBox.conversationID);
		}

		infosBox.closeButton.onclick = infosBox.closeFunction;


		//Debug
		//Create messages container
		infosBox.messagesArea = createElem2({
			appendTo: infosBox.boxBody,
			type: "div",
			class: "direct-chat-messages",
			innerHTML: "",
		});

		//Add button to get conversation members
		infosBox.membersButton = createElem2({
			type: "button",
			insertBefore: infosBox.closeButton,
			elemType: "button",
			class: "btn btn-box-tool",
			title: "Conversation members"
		});
		infosBox.membersButton.setAttribute("data-toggle", "tooltip");
		infosBox.membersButton.setAttribute("data-widget", "chat-pane-toggle");

			//Add button icon
			var buttonIcon = createElem("i", infosBox.membersButton);
			buttonIcon.className = "fa fa-users";

		
		//Add conversation members pane
		var membersPane = createElem("div", infosBox.boxBody);
		membersPane.className = "direct-chat-contacts";
		
		//Add conversation members list
		infosBox.membersList = createElem("ul", membersPane);
		infosBox.membersList.className = "contacts-list";
		
		//Add send a message form
		this.addMessageform(infosBox);

		//Return informations about the chat window
		return infosBox;

	},

	/**
	 * Add a message form to the chat windows
	 * 
	 * @param {Object} infosBox Informations about the chat box
	 * @return {Boolean} True for a success
	 */
	addMessageform: function(infosBox){

		//Create form container
		var conversationFormContainer = createElem2({
			appendTo: infosBox.boxFooter,
			type: "form",
			class: "create-message-form"
		});

		//Create input group
		var inputGroup = createElem2({
			appendTo: conversationFormContainer,
			type: "div",
			class: "input-group"
		});

		//Create text input (for message)
		var inputText = createElem2({
			appendTo: inputGroup,
			type: "textarea",
			class: "form-control",
			placeholder: tr("New message..."),
		});
		inputText.maxLength = ServerConfig.conf.max_conversation_message_len;

		//Enable textarea 2.0 on the message
		var textarea2 = new ComunicWeb.components.textarea();
		textarea2.init({
			element: inputText,
			minHeight: "34px",
			autosize: true,
		});

		//Create file input (for optionnal file)
		var fileInput = createElem2({
			type: "input",
			elemType: "file",
		});
		fileInput.accept = ServerConfig.conf.allowed_conversation_files_type.join(", ");
		

		//Create button group
		var buttonGroup = createElem2({
			appendTo: inputGroup,
			type: "span",
			class: "input-group-btn",
		});

		//Add emojie button
		var emojiButton = createElem2({
			appendTo: buttonGroup,
			type: "button",
			elemType: "button",
			class: "btn btn-flat btn-add-emoji",
		});
			createElem2({
				type: "i",
				appendTo: emojiButton, 
				class: "fa fa-smile-o"
			});
		
		//Make emojie button lives
		ComunicWeb.components.emoji.picker.addPicker(inputText, emojiButton, function(){
			
			//Make the emojie picker visible
			wdtEmojiBundle.popup.style.top = (abs_height_bottom_screen()-357)+"px";

			//Make the smile button visible
			var currLeft = Number(wdtEmojiBundle.popup.style.left.replace("px", ""));
			var potentialLeft = currLeft - 20;

			if(potentialLeft > 0)
				wdtEmojiBundle.popup.style.left = potentialLeft + "px";

		});



		
		// =========== SEND FILES ===========
		//Add image button
		const fileButton = createElem2({
			appendTo: buttonGroup,
			type: "button",
			elemType: "button",
			class: "btn btn-flat btn-add-image",
		});
		fileButton.onclick = function(){
			//Call file selector
			fileInput.click();
		};
		
			//Add image icon
			createElem2({
				type: "i",
				appendTo: fileButton, 
				class: "fa fa-plus"
			});
		
		//Add send button
		var sendButton = createElem2({
			appendTo: buttonGroup,
			type: "button",
			class: "btn btn-primary btn-flat",
			elemType: "submit",
		});

			//Add send icon
			createElem2({
				appendTo: sendButton,
				type: "i",
				class: "fa fa-send-o",
			});
		
		
		ConversationsUtils.registerInputToSendFile(infosBox.conversationID, fileInput, conversationFormContainer);
		
		// =========== /SEND FILES ===========




		//Prevent textarea from adding a new line when pressing enter
		$(inputText).keypress(function(event){
			if(event.keyCode == 13){
				event.preventDefault();
				sendButton.click();
			}
		});

		//Add required elements to infosBox
		infosBox.sendMessageForm = {
			formRoot: conversationFormContainer,
			sendButton: sendButton,
			inputText: inputText,
			textarea2: textarea2,
		};

		//Success
		return true;
	},

	/**
	 * Load (or reload) a conversation
	 * 
	 * @param {Integer} conversationID The ID of the conversation to load
	 * @param {Object} conversationWindow Informations about the conversation window
	 * @return {Boolean} True for a success
	 */
	load: async function(conversationID, conversationWindow, forceRefresh) {

		try {

			//Change conversation window name (loading state)
			this.changeName("Loading", conversationWindow);

			/** @type {Conversation} */
			const conv = await new Promise((res, rej) => {
				ConversationsInterface.getInfosOne(conversationID, (info) => {
					if (info.error)
						rej(info)
					else
						res(info)
				}, forceRefresh);
			})

			const users = await getUsers(conv.members.map(m => m.user_id));

			// Create conversation informations root object
			var conversationInfos = {
				box: conversationWindow,
				membersInfos: users,
				infos: conv
			};

			// Save conversation informations in the cache
			this.__conversationsCache["conversation-"+conversationID] = conversationInfos;

			//Change the name of the conversation
			this.changeName(await getConvName(conv), conversationWindow);

			// Update conversation members informations
			this.updateMembersList(conversationInfos);

			// Display conversation settings pane
			this.showConversationSettings(conversationInfos);

			// Register the conversation in the service
			ConvService.registerConversation(conversationID);

			// Make send a message button lives
			conversationInfos.box.sendMessageForm.formRoot.onsubmit = (e) => {
				e.preventDefault();
				
				//Submit new message
				this.submitMessageForm(conversationInfos);

			};

			//Add call button (if possible)
			this.showCallButton(conversationInfos);

		}

		catch(e) {
			console.error(e);
			notify(tr("Failed to load conversation!"), "danger");
		}
	},

	/**
	 * Unload a chat window
	 * 
	 * @param {Integer} conversationID The ID of the conversation to unload
	 * @param {Boolean} keepInfos Keep informations about the chat window
	 * @return {Boolean} True for a success
	 */
	unload: function(conversationID, keepInfos){

		if(!this.__conversationsCache["conversation-"+conversationID]){
			ComunicWeb.debug.logMessage("Couldn't unload conversation: " + conversationID +". It seems not to be loaded...");
			return false;
		}

		//Log action
		ComunicWeb.debug.logMessage("Unloading a conversation: " + conversationID);

		//Get informations
		var conversationInfos = this.__conversationsCache["conversation-"+conversationID];
		
		//Empty messages area
		emptyElem(conversationInfos.box.messagesArea);
		conversationInfos.box.messagesArea.innerHTML = "";

		//Un-register conversation
		ComunicWeb.components.conversations.service.unregisterConversation(conversationID);

		//Remove informations if required
		if(!keepInfos){
			delete this.__conversationsCache["conversation-"+conversationID];
		}

		//Success
		return true;
	},

	/**
	 * Unload all chat windows
	 * 
	 * @return {Boolean} True for a success
	 */
	unloadAll: function(){

		//Clear conversation object
		clearObject(this.__conversationsCache);

		//Success
		return true;
	},

	/**
	 * Change the name of the converation at the top of the windows
	 * 
	 * @param {String} newName The new name for the conversation window
	 * @param {Ojbect} info Information about the conversation window
	 * @return {Boolean} True for a success
	 */
	changeName: function(newName, info){

		//Reduce new name
		if(newName.length > 18)
			newName = newName.slice(0, 17) + "...";

		//Empty name field
		emptyElem(info.boxTitle);
		
		//Create conversation icon 
		createElem2({
			type: "i",
			appendTo: info.boxTitle,
			class: "fa fa-comments",
			ondblclick: () => {
				openConversation(info.conversationID, true);
				info.closeFunction();
			}
		});
		

		//Add conversation title
		var conversationTitle = createElem("span", info.boxTitle);
		conversationTitle.innerHTML = " " + newName;

		//Success
		return true;
	},

	/**
	 * Update conversation members list
	 * 
	 * @param {Object} conv Information about the conversation
	 * @return {Boolean} True for a success
	 */
	updateMembersList: function(info) {
		
		//First, make sure conversation members pane is empty
		emptyElem(info.box.membersList);

		/** @type {Conversation} */
		const conv = info.infos;
		let isAdmin = conv.members.find(m => m.user_id).is_admin;
		let canAddUser = conv.group_id == null && (conv.can_everyone_add_members || isAdmin);
		let canRemoveUsers = isAdmin && canAddUser;

		// =================== Add a member =================== 
		if (canAddUser) {
			//Create form container
			var addUserForm = createElem2({
				appendTo: info.box.membersList,
				type: "form",
				class: "invite-user-form"
			});

			//Form input
			let userInput = createFormGroup({
				target: addUserForm, 
				multiple: false,
				placeholder: "Select user",
				type: "select2"});
			userInput.parentNode.className = "input-group";

			ComunicWeb.components.userSelect.init(userInput);

			//Add submit button
			var groupsButton = createElem2({
				appendTo: userInput.parentNode,
				type: "div",
				class: "input-group-btn"
			});

			createElem2({
				appendTo: groupsButton,
				type: "button",
				elemType: "submit",
				class: "btn btn-primary",
				innerHTML: "Add"
			});

			addUserForm.addEventListener("submit", async e => {
				try {
					e.preventDefault();

					//Get the list of selected users
					var usersToInvite = ComunicWeb.components.userSelect.getResults(userInput);

					//Check if there is not any user to invite
					if(usersToInvite.length == 0){
						notify(tr("Please choose a user to add!"), "danger");
						return;
					}

					await ConversationsInterface.addUser(conv.id, usersToInvite[0]);

					ConvChatWindow.reload(info)
				}

				catch(e)
				{
					console.error(e);
					notify(tr("Failed to update conversation settings!"), "danger")
				}

			})
		}

		// =================== / Add a member =================== 

		// Then process each user
		for(let member of conv.members) {
			let user = info.membersInfos.get(member.user_id);
			if(!user)
				continue;

			//Display user informations
			var userLi = createElem("li", info.box.membersList);
			var userLink = createElem("a", userLi);
			
			//Add user account image
			var userImage = createElem("img", userLink);
			userImage.className = "contacts-list-img";
			userImage.src = user.image;
			
			//Add member informations
			var memberInfosList = createElem2({
				type: "div", 
				appendTo: userLink,
				class: "contacts-list-info",
			});

			//Add user name
			var memberName = createElem2({
				type: "span",
				appendTo: memberInfosList,
				class: "contacts-list-name",
				innerHTML: user.fullName,
			});

			//Add member status
			let status = createElem2({
				type: "span",
				appendTo: memberInfosList,
				class: "contacts-list-msg",
				innerHTML: (member.is_admin ? tr("Admin") : tr("Member")) + " "
			});


			// Set / unset admin
			if(canRemoveUsers && member.user_id != userID()) {
				let removeLink = createElem2({
					type: "a",
					appendTo: status,
					innerHTML: (member.is_admin ? tr("Unset admin") : tr("Set admin"))
				})

				removeLink.addEventListener("click", async e => {
					e.preventDefault();

					try {
						await ConversationsInterface.toggleAdminStatus(conv.id, member.user_id, !member.is_admin);

						ConvChatWindow.reload(info);
					} catch(e) {
						console.error(e);
						notify(tr("Failed to toggle admin status of %1%!", {"1": user.fullName}), "danger");
					}
				})
			}

			add_space(status)

			// Remove user
			if(canRemoveUsers && member.user_id != userID()) {
				let removeLink = createElem2({
					type: "a",
					appendTo: status,
					innerHTML: "Remove"
				})

				removeLink.addEventListener("click", async e => {
					e.preventDefault();

					if(!await showConfirmDialog(tr("Do you really want to remove %1% from the conversation ?", {"1": user.fullName})))
						return;
					
					try {
						await ConversationsInterface.removeUser(conv.id, member.user_id);

						ConvChatWindow.reload(info);
					} catch(e) {
						console.error(e);
						notify(tr("Failed to remove %1% from the conversation!", {"1": user.fullName}), "danger");
					}
				})
			}
			
		}

		//Enable slimscrooll
		$(info.box.membersList).slimscroll({
			height: "100%",
			color: "#FFFFFF"
		});

		//Success
		return true;
	},

	/**
	 * Show conversation settings (button + pane)
	 * 
	 * @param {Object} conversation Informations about the conversation
	 * @return {Boolean} True for a success
	 */
	showConversationSettings: function(conversation){
		
		//First, check conversation settings button and pane don't exists yet
		if(conversation.box.settingsButton){
			if(conversation.box.settingsButton.remove){
				conversation.box.settingsButton.remove();
			}
		}
		if(conversation.box.settingsPane){
			if(conversation.box.settingsPane.remove){
				conversation.box.settingsPane.remove();
			}
		}

		//Create and display conversation settings button wheel
		conversation.box.settingsButton = createElem2({
			type: "button",
			insertBefore: conversation.box.membersButton,
			class: "btn btn-box-tool",
			type: "button"
		});

		//Add button icon
		createElem2({
			type: "i",
			appendTo: conversation.box.settingsButton,
			class: "fa fa-gear",
		});

		//Create settings pane
		var settingsPane = createElem2({
			type: "div",
			appendTo: conversation.box.boxBody,
			class: "conversation-settings-pane",
		});
		conversation.box.settingsPane = settingsPane;

		//Make the settings button lives
		conversation.box.settingsButton.onclick = function(){
			//Update settings pane classname
			if(settingsPane.className.includes(" open"))
				settingsPane.className = settingsPane.className.replace(" open", ""); //Close the pane
			else
				settingsPane.className += " open"; //Open the pane
		};

		//Create the conversation form
		const settingsForm = ConversationsUtils.createConversationForm(settingsPane);

		//Update form informations
		settingsForm.createButton.innerHTML = "Update settings";
		
		//Update conversation name
		if(conversation.infos.name)
			settingsForm.conversationNameInput.value = conversation.infos.name;

		//Update conversation members
		ComunicWeb.components.userSelect.pushEntries(settingsForm.usersElement, conversation.infos.members.map(m => m.user_id));

		// Update checkbox to allow or not everyone to add members
		$(settingsForm.allowEveryoneToAddMembers).iCheck(conversation.infos.canEveryoneAddMembers ? "check" : "uncheck");

		settingsForm.usersElement.parentNode.style.display = "none";

		//Check if user is a conversation moderator or not
		if(!conversation.infos.members.find(m => m.user_id == userID()).is_admin) {
			//We disable name field
			settingsForm.conversationNameInput.disabled = "true";

			settingsForm.allowEveryoneToAddMembers.parentNode.parentNode.remove();
		}

		//Update follow conversation checkbox status
		$(settingsForm.followConversationInput).iCheck(conversation.infos.following == "1" ? "check" : "uncheck");

		//Save settings form in global form
		conversation.settingsForm = settingsForm;

		//Make update settings button lives
		settingsForm.createButton.onclick = () => {
			this.submitUpdateForm(conversation);
		};

		//Success
		return true;
	},

	/**
	 * Add a call button to the conversation, if possible
	 * 
	 * @param {Object} conversation Information about the conversation
	 */
	showCallButton: function(conversation){

		//Check if calls are disabled
		if(!conversation.infos.can_have_call)
			return;

		//Add the call button
		const button = createElem2({
			insertBefore: conversation.box.boxTools.firstChild,
			type: "button",
			class: "btn btn-box-tool",
			innerHTML: "<i class='fa fa-phone'></i>"
		});
		conversation.box.callButton = button;

		button.addEventListener("click", function(){
			CallsController.Open(conversation.infos)
		});
	},


	/**
	 * Process submited update conversation form
	 * 
	 * @param {Object} conversation Information about the conversation
	 * @return {Boolean} True for a success
	 */
	submitUpdateForm: function(conversation){

		//Then, get information about the input
		var newValues = {
			conversationID: conversation.infos.id,
			following: conversation.settingsForm.followConversationInput.checked,
		}

		//Add other fields if the user is a conversation moderator
		if(conversation.infos.ID_owner == userID()){
			//Specify conversation name
			var nameValue = conversation.settingsForm.conversationNameInput.value
			newValues.name = (nameValue === "" ? false : nameValue);
			
			newValues.canEveryoneAddMembers = conversation.settingsForm.allowEveryoneToAddMembers.checked;

		}

		//Now, freeze the submit button
		conversation.settingsForm.createButton.disabled = true;

		//Peform a request through the interface
		ConversationsInterface.updateSettings(newValues, function(result){
			
			//Enable again update button
			conversation.settingsForm.createButton.disabled = false;
			
			//Check for errors
			if(result.error)
				notify("An error occured while trying to update conversation settings !", "danger", 4);
			
			//Reload the conversation
			ConvChatWindow.reload(conversation);
		});
	},

	/**
	 * Reload the conversation
	 * 
	 * @param {Object} conversation Information about the conversation
	 */
	reload: function(conversation) {
		ConvChatWindow.unload(conversation.infos.id, true);
		ConvChatWindow.load(conversation.infos.id, conversation.box, true);
	},

	/**
	 * Submit a new message form
	 * 
	 * @param {Object} convInfos Information about the conversation
	 * @return {Boolean} True for a success
	 */
	submitMessageForm: async function(convInfos){
		
		try {
		
			//Extract main fields
			var form = convInfos.box.sendMessageForm;

			//Check if message is empty.
			let message = form.inputText.value;

			if (message.length == 0)
				return;

			if(message.length < ServerConfig.conf.min_conversation_message_len || message.length > ServerConfig.conf.max_conversation_message_len){
				notify(tr("Invalid message length!"), "danger", 2);
				return;
			}
			
			//Lock send button
			form.sendButton.disabled = true;

			await ConversationsInterface.sendMessage(convInfos.infos.id, message);
			
			//Reset the form
			ConvChatWindow.resetCreateMessageForm(convInfos);
		}

		catch(e)
		{
			console.error(e)
			notify(tr("An error occured while trying to send message! Please try again..."), "danger", 2);
		}

		//Unlock send button
		form.sendButton.disabled = false;
	},

	/**
	 * Reset a create a message form
	 * 
	 * @param {Object} infos Information about the conversation
	 * @return {Boolean} True for a success
	 */
	resetCreateMessageForm: function(infos){

		//Extract form informations
		var form = infos.box.sendMessageForm;

		//Unlock send button and reset its value
		form.sendButton.disabled = false;

		//Empty textarea
		form.inputText.value = "";
		form.textarea2.resetHeight();
	},

	/**
	 * Add a message to a conversation window
	 * 
	 * @param {Integer} conversationID The ID of the conversation to update
	 * @param {Object} messageInfo Information about the message to add
	 * @return {Boolean} True for a success
	 */
	addMessage: function(conversationID, messageInfo){

		//First, check if the conversation information can be found
		if(!this.__conversationsCache["conversation-"+conversationID]){
			ComunicWeb.debug.logMessage("Conversation Chat Windows : Error ! Couldn't add a message to the conversation because the conversation was not found !");
			return false;
		}

		//Else extract conversation informations
		var convInfos = this.__conversationsCache["conversation-"+conversationID];

		//Check if this is the first message of the conversation or not
		if(!convInfos.messages){
			convInfos.messages = [];
		}

		//Get message HTML element add append it
		var uiMessageInfo = this._get_message_element(convInfos, messageInfo);
		convInfos.box.messagesArea.appendChild(uiMessageInfo.rootElem);

		//Perform post-processing operations
		var num = convInfos.messages.push(uiMessageInfo);

		//Check if it is not the first message from the current user
		this._makeMessageFollowAnotherMessage(convInfos, num - 1);

		//Enable slimscroll
		$(convInfos.box.messagesArea).slimscroll({
			height: "250px",
		});

		//Scroll to the bottom of the conversation
		var scrollBottom = $(convInfos.box.messagesArea).prop("scrollHeight")+"px";
		$(convInfos.box.messagesArea).slimScroll({
			scrollTo: scrollBottom
		});

		//Initialize top scroll detection if required
		this.initTopScrollDetection(conversationID);

		//Success
		return true;
	},

	/**
	 * Add old messages to a conversation window
	 * 
	 * @param {number} conversationID The ID of the target conversation
	 * @param {array} messages The list of messages to add
	 */
	addOldMessages: function(conversationID, messages){

		//First, check if the conversation information can be found
		if(!this.__conversationsCache["conversation-"+conversationID]){
			ComunicWeb.debug.logMessage("Conversation Chat Windows : Error ! Couldn't add a message to the conversation because the conversation was not found !");
			return false;
		}

		//Else extract conversation informations
		var conv = this.__conversationsCache["conversation-"+conversationID];

		//Save the position of the oldest message element
		var currOldestMessageElem = conv.messages[0].rootElem;

		//Process the list of messages in reverse order
		messages.reverse();
		messages.forEach(function(message){

			//Get message element
			var uiMessageInfo = ComunicWeb.components.conversations.chatWindows._get_message_element(conv, message);

			//Add the messages at the begining of the conversation
			conv.box.messagesArea.insertBefore(uiMessageInfo.rootElem, conv.messages[0].rootElem);

			//Add the message to the list
			conv.messages.unshift(uiMessageInfo);			

			//Check if some information about the post can be updated
			ComunicWeb.components.conversations.chatWindows._makeMessageFollowAnotherMessage(conv, 1);

		});

		//Update slimscroll
		newScrollPos = currOldestMessageElem.offsetTop - 30;
		if(newScrollPos < 0)
			newScrollPos = 0;
		$(conv.box.messagesArea).slimScroll({
			scrollTo: newScrollPos + "px"
		});
	},

	/**
	 * Generate message HTML node based on given information
	 * 
	 * @param {object} conversationInfo Information about the created conversation
	 * @param {ConversationMessage} message Information about the target message
	 * @return {object} Information about the created message element
	 */
	_get_message_element: function(conversationInfo, message){
		if (message.user_id != null && message.user_id > 0)
			return this._get_user_message(conversationInfo, message);
		
		else
			return this._get_server_message(conversationInfo, message);
	},

	/**
	 * @param {Object} conversationInfo 
	 * @param {ConversationMessage} message 
	 */
	_get_user_message: (conversationInfo, message) => {
		//Check if it is the current user who sent the message
		var userIsPoster = message.user_id == userID();

		//Create message element
		const messageContainer = createElem2({
			type: "div",
			class: "direct-chat-msg " + (userIsPoster ? "right" : "")
		});
		messageContainer.setAttribute("data-chatwin-msg-id", message.id)

		//Display message header
		var messageHeader = createElem2({
			appendTo: messageContainer,
			type: "div",
			class: "direct-chat-info clearfix"
		});

		//Add top information
		var topInfosElem = createElem2({
			appendTo: messageHeader,
			type: "div",
			class: "direct-chat-name pull-" + (userIsPoster ? "right" : "left"),
		});

		//Add user name
		var usernameElem = createElem2({
			appendTo: topInfosElem,
			type: "span",
			innerHTML: "Loading",
		});

		//Hide user name if it is the current user
		if(userIsPoster)
			usernameElem.style.display = "none";

		//Add user account image
		var userAccountImage = createElem2({
			appendTo: messageContainer,
			type: "img",
			class: "direct-chat-img",
			src: ComunicWeb.__config.assetsURL + "img/defaultAvatar.png",
			alt: "User account image",
		});

		//Load user informations
		let userInfo = conversationInfo.membersInfos.get(message.user_id);
		if(userInfo) {
			usernameElem.innerHTML = userInfo.fullName;
			userAccountImage.src = userInfo.image;
		}

		else {
			async () => {
				try {
					const userInfo = await userInfo(message.user_id);
					usernameElem.innerHTML = userInfo.fullName;
					userAccountImage.src = userInfo.image;
				} catch(e) {
					console.error(e);
				}
			}
		}

		//Add message
		var messageTargetElem = createElem2({
			appendTo: messageContainer,
			type: "div",
			class: "direct-chat-text ",
		});

		//Add text message
		var textMessage = createElem2({
			appendTo: messageTargetElem,
			type: "span",
			innerHTML: removeHtmlTags(message.message), //Remove HTML tags
		});

		//Check if an image has to be added
		if(message.file != null){
			const messageFile = message.file;

			if (messageFile.type == "image/png") {
				var imageLink = createElem2({
					appendTo: messageTargetElem,
					type: "a",
					href: messageFile.url
				});

				//Apply image
				createElem2({
					appendTo: imageLink,
					type: "img",
					class: "conversation-msg-image",
					src: messageFile.thumbnail == null ? messageFile.url : messageFile.thumbnail
				});

				imageLink.onclick = function(){
					$(this).ekkoLightbox({
						alwaysShowClose: true,
					});
					return false;
				};
			}

			else if(messageFile.type == "audio/mpeg") {
				new SmallMediaPlayer(messageTargetElem, messageFile.url, false)
			}

			else if(messageFile.type == "video/mp4") {
				new SmallMediaPlayer(messageTargetElem, messageFile.url, true)
			}

			// Fallback
			else {
				let letFileLink = createElem2({
					appendTo: messageTargetElem,
					type: "a",
					href: messageFile.url,
					innerHTML: "<i class='fa fa-download'></i> "+ messageFile.name + " (" + messageFile.size/1024 + "MB)",
				})
				letFileLink.target = "_blank"
			}
		}

		//Add date
		var dateElem = createElem2({
			appendTo: messageContainer,
			type: "div",
			class: "date-conversation-message",
			innerHTML: ComunicWeb.common.date.timeDiffToStr(message.time_sent)
		});

		//Parse emojies in text message
		ComunicWeb.components.textParser.parse({
			element: textMessage,
			user: userInfo,
		});


		//Add message dropdown menu
		messageContainer.className += " dropdown";

		var dropdownToggle = createElem2({
			insertBefore: dateElem,
			type: "i",
			class: "hidden"
		});
		dropdownToggle.setAttribute("data-toggle", "dropdown");

		var dropdownMenu = createElem2({
			insertBefore: dateElem,
			type: "ul",
			class: "dropdown-menu"
		});
		dropdownMenu.setAttribute("role", "menu");
		
		messageTargetElem.addEventListener("dblclick", function(){
			$(dropdownToggle).dropdown("toggle");
		});

		//Add message options
		if(userIsPoster){

			if (message.file == null)
			{
				//Update message content
				var updateLi = createElem2({
					type: "li",
					appendTo: dropdownMenu
				});

				var updateLink = createElem2({
					type: "a",
					appendTo: updateLi,
					innerHTML: "Edit"
				});

				updateLink.addEventListener("click", function(){
					ComunicWeb.components.conversations.messageEditor.open(message, function(newContent){
						/*
							DEPRECATED WITH WEBSOCKETS
						*/
					});
				});
			}




			//Delete the message
			var deleteLi = createElem2({
				type: "li",
				appendTo: dropdownMenu
			});

			var deleteLink = createElem2({
				type: "a",
				appendTo: deleteLi,
				innerHTML: "Delete"
			});

			deleteLink.addEventListener("click", function(){
				ComunicWeb.common.messages.confirm(
					"Do you really want to delete this message? The operation can not be reverted!",
					function(confirm){
						if(!confirm) return;

						//Hide the message
						messageTargetElem.style.display = "none";

						//Execute the request
						ConversationsInterface.DeleteSingleMessage(
							message.id,
							function(result){
								if(!result){
									messageTargetElem.style.display = "block";
									notify("Could delete conversation message!", "danger");
								}
							}
						);
					}
				)
			});

		}

		//Return information about the message
		return {
			userID: message.user_id,
			rootElem: messageContainer,
			userNameElem: usernameElem,
			dateElem: dateElem,
			time_sent: message.time_sent,
			messageTargetElem: messageTargetElem,
			accountImage: userAccountImage
		};

	},

	/**
	 * Apply a server message
	 * 
	 * @param {Object} convInfo Information about the conversation
	 * @param {ConversationMessage} message The message
	 */
	_get_server_message: (convInfo, message) => {

		//Create message element
		const messageContainer = createElem2({
			type: "div",
			class: "direct-chat-msg "
		});
		messageContainer.setAttribute("data-chatwin-msg-id", message.id);

		//Add message
		let messageTargetElem = createElem2({
			appendTo: messageContainer,
			type: "div",
			class: "server_message",
		});

		(async () => {
			try {

				let ids = ConversationsUtils.getUsersIDForMessage(message)
				let users = await getUsers(ids);
				let msg = ConversationsUtils.getServerMessage(message, users);

				messageTargetElem.innerHTML = msg

			}
			catch(e) {
				console.error(e);
				notify(tr("Failed to load a server message!"))
			}
		})();

		return {
			userID: null,
			rootElem: messageContainer,
			userNameElem: document.createElement("span"),
			dateElem: document.createElement("span"),
			time_sent: message.time_sent,
			messageTargetElem: messageTargetElem,
			accountImage: document.createElement("span")
		};
	},

	/**
	 * Make a conversation message "follow" another conversation message from the
	 * same user
	 * 
	 * @param {object} conv Information about the target conversation
	 * @param {number} num The number of the conversation message to update
	 */
	_makeMessageFollowAnotherMessage: function(conv, num){

		if(conv.messages[num - 1]){
			
			if(conv.messages[num-1].userID == conv.messages[num].userID){
				
				//Update object class name
				conv.messages[num].messageTargetElem.className += " not-first-message";

				//Hide user name and account image
				conv.messages[num].userNameElem.style.display = "none";
				conv.messages[num].accountImage.style.display = "none";

				//Update the class of the previous message
				conv.messages[num-1].rootElem.className += " not-last-message-from-user";

			}


			//Check the difference of time between the two messages
			if(conv.messages[num].time_sent - conv.messages[num - 1].time_sent < 3600
				|| conv.messages[num].dateElem.innerHTML == conv.messages[num - 1].dateElem.innerHTML)
				conv.messages[num].dateElem.style.display = "none";
		}

	},

	/**
	 * Init top scroll detection (if required)
	 * 
	 * @param {number} conversationID The ID of the target conversation
	 */
	initTopScrollDetection: function(conversationID){

		//Extract conversation informations
		var convInfo = this.__conversationsCache["conversation-"+conversationID];
		
		//Check if nothing has to be done
		if(convInfo.box.initializedScrollDetection)
			return;
		
		//Mark scroll detection as initialized
		convInfo.box.initializedScrollDetection = true;

		var scrollDetectionLocked = false;
		var scrollTopCount = 0;
		$(convInfo.box.messagesArea).slimScroll().bind("slimscrolling", function(e, pos){

			if(scrollDetectionLocked)
				return;

			if(pos != 0){
				scrollTopCount = 0;
			}

			scrollTopCount++;

			//Check top count
			if(scrollTopCount < 3)
				return;
			
			//Lock the detection
			scrollDetectionLocked = true;

			//Fetch older messages
			ConversationsInterface.getOlderMessages(
				conversationID,
				ConvService.getOldestMessageID(conversationID),
				10,
				function(result){

					//Unlock scroll detection
					scrollDetectionLocked = false;

					//Check for errors
					if(result.error){
						notify("An error occured while trying to fetch older messages for the conversation !");
						return;
					}

					//Check for results
					if(result.length == 0){
						//Lock scroll detection in order to avoid useless traffic
						scrollDetectionLocked = true;
						return;
					}

					//Save the ID of the oldest message
					ConvService.setOldestMessageID(conversationID, result[0].id);

					//Display the list of messages
					ComunicWeb.components.conversations.chatWindows.addOldMessages(conversationID, result);
				}
			);
		});
	}
}

ComunicWeb.components.conversations.chatWindows = ConvChatWindow;

//Register conversations cache cleaning function
ComunicWeb.common.cacheManager.registerCacheCleaner("ComunicWeb.components.conversations.chatWindows.unloadAll");

// Register to messages update events
document.addEventListener("updatedConvMessage", (e) => {
	const msg = e.detail;

	// Get message target
	const target = document.querySelector("[data-chatwin-msg-id='"+msg.id+"']");
	if(!target)
		return;

	
	// Get conversation info
	const convInfo = ConvChatWindow.__conversationsCache["conversation-"+msg.conv_id];
	if(!convInfo)
		return;


	target.replaceWith(ConvChatWindow._get_message_element(convInfo, msg).rootElem)
});

// Register to message deletion events
document.addEventListener("deletedConvMessage", (e) => {
	const msgID = e.detail;

	// Get message target
	const target = document.querySelector("[data-chatwin-msg-id='"+msgID+"'] .direct-chat-text");
	if(!target)
		return;
	
	target.style.display = "none";
})