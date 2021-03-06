/**
 * Conversations manager
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.conversations.manager = {

	/**
	 * @var {String} The ID of the conversation container
	 */
	__conversationsContainerID: "conversationsElem",

	/**
	 * Display conversations manager
	 * 
	 * @return {Boolean} True for a success
	 */
	display: function(){

		//Try to get conversation manager
		var conversationsContainerElem = byId(this.__conversationsContainerID);

		//Check if element exists or not
		if(conversationsContainerElem){
			ComunicWeb.debug.logMessage("NOTICE : couldn't initializate conversation manager because a conversation manager is already on the page");

			return true;
		}

		//Else inform user and create conversation manager
		ComunicWeb.debug.logMessage("INFO : initializate conversation manager");

		//Create conversations manager element
		var conversationsContainerElem = createElem("div");
		conversationsContainerElem.id = this.__conversationsContainerID;
		
		//Insert the element at the right place
		var pageTarget = byId("pageTarget");
		if(pageTarget){
			//Insert disucssion element before it
			byId("wrapper").insertBefore(conversationsContainerElem, pageTarget);
		}
		else{
			//Just apply the element
			byId("wrapper").appendChild(conversationsContainerElem);
		}

		//Initializate conversation element
		this.init(conversationsContainerElem);

		//Success
		return true;
	},

	/**
	 * Initializate conversations element
	 * 
	 * @param {HTMLElement} conversationsContainerElem The container of the conversation element
	 * @return {Boolean} True for a success
	 */
	init: function(conversationsContainerElem){
		
		//First, add the "open a conversation" new
		this.addOpenConversationButton(conversationsContainerElem);

		//Intializate conversation service
		ComunicWeb.components.conversations.service.init();

		//Then, open any already active conversation
		var openedConversations = ComunicWeb.components.conversations.cachingOpened.getAll();
		
		//Process opened conversations
		for(i in openedConversations){
			if(i < openedConversations.length)
				ComunicWeb.components.conversations.chatWindows.openConversation(openedConversations[i]);
		}

	},

	/**
	 * Add the "open conversation" button
	 * 
	 * @param {HTMLElement} targetElem The target of the button
	 * @return {Boolean} True for a success
	 */
	addOpenConversationButton: function(targetElem){

		//Create the button
		var addButton = createElem("button", targetElem);
		addButton.className = "btn btn-primary open-conversation-button";
		addButton.innerHTML = "Conversations";
		
		
		//Make button lives
		addButton.onclick = function(){
			ComunicWeb.components.conversations.list.display(this);
		}
	},

	/**
	 * Add a new conversation to the list of opened conversation accordingly to specified informations
	 * 
	 * @param {number} convID Informations about the conversation to open
	 */
	addConversation: function(convID){

		//Check if the conversation is already open or not
		if(ComunicWeb.components.conversations.cachingOpened.isopen(convID)){
			ComunicWeb.debug.logMessage("The conversation " + convID + " is already opened !");
			return;
		}

		//Save conversation ID in session storage
		ComunicWeb.components.conversations.cachingOpened.add(convID);

		//Open the conversation
		ComunicWeb.components.conversations.chatWindows.openConversation(convID);
	},

	/**
	 * Open a private conversation with only one user
	 * 
	 * @param {Integer} otherID The ID of the user with who the conversation will be started
	 * @return {Boolean} True for a success
	 */
	openPrivate: function(otherID){

		//Search for such conversation in the database, create it in case of failure
		//Prepare what to do next
		var callback = function(result){

			//In case of error
			if(result.error){
				//Notify user
				ComunicWeb.common.notificationSystem.showNotification("Couldn't create a conversation with this user ! Please try again...", "danger", 2);
				return false;
			}

			//Open the first conversation
			ComunicWeb.components.conversations.manager.addConversation({
				conversationID: result.conversationsID[0],
			});

		};

		//Peform request
		ComunicWeb.components.conversations.interface.searchPrivate(otherID, true, callback);

		//Success
		return true;

	},
}