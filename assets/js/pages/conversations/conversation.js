/**
 * Conversation pane
 * 
 * @author Pierre HUBERT
 */

const ConversationPageConvPart = {

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
	open: async function(convID, target){


		document.body.classList.add("conversations-page");

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
			users: new UsersList(),
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

		// Box tools
		const boxTools = createElem2({
			appendTo: boxHeader,
			type: "div",
			class: "box-tools pull-right"
		})

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

		try {
			//Get information about the conversation
			const convInfo = await getSingleConversation(convID);
			
			//Save conversation information
			this._conv_info.conversation = convInfo;

			//Time to load user information
			this._conv_info.users = await getUsers(convInfo.members.map(u => u.user_id))
			
			//Remove loading message
			loadingMsg.remove();

			//Get and apply the name of the conversation
			this._conv_info.window.title.innerHTML = await getConvName(convInfo);

			//Add send message form
			this.addSendMessageForm();

			// Register the conversation
			await ConversationsInterface.register(this._conv_info.id);

			// Get the last message
			const list = await ConversationsInterface.asyncRefreshSingle(this._conv_info.id, 0);

			// Apply the list of messages
			ConversationPageConvPart.applyMessages(list)

			// Automatically unregister conversations when it becoms required
			let reg = true;
			document.addEventListener("changeURI", async () => {
				if(reg) {
					reg = false;
					await ConversationsInterface.unregister(convID);
				}
			}, {once: true})

			// Add call button (if possible)
			if(convInfo.can_have_call) {
				const button = createElem2({
					appendTo: boxTools,
					type: "button",
					class: "btn btn-box-tool",
					innerHTML: "<i class='fa fa-phone'></i>"
				});		
				button.addEventListener("click", function(){
					CallsController.Open(convInfo)
				});
			}

		} catch(e) {
			console.error(e);
			return loadingMsg.innerHTML = "An error occurred while loading conversation information !";
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
			ConversationPageConvPart.addMessage(message);
		});

		//Init top scroll detection (if available)
		ConversationPageConvPart.initTopScrollDetection();
	},

	/**
	 * @param {ConversationMessage} msg 
	 */
	addMessage: function(msg) {

		//Check if the message is to add at the begining of the end of conversation
		var toLatestMessages = true;
		
		//Check if it is the first processed message
		if(this._conv_info.first_message_id == -1){
			this._conv_info.last_message_id = msg.id;
			this._conv_info.first_message_id = msg.id;
		}

		//Check if it is a message to add to the oldest messages
		else if(this._conv_info.first_message_id > msg.id) {
			this._conv_info.first_message_id = msg.id;
			var toLatestMessages = false; //Message to add to the begining
		}

		//Message is to add to the latest messages
		else {
			this._conv_info.last_message_id = msg.id;
		}

		//Determine wether the current user is the owner or not of the message
		var userIsOwner = userID() == msg.user_id;

		//Create message container
		var messageContainer = createElem2({
			type: "div",
			class: "direct-chat-msg " + (userIsOwner ? "curruser" : "")
		});

		//Apply message container
		if(toLatestMessages){
			this._conv_info.window.messagesTarget.appendChild(messageContainer);
		}
		else {
			//Put the message in the begining
			this._conv_info.window.messagesTarget.insertBefore(messageContainer, this._conv_info.window.messagesTarget.firstChild);
		}

		if (msg.user_id != null && msg.user_id > 0)
			this.addUserMessage(msg, messageContainer);
		else
			this.addServerMessage(msg, messageContainer);
		
		//Set a timeout to make scroll properly work (for newest messages)
		if(toLatestMessages){
			setTimeout(function(){
				messageContainer.parentNode.scrollTop = messageContainer.parentNode.scrollHeight
			}, 100);
		}
	},

	/**
	 * Add a message sent by a user to the list
	 * 
	 * @param {ConversationMessage} info Information about the message to add
	 */
	addUserMessage: function(info, messageContainer){
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
			class: "direct-chat-name",
			innerHTML: "Loading"
		});

		//Add message date
		createElem2({
			appendTo: topInformation,
			type: "span",
			class: "direct-chat-timestamp",
			innerHTML: ComunicWeb.common.date.timeDiffToStr(info.time_sent)
		});

		//Add user account image
		var accountImage = createElem2({
			appendTo: messageContainer,
			type: "img",
			class: "direct-chat-img",
			src: ComunicWeb.__config.assetsURL + "img/defaultAvatar.png"
		});

		//Add message content container
		const messageContentContainer = createElem2({
			appendTo: messageContainer,
			type: "div",
			class: "direct-chat-text",
		});
		messageContentContainer.setAttribute("data-chatpage-msg-text-id",  info.id)

		//Message content
		var messageContent = createElem2({
			appendTo: messageContentContainer,
			type: "div",
			class: "txt",
			innerHTML: removeHtmlTags(info.message)
		});

		//Parse message content
		ComunicWeb.components.textParser.parse({
			element: messageContent,
			user: this._conv_info.users.get(info.user_id)
		});

		//Message file (if any)
		if(info.file != null){
			const messageFile = info.file;

			if (messageFile.type == "image/png") {
				var imageLink = createElem2({
					appendTo: messageContentContainer,
					type: "a",
					href: messageFile.url
				});

				//Apply image
				createElem2({
					appendTo: imageLink,
					type: "img",
					class: "message-img",
					src: messageFile.thumbnail == null ? messageFile.url : messageFile.thumbnail
				});

				imageLink.onclick = function(){
					$(this).ekkoLightbox({
						alwaysShowClose: true,
					});
					return false;
				};
			}

			// Fallback
			else {
				let letFileLink = createElem2({
					appendTo: messageContentContainer,
					type: "a",
					href: messageFile.url,
					innerHTML: "<i class='fa fa-download'></i> "+ messageFile.name + " (" + messageFile.size/1024 + "MB)",
				})
				letFileLink.target = "_blank"
			}
		}

		//Apply user information (if available)
		let user = this._conv_info.users.get(info.user_id);
		if(user) {
			accountImage.src = user.image;
			nameContainer.innerHTML = user.fullName;
		}
	},

	/**
	 * @param {ConversationMessage} msg 
	 */
	async addServerMessage(msg, target) {
		try {
			const ids = ConversationsUtils.getUsersIDForMessage(msg);
			const users = await getUsers(ids);
			
			createElem2({
				appendTo: target,
				class: "srv-msg",
				innerHTML: ConversationsUtils.getServerMessage(msg, users),
			})
		}
		catch(e) {
			console.error(e);
			notify(tr("Failed to load a message!"))
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

		const msgTarget = this._conv_info.window.messagesTarget;
		msgTarget.addEventListener("scroll", () => {
			

			//Check if a request is already pending
			if(refreshLocked)
				return;
			
			//Check if we are not at the top of the screen
			if(msgTarget.scrollTop != 0){
				return;
			}


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

				//Process the list of messages in reverse order
				response.forEach(function(message){
					ConversationPageConvPart.addMessage(message);
				});

				//Scroll to newest message
				let el = document.querySelector("[data-chatpage-msg-text-id=\""+response[0].ID+"\"]")
				if(el) {
					el = el.parentNode
					/** @type {HTMLDivElement} */
					const parent = el.parentNode;
					parent.scrollTop = el.offsetTop
					console.log(parent, parent.scrollTop, el.offsetTop)
				}
				
			});
		});
	},

};

ComunicWeb.pages.conversations.conversation = ConversationPageConvPart;

// Register to new messages
document.addEventListener("newConvMessage", (e) => {
	const msg = e.detail;
	
	if (ComunicWeb.pages.conversations.conversation._conv_info.id == msg.conv_id)
		ComunicWeb.pages.conversations.conversation.applyMessages([msg]);
})

// Register to message update events
document.addEventListener("updatedConvMessage", async (e) => {
	const msg = e.detail;

	const target = document.querySelector("[data-chatpage-msg-text-id='"+msg.id+"'] .txt")
	if(!target)
		return;
	
	
	//Message content
	const newMessageContent = createElem2({
		type: "div",
		class: "txt",
		innerHTML: removeHtmlTags(msg.message)
	});

	//Parse message content
	ComunicWeb.components.textParser.parse({
		element: newMessageContent,
		user: await userInfo(msg.ID_user)
	});

	target.replaceWith(newMessageContent)
})

// Register to conversation message deletion event
document.addEventListener("deletedConvMessage", (e) => {
	const msgID = e.detail;

	const target = document.querySelector("[data-chatpage-msg-text-id='"+msgID+"']")
	if(!target)
		return;
	
	target.parentNode.remove()
})