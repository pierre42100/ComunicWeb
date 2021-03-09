/**
 * Conversations utilites
 * 
 * @author Pierre HUBERT
 */

const ConversationsUtils = {

	/**
	 * Given conversation informations, returns its name
	 * 
	 * @param {Conversation} info Conversation information
	 * @param {Function} afterName What to do once we got conversation name
	 * @return {Boolean} True for a success
	 */
	getName: function(info, afterName){

		//Check if the conversation has a name or not
		if(info.name && info.name.length > 0)
			afterName(info.name);
		else {

			//Get informations about the first two members
			var firstMembers = [];

			//Retrieve IDs
			for(o in info.members){
				//Limit number to 2
				if(firstMembers.length < 2){
					//Exclude current user ID
					if(info.members[o].user_id != userID()) 
						firstMembers.push(info.members[o].user_id);

				}
			}

			//Get users informations
			ComunicWeb.user.userInfos.getNames(firstMembers, function(usersName){

				//For conversations with many members (more than 3 - we musn't forget current user)
				if(info.members.length > 3)
					usersName += ", ...";

				//Peform next action now
				afterName(usersName);
			});
		}

		//Success
		return true;
	},

	/**
	 * Given a conversation ID, get its name
	 * 
	 * @param {number} id The ID of the target conversation
	 * @param {function} onGotName Function called once we have got the name of the conversation
	 */
	getNameForID: function(id, onGotName){

		ComunicWeb.components.conversations.interface.getInfosOne(id, function(info){

			//Check if an error occurred
			if(info.error)
				return onGotName(false);

			//Get and return the name of the conversation
			ComunicWeb.components.conversations.utils.getName(info, onGotName);
			
		});

	},

	/**
	 * Create and display a conversation creation / edition form
	 * 
	 * @param {HTMLElement} target The target of the creation form
	 * @return {ConversationSettingsFormElements} Information about the form
	 */
	createConversationForm: function(target){

		//Create form object
		const form = {};

		//Create and display conversation creation form
		form.rootElem = createElem("div", target);

		//Choose users
		//Create select user element
		form.usersElement = createFormGroup({
			target: form.rootElem, 
			label: "Users", 
			multiple: true,
			placeholder: "Select users",
			type: "select2"});

		//Initialize user selector
		ComunicWeb.components.userSelect.init(form.usersElement);


		// Conversation name
		form.conversationNameInput = createFormGroup({
			target: form.rootElem, 
			label: tr("Conversation name"), 
			placeholder: tr("Optional"), 
			type: "text"
		});

		// Conversation color
		form.conversationColorInput = createFormGroup({
			target: form.rootElem, 
			label: tr("Conversation color"), 
			placeholder: tr("Optional"), 
			type: "text"
		});
		$(form.conversationColorInput).colorpicker({format: "hex"})

		// Follow discussion
		form.followConversationInput = createFormGroup({
			target: form.rootElem, 
			label: tr("Follow conversation"), 
			checked: true,
			type: "checkbox"
		});

		// Allow all the members of the conversation to add other members
		form.allowEveryoneToAddMembers = createFormGroup({
			target: form.rootElem,
			type: "checkbox",
			checked: true,
			label: "Allow everyone to add members" 
		});

		//Create button
		form.createButton = createElem2({
			type: "button", 
			appendTo: form.rootElem,
			class: "btn btn-primary",
			innerHTML: "Create conversation"
		});
		form.createButton.style.width = "100%";

		//Return result
		return form;
	},

	/**
	 * Get the ID of the users for a message
	 * 
	 * @param {ConversationMessage} msg 
	 */
	getUsersIDForMessage: function(msg) {
		if (msg.user_id != null && msg.user_id > 0)
			return [msg.user_id];
		
		switch (msg.server_message.type) {
			case "user_created_conv":
			case "user_left":
				return [msg.server_message.user_id];
			
			case "user_added_another":
				return [msg.server_message.user_who_added, msg.server_message.user_added];
			
			case "user_removed_another":
				return [msg.server_message.user_who_removed, msg.server_message.user_removed];
		}
	},

	/**
	 * Get the ID of the main user for a given message
	 * 
	 * @param {ConversationMessage} msg 
	 */
	getMainUserForMessage: function(msg) {
		if (msg.user_id != null && msg.user_id > 0)
			return msg.user_id;
		
		switch (msg.server_message.type) {
			case "user_created_conv":
			case "user_left":
				return msg.server_message.user_id;
			
			case "user_added_another":
				return msg.server_message.user_who_added;
			
			case "user_removed_another":
				return msg.server_message.user_who_removed;
		}
	},

	/**
	 * Generate a message of the server
	 * 
	 * @param {ConversationMessage} msg
	 * @param {UsersList} users
	 */
	getServerMessage: function(msg, users) {
		if (msg.server_message == null)
			return "";
		
		switch (msg.server_message.type) {
			case "user_created_conv":
				return tr("%1% created the conversation", {
					"1": users.get(msg.server_message.user_id).fullName
				});
			
			case "user_added_another":
				return tr("%1% added %2% to the conversation", {
					"1": users.get(msg.server_message.user_who_added).fullName,
					"2": users.get(msg.server_message.user_added).fullName
				})
			
			case "user_left":
				return tr("%1% left the conversation", {
					"1": users.get(msg.server_message.user_id).fullName
				});

			case "user_removed_another":
				return tr("%1% removed %2% from the conversation", {
					"1": users.get(msg.server_message.user_who_removed).fullName,
					"2": users.get(msg.server_message.user_removed).fullName
				});
		}
	},

	/**
	 * @param {number} convID 
	 * @param {HTMLInputElement} input 
	 * @param {HTMLElement} target 
	 */
	registerInputToSendFile: function(convID, fileInput, progressTarget){
		fileInput.addEventListener("change", async (e) => {
			e.preventDefault();
			
			let el;
			
			try {

				if(fileInput.files.length == 0)
					return;
				
				const file = fileInput.files[0];

				if (ServerConfig.conf.allowed_conversation_files_type.indexOf(file.type) < 0) {
					notify(tr("This file type is not allowed!"), "danger")
					return;
				}


				if (file.size > ServerConfig.conf.conversation_files_max_size) {
					notify(tr("This file is too big (max file size: %1%)", {"1": fileSizeToHuman(ServerConfig.conf.conversation_files_max_size)}), "danger");
					return;
				}

				el = new FileUploadProgress(progressTarget);


				await ConversationsInterface.sendMessage(convID, null, fileInput, (progress) => el.setProgress(progress));
			}

			catch(e) {
				console.error(e);
				notify(tr("Failed to send file!"), "danger");
			}

			el.remove()

		});
	},


	/**
	 * Upload a new conversation image
	 */
	uploadNewConversationImage: async function(convID) {
		let input = document.createElement("input");
		input.type = "file";

		input.click();

		// Wait for file
		await new Promise((res, rej) => input.addEventListener("change", e => res()));

		if(input.files.length == 0) return;

		await ConversationsInterface.sendNewConversationImage(convID, input);
	},

	/**
	 * Automatically listen to change events of an input
	 * to notify other users current user is writing a message
	 * 
	 * @param {HTMLInputElement} input
	 * @param {number} convID
	 */
	listenToInputChangeEvents: async function(input, convID) {
		let last_update = 0;

		input.addEventListener("keyup", e => {
			if(input.value == "")
				return;

			const t = ComunicDate.time();
			if (t - last_update < ServerConfig.conf.conversation_writing_event_interval)
				return;

			last_update = t;
			ws("conversations/is_writing", {convID: convID});
		});
	},

}

ComunicWeb.components.conversations.utils = ConversationsUtils;


/**
 * Get information about a conversation
 * 
 * @param {Conversation} conv Information about the
 * target conversation
 */
async function getConvName(conv) {
	return new Promise((res, rej) => {
		ConversationsUtils.getName(conv, (name) => res(name));
	})
}