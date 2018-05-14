/**
 * Conversation pane
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.conversations.conversation = {

	/**
	 * Conversation information
	 */
	_conv_info: {},

	/**
	 * Open a conversation
	 * 
	 * @param {Number} convID The ID of the conversation to open
	 * @param {HTMLElement} target The target where the conversation will be
	 * applied
	 */
	open: function(convID, target){

		//Reset conversation information
		this._conv_info = {

			//The ID of the conversation
			id: convID,

			//Information about the UI
			window: {},

			//Information about the downloaded messages
			first_message_id: -1,
			last_message_id: 0,

			//Conversation refresh lock
			locker: {
				locked: false, 
				oldestMessage: 0,
			},

			//Conversation information
			conversation: null,

			//Related user information
			users: null,
		};

		//Create conversation box
		var box = createElem2({
			appendTo: target,
			type: "div",
			class: "box box-primary box-conversation direct-chat-primary big-box-conversation"
		});

		//Box header
		var boxHeader = createElem2({
			appendTo: box,
			type: "div",
			class: "box-header"
		});

		//Box title
		var boxTitle = createElem2({
			appendTo: boxHeader,
			type: "h3",
			class: "box-title",
			innerHTML: "Loading..."
		});
		this._conv_info.window.title = boxTitle;

		//Box body
		var boxBody = createElem2({
			appendTo: box,
			type: "div",
			class: "box-body"
		});
		this._conv_info.window.body = boxBody;

		//Create messages target
		this._conv_info.window.messagesTarget = createElem2({
			appendTo: boxBody,
			type: "div",
			class: "direct-chat-messages"
		});

		//Loading message
		var loadingMsg = createElem2({
			appendTo: boxBody,
			class: "loading-msg",
			innerHTML: "Please wait, loading..."
		});

		//Get information about the conversation
		ComunicWeb.components.conversations.interface.getInfosOne(convID, function(result){

			//Check for errors
			if(result.error)
				return loadingMsg.innerHTML = "An error occurred while loading conversation information !";
		
			//Save conversation information
			ComunicWeb.pages.conversations.conversation._conv_info.conversation = result;

			//Time to load user information
			ComunicWeb.user.userInfos.getMultipleUsersInfos(result.members, function(membersInfo){

				//Check for errors
				if(membersInfo.error)
					return loadingMsg.innerHTML = "An error occuredd while loading conversation members information !";

				//Save members information
				ComunicWeb.pages.conversations.conversation._conv_info.users = membersInfo;

				//Remove loading message
				loadingMsg.remove();

				//Perform next steps
				ComunicWeb.pages.conversations.conversation.onGotInfo(result);

			});
		});
	},

	/**
	 * Perform action when we got conversation information
	 * 
	 * @param {Object} info Information about the conversation
	 */
	onGotInfo: function(info){

		//Get and apply the name of the conversation
		ComunicWeb.components.conversations.utils.getName(info, function(name){
			ComunicWeb.pages.conversations.conversation._conv_info.window.title.innerHTML = name;
		});

		//Add send message form
		this.addSendMessageForm();

		//Defines an intervall to refresh the conversation
		var windowBody = this._conv_info.window.body;
		var locker = this._conv_info.locker;
		var interval = setInterval(function(){

			//Check if the conversation body element is still connected or not on the screen
			if(!windowBody.isConnected){
				clearInterval(interval);
				return;
			}

			//Check if the system is locked
			if(locker.locked){
				ComunicWeb.debug.logMessage("Skip conversation refresh : locked");
				return;
			}

			//Lock the system
			locker.locked = true;

			//Refresh the conversation
			ComunicWeb.pages.conversations.conversation.refresh();

		}, 1500);
	},

	/**
	 * Refresh the current conversation
	 */
	refresh: function(){

		//Peform the request over the API
		ComunicWeb.components.conversations.interface.refreshSingleConversation(this._conv_info.id, this._conv_info.last_message_id, function(response){

			//Unlock service
			ComunicWeb.pages.conversations.conversation._conv_info.locker.locked = false;

			//Check for errors
			if(response.error)
				return notify("Could not get the latest messages of the conversation!", "danger");

			//Process the list of messages
			response.forEach(function(message){
				ComunicWeb.pages.conversations.conversation.addMessage(message);
			});

		});

	},

	/**
	 * Add a message to the list
	 * 
	 * @param {Object} info Information about the message to add
	 */
	addMessage: function(info){

		//Check if the message is to add at the begining of the end of conversation
		var toLatestMessages = true;
		
		//Check if it is the first processed message
		if(this._conv_info.first_message_id == -1){
			this._conv_info.last_message_id = info.ID;
			this._conv_info.first_message_id = info.ID;
		}

		//Check if it is a message to add to the oldest messages
		else if(this._conv_info.first_message_id > info.ID) {
			this._conv_info.first_message_id = info.ID;
			var toLatestMessages = false; //Message to add to the begining
		}

		//Message is to add to the latest messages
		else {
			this._conv_info.last_message_id = info.ID;
		}

		//Determine wether the current user is the owner or not of the message
		var userIsOwner = userID() == info.ID_user;

		//Create message container
		var messageContainer = createElem2({
			appendTo: this._conv_info.window.messagesTarget,
			type: "div",
			class: "direct-chat-msg " + (userIsOwner ? "right" : "")
		});

		//Top message information
		var topInformation = createElem2({
			appendTo: messageContainer,
			type: "div",
			class: "direct-chat-info clearfix"
		});

		//Add user name
		var nameContainer = createElem2({
			appendTo: topInformation,
			type: "span",
			class: "direct-chat-name pull-right",
			innerHTML: "Loading"
		});

		//Add message date
		createElem2({
			appendTo: topInformation,
			type: "span",
			class: "direct-chat-timestamp pull-left",
			innerHTML: ComunicWeb.common.date.timeDiffToStr(info.time_insert)
		});

		//Add user account image
		var accountImage = createElem2({
			appendTo: messageContainer,
			type: "img",
			class: "direct-chat-img",
			src: ComunicWeb.__config.assetsURL + "img/defaultAvatar.png"
		});

		//Add message content container
		var messageContentContainer = createElem2({
			appendTo: messageContainer,
			type: "div",
			class: "direct-chat-text",
		});

		//Message content
		var messageContent = createElem2({
			appendTo: messageContentContainer,
			type: "div",
			innerHTML: info.message
		});

		console.log(info);
		
	},

	/**
	 * Create and append message form
	 */
	addSendMessageForm: function(){

		//Check if there is already a form or not on the page
		if(!this._conv_info.window.form){
			//Create form container
			var formContainer = createElem2({
				appendTo: this._conv_info.window.body,
				type: "form"
			});

			//Save form container
			this._conv_info.window.form = formContainer;
		}
		else{

			//Get the form
			var formContainer = this._conv_info.window.form;

			//Empty it
			emptyElem(formContainer);
		}

		//Add message input
		var inputGroup = createElem2({
			appendTo: formContainer,
			type: "div",
			class: "input-group"
		});

		//Create text input (for message)
		var inputText = createElem2({
			appendTo: inputGroup,
			type: "textarea",
			class: "form-control",
			placeholder: "New message...",
		});
		inputText.maxLength = 200;


		//Enable textarea 2.0 on the message
		var textarea2 = new ComunicWeb.components.textarea();
		textarea2.init({
			element: inputText,
			minHeight: "34px",
			autosize: true,
		});

		//Create image input (for optionnal image)
		var inputImage = createElem2({
			type: "input",
			elemType: "file",
		});
		

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
		
			//Add image icon
			createElem2({
				type: "i",
				appendTo: emojiButton, 
				class: "fa fa-smile-o"
			});
		
		//Make emojie button lives
		ComunicWeb.components.emoji.picker.addPicker(inputText, emojiButton);

		//Add image button
		var imageButton = createElem2({
			appendTo: buttonGroup,
			type: "button",
			elemType: "button",
			class: "btn btn-flat btn-add-image",
		});
		imageButton.onclick = function(){
			//Call file selector
			inputImage.click();
		};
		
			//Add image icon
			createElem2({
				type: "i",
				appendTo: imageButton, 
				class: "fa fa-image"
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

		//Prevent textarea from adding a new line when pressing enter
		$(inputText).keypress(function(event){
			if(event.keyCode == 13){
				event.preventDefault();
				sendButton.click();
			}
		});

		//Make form lives
		formContainer.onsubmit = function(){

			//Check if message is empty
			if(!checkString(inputText.value) && !inputImage.files[0]){
				ComunicWeb.common.notificationSystem.showNotification("Please type a valid message before trying to send it !", "danger", 2);
				return false;
			}

			//Lock send button
			sendButton.disabled = true;

			//Send the message throught the interface
			ComunicWeb.components.conversations.interface.sendMessage({
				conversationID: ComunicWeb.pages.conversations.conversation._conv_info.id,
				message: inputText.value,
				image: inputImage,
				callback: function(result){
					
					//Unlock send button
					sendButton.disabled = false;

					//Check for errors
					if(result.error)
						return notify("An error occurred while trying to send your message!", "danger");

					//Reset the form
					ComunicWeb.pages.conversations.conversation.addSendMessageForm();
				}
			});

			return false;
		}
	}

};