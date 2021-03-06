/**
 * Conversations list window
 * 
 * @author Pierre HUBERT
 */

const ConversationsList = {
	/**
	 * Display conversations list window
	 * 
	 * @param {HTMLElement} nodeBefore The node before the destination
	 * @return {Boolean} True for a success
	 */
	display: function(nodeBefore){

		//Log action
		ComunicWeb.debug.logMessage("INFO : initialize conversation list box.");

		//Create a window
		var listBox = ComunicWeb.components.conversations.windows.create(nodeBefore);

		//Change box title
		listBox.boxTitle.innerHTML = "Conversations";

		//Change box root elem class
		listBox.rootElem.className += " conversations-list-box";

		//Remove footer
		listBox.boxFooter.remove();

		//Add the create button
		/*var createButton = createElem("button");
		listBox.boxTools.insertBefore(createButton, listBox.boxTools.children[0]);
		createButton.className = "btn btn-box-tool";
		createButton.onclick = function(){
			ComunicWeb.components.conversations.list.displayCreateForm(listBox);
			this.remove();
		}

			//Button icon
			var createButtonIcon = createElem("i", createButton);
			createButtonIcon.className = "fa fa-pencil";*/

		//Get and display conversations list
		this.showConversationsList(listBox);

		//Success
		return true;
	},

	/**
	 * Display the form to create a new conversation
	 * 
	 * @param {Object} listBox Informations about the listbox target
	 * @return {Boolean} True for a success
	 */
	displayCreateForm: function(listBox){

		//Log action
		ComunicWeb.debug.logMessage("INFO : initialize create conversation form");

		//Hide boxy body contents
		var boxBodyElem = listBox.boxBody.children;
		for(i in boxBodyElem){
			if(boxBodyElem[i].style)
				boxBodyElem[i].style.display = "none";
		}

		//Change box title
		listBox.boxTitle.innerHTML = tr("New conversation");

		//Create the form
		var form = ConversationsUtils.createConversationForm(listBox.boxBody);

		//Generate a summary object about all the informations we have got
		var infos = {
			listBox: listBox,
			usersElement: form.usersElement,
			conversationNameInput: form.conversationNameInput,
			conversationColorInput: form.conversationColorInput,
			followConversationInput: form.followConversationInput,
			allowEveryoneToAddMembersInput: form.allowEveryoneToAddMembers,
		};

		//Make button lives
		form.createButton.onclick = () => {
			this.submitCreateConversationForm(infos);
		};

		//Success
		return true;
	},

	/**
	 * Submit a create a conversation form
	 * 
	 * @param {Object} infos Data to pass to the function
	 * * @info {Object} listBox Informations about the listbox creating the conversation
	 * * @info {HTMLElement} usersElement Pointer on userElement
	 * * @info {HTMLElement} conversationNameInput Pointer on the input of the form of the conversation
	 * * @info {HTMLElement} followConversationInput Pointer on the "follow conversation" checkbox
	 * * @info {HTMLElement} allowEveryoneToAddMembersInput
	 * @return {Boolean} True for a success
	 */
	submitCreateConversationForm: function(infos){

		//First, get the list of users
		var selectedUsers = ComunicWeb.components.userSelect.getResults(infos.usersElement);

		//We check if less than one user was selected
		if(selectedUsers.length < 1){
			//Display an error notification
			ComunicWeb.common.notificationSystem.showNotification("Please select at least one user!", "danger", 2);

			return false;
		}

		//Add current user to the list
		selectedUsers.push(ComunicWeb.user.userLogin.getUserID());

		//Prepare the creation of the conversation
		//Get all required informations
		var conversationInformations = {
			users: selectedUsers,
			follow: infos.followConversationInput.checked,
			conversationName: (infos.conversationNameInput.value == "" ? false : infos.conversationNameInput.value),
			color: infos.conversationColorInput.value == "" ? null : infos.conversationColorInput.value,
			allowEveryoneToAddMembersInput: infos.allowEveryoneToAddMembersInput.checked,
		};

		//Change box body style
		var splashScreen = ComunicWeb.common.page.showTransparentWaitSplashScreen(infos.listBox.boxBody);

		//Contact the interface to create the conversation
		ConversationsInterface.createConversation(conversationInformations, function(response){

			//First, remove splash screen
			splashScreen.remove();

			//Check for errors
			if(response.error){
				//Make an error notification
				notifMessage = "An error occured while trying to create conversation. Please try again.";
				ComunicWeb.common.notificationSystem.showNotification(notifMessage, "danger", 3);

				return false;
			}

			//Success
			notifMessage = "The conversation was successfully created !";
			ComunicWeb.common.notificationSystem.showNotification(notifMessage, "success", 2);

			//Remove the conversation box
			infos.listBox.rootElem.remove();

			//Add & open the conversation
			ComunicWeb.components.conversations.manager.addConversation(response.conversationID);
		})
	},

	/**
	 * Show the conversations list
	 * 
	 * @param {Object} listBox HTML elements about the listBox
	 * @return {Boolean} True for a success
	 */
	showConversationsList: function(listBox){

		//Get and show the conversation list
		ComunicWeb.components.conversations.interface.getList(function(conversations){

			//Add the "create a conversation button"
			var createConversationButton = createElem("button", listBox.boxBody);
			createConversationButton.style.width = "100%";
			createConversationButton.style.marginBottom = "5px";
			createConversationButton.className = "btn btn-default btn-flat";
			createConversationButton.innerHTML = "Create a new conversation";

			//Create a ul element that will contain conversation list
			var ulElem = createElem("ul", listBox.boxBody);
			ulElem.className = "nav nav-pills nav-stacked";

			//Make create converstion button lives
			createConversationButton.onclick = function(){
				ComunicWeb.components.conversations.list.displayCreateForm(listBox);
			};

			//Process each conversation elements
			for(i in conversations){

				//Extract conversation informations
				var conversationInfos = conversations[i];

				//Create subElement
				var liElem = createElem("li", ulElem);
				
				//Display entry
				ComunicWeb.components.conversations.list.showConversationEntry(conversationInfos, liElem, listBox);
			}

			//Enable scrollbar
			$(ulElem).slimScroll({
					height: '100%'
			});

		}, true);

		//Success
		return true;
	},

	/**
	 * Show a conversation entry
	 *
	 * @param {Conversation} conv Information about the conversation
	 * @param {HTMLElement} entryTarget The target for the entry
	 * @param {Object} listBox HTML elements about the listBox
	 * @return {Boolean} True for a success
	 */
	showConversationEntry: function(conv, entryTarget, listBox){
		
		//Create link element
		var linkElem = createElem("a", entryTarget);

		//Make the link element live
		linkElem.onclick = function(){
			//Remove conversations list
			listBox.rootElem.remove();

			//Add & open conversation
			ComunicWeb.components.conversations.manager.addConversation(conv.id);
		}

		//Add conversations last activity
		var lastActivityElem = createElem("small", linkElem);
		lastActivityElem.className = "pull-right last-activity";
		var lastActivityIcon = createElem("i", lastActivityElem);
		lastActivityIcon.className = "fa fa-clock-o";
		var lastActivityValueElem = createElem("span", lastActivityElem);

		//Calculate last conversation activity
		var currentTime = ComunicWeb.common.date.time();
		lastActivityValueElem.innerHTML = " "+ComunicWeb.common.date.diffToStr(currentTime - conv.last_activity);


		//Create the conversation name element
		var conversationNameElem = createElem("strong", linkElem);
		
		//Put conversation name field in a waiting state
		conversationNameElem.style.fontSize = "90%";
		conversationNameElem.innerHTML = "Loading...";

		//Get conversation name and apply it
		ComunicWeb.components.conversations.utils.getName(conv, function(conversationName){
			conversationNameElem.innerHTML = conversationName;
		});

		//Add members number
		//Create paragraph
		var membersNumberParagraphElem = createElem("p", linkElem);
		membersNumberParagraphElem.className = "conversations-members-numbers";
		var membersNumberSmallElem = createElem("small", membersNumberParagraphElem);

		//Add icon
		var membersNumberIconElem = createElem("i", membersNumberSmallElem);
		membersNumberIconElem.className = "fa fa-users";

		//Specify value
		var membersNumberValueElem = createElem("span", membersNumberSmallElem);
		membersNumberValueElem.innerHTML = (conv.members.length === 1 ? tr("1 member") : conv.members.length + " members");

		//Success
		return true;
	}
}

ComunicWeb.components.conversations.list = ConversationsList;