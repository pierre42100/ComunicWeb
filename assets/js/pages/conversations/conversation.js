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

			//Enabled top scroll detection
			initTopScrollDetection: false,

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

		// Box icon
		createElem2({
			appendTo: boxHeader,
			type: "span",
			class: "box-title",
			innerHTML: "<i class='fa fa-comments'></i>&nbsp;",
			ondblclick: () => openConversation(convID, false)
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
			ComunicWeb.user.userInfos.getMultipleUsersInfo(result.members, function(membersInfo){

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
	onGotInfo: async function(info){

		try {
			//Get and apply the name of the conversation
			ComunicWeb.components.conversations.utils.getName(info, function(name){
				ComunicWeb.pages.conversations.conversation._conv_info.window.title.innerHTML = name;
			});

			//Add send message form
			this.addSendMessageForm();

			//Defines an intervall to refresh the conversation
			const windowBody = this._conv_info.window.body;

			// Register the conversation
			await ComunicWeb.components.conversations.interface.register(this._conv_info.id);

			// Get the last message
			const list = await ComunicWeb.components.conversations.interface.asyncRefreshSingle(this._conv_info.id, 0);

			// Apply the list of messages
			this.applyMessages(list)

			// Automatically unregister conversations when it becoms required
			let reg = true;
			const convID = this._conv_info.id;
			document.addEventListener("changeURI", async () => {
				if(reg) {
					reg = false;
					await ComunicWeb.components.conversations.interface.unregister(convID);
				}
			})
			

		} catch(e) {
			console.error(e)
			notify("Could not refresh conversation!", "danger")
		}
	},

	/**
	 * Apply a new list of messages
	 */
	applyMessages: function(list){

		//Check if there are responses to process
		if(list.length == 0)
			return; //Do not process messages list (avoid unwanted scrolling)

		//Process the list of messages
		list.forEach(function(message){
			ComunicWeb.pages.conversations.conversation.addMessage(message);
		});

		//Init top scroll detection (if available)
		ComunicWeb.pages.conversations.conversation.initTopScrollDetection();
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
			type: "div",
			class: "direct-chat-msg " + (userIsOwner ? "right" : "")
		});

		//Apply message container
		if(toLatestMessages){
			this._conv_info.window.messagesTarget.appendChild(messageContainer);
		}
		else {

			//Put the message in the begining
			this._conv_info.window.messagesTarget.insertBefore(messageContainer, this._conv_info.window.messagesTarget.firstChild);
		}

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
			innerHTML: removeHtmlTags(info.message)
		});

		//Parse message content
		ComunicWeb.components.textParser.parse({
			element: messageContent
		});

		//Message image (if any)
		if(info.image_path != null){

			//Image link
			var imageLink = createElem2({
				appendTo: messageContentContainer,
				type: "a",
				href: info.image_path
			});

			//Apply image
			createElem2({
				appendTo: imageLink,
				type: "img",
				class: "message-img",
				src: info.image_path
			});

			imageLink.onclick = function(){
				$(this).ekkoLightbox({
					alwaysShowClose: true,
				});
				return false;
			};
		}

		//Apply user information (if available)
		if(this._conv_info.users["user-" + info.ID_user]){
			accountImage.src = this._conv_info.users["user-" + info.ID_user].accountImage;
			nameContainer.innerHTML = userFullName(this._conv_info.users["user-" + info.ID_user]);
		}

		//Set a timeout to make slimscroll properly work (for newest messages)
		if(toLatestMessages){
			setTimeout(function(){

				//Enable / update slimscroll
				var target = ComunicWeb.pages.conversations.conversation._conv_info.window.messagesTarget;
				var scrollBottom = $(target).prop("scrollHeight")+"px";
				ComunicWeb.pages.conversations.utils.enableSlimScroll(target, ComunicWeb.pages.conversations.utils.getAvailableHeight(), scrollBottom);

			}, 100);
		}
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
		inputText.focus();


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
	},

	/**
	 * Init top scroll detection (if required)
	 */
	initTopScrollDetection: function(){

		//Check if top scroll dection has already been enabled on this conversation
		if(this._conv_info.initTopScrollDetection)
			return;
		
		//Check if there isn't any message in the list
		if(this._conv_info.last_message_id == 0)
			return;
		
		//Mark top scroll detection as initialized
		this._conv_info.initTopScrollDetection = true;

		//Define some variables
		var refreshLocked = false;
		var topScrollCount = 0;

		//Save conversation information
		var convInfo = this._conv_info;

		$(this._conv_info.window.messagesTarget).bind("slimscrolling", function(e, pos){

			//Check if a request is already pending
			if(refreshLocked)
				return;
			
			//Check if we are not at the top of the screen
			if(pos != 0){
				topScrollCount = 0;
				return;
			}
			
			//Increment value
			topScrollCount++;
			
			//The user must scroll several seconds to request a refresh
			if(topScrollCount < 3)
				return;

			//Lock refresh
			refreshLocked = true;

			//Query older messages
			ComunicWeb.components.conversations.interface.getOlderMessages(convInfo.id, convInfo.first_message_id, 10, function(response){

				//Unlock service
				refreshLocked = false;

				//Check for errors
				if(response.error)
					return notify("An error occured while trying to retrieve older messages !", "danger");
				
				//Check if there is not any message to display
				if(response.length == 0){

					//Lock service
					refreshLocked = true;
					return;

				}

				//Process the list of messages
				//Reverse messages order
				response.reverse();

				//Save the current oldest message
				var oldestMessage = convInfo.window.messagesTarget.firstChild;

				//Process the list of messages in reverse order
				response.forEach(function(message){
					ComunicWeb.pages.conversations.conversation.addMessage(message);
				});

				//Update slimscroll
				newScrollPos = oldestMessage.offsetTop - 30;
				if(newScrollPos < 0)
					newScrollPos = 0;
				ComunicWeb.pages.conversations.utils.enableSlimScroll(
					convInfo.window.messagesTarget, 
					ComunicWeb.pages.conversations.utils.getAvailableHeight(), 
					newScrollPos);
			});
		});
	},

};

// Register to new messages
document.addEventListener("newConvMessage", (e) => {
	const msg = e.detail;
	
	if(ComunicWeb.pages.conversations.conversation._conv_info.id == msg.convID)
	ComunicWeb.pages.conversations.conversation.applyMessages([msg]);
})