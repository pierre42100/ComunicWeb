/**
 * Interface between the graphical conversation system and the API
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.conversations.interface = {

	/**
	 * @var {Object} __conversationsList Cached list of conversations
	 */
	__conversationsList: {},

	/**
	 * Get and return the list of available conversations
	 * 
	 * @param {Function} onceGotList What to do next
	 * @param {Boolean} force Force the list to be loaded even if present in the cache
	 * @return {Boolean} True for a success
	 */
	getList: function(onceGotList, force){

		//First, check if the list is already present in the cache or not
		if(this.__conversationsList && !force){
			//Perform next action now
			onceGotList(this.__conversationsList);
		}

		//Else, prepare an API request
		var apiURI = "conversations/getList";
		var params = {}; //No params required now

		//Perform the API request
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, function(results){

			//Check for error
			if(results.error){
				//Log error
				ComunicWeb.debug.logMessage("ERROR : couldn't get conversations list !");

				//Perform next action
				onceGotList(results);
			}
			else {
				//Process the list
				var conversationsList = {};
				for(i in results){
					conversationsList["conversation-"+results[i].ID] = results[i];
				}

				//Save the list in the cache
				ComunicWeb.components.conversations.interface.__conversationsList = conversationsList;

				//Perform next action
				onceGotList(conversationsList);
			}

		});

		//Success
		return true;
	},

	/**
	 * Create a conversation
	 * 
	 * @param {Object} infos Informations about the conversation to create
	 * * @info {Array} users A list of the members of the conversation
	 * * @info {Boolean} follow Defines if the current user wants to follow the conversation or not
	 * * @info {Mixed} conversationName The name of the conversation
	 * @param {Function} afterCreate What to do once the conversation is created
	 * @return {Boolean} True for a success
	 */
	createConversation: function(infos, afterCreate){

		//Prepare an API request
		var apiURI = "conversations/create";
		var params = {
			name: infos.conversationName,
			follow : infos.follow,
			users: infos.users,
		};

		//Perform the API request
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, function(result){

			//Check for errors
			if(result.error){
				//Log error
				ComunicWeb.debug.logMessage("ERROR ! Couldn't create a conversation!");
			}

			//Perform next action
			afterCreate(result);

		});

		//Success
		return true;
	},

	/**
	 * Update conversation settings
	 * 
	 * @param {infos} infos Informations about the conversation to update
	 * @info {Integer} conversationID The ID of the conversation to update
	 * @info {Boolean} following Specify if the user is following the conversation or not
	 * @info {String} name Specify a new name for the conversation
	 * @info {array} members Specify the new list of members for the conversation
	 * @param {function} callback The function callback
	 * @return {Boolean} True for a success
	 */
	updateSettings: function(infos, callback){
		//Prepare the API request
		var apiURI = "conversations/updateSettings";
		var params = {
			conversationID: infos.conversationID
		};

		//Add conversation name (if specified)
		if(infos.name !== undefined)
			params.name = infos.name;
		
		//Add conversation members (if specified)
		if(infos.members)
			params.members = infos.members;
		
		//Add conversation following status (if specified)
		if(infos.following !== undefined)
			params.following = infos.following;

		//Perform API request
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, function(result){
			//Empty the cache (considered as deprecated)
			ComunicWeb.components.conversations.interface.emptyCache(true);

			//Check for error
			if(result.error)
				ComunicWeb.debug.logMessage("Error! An error occured while trying to update conversation settings !");

			//Perform next action
			callback(result);
			
		});

		//Success
		return true;
	},

	/**
	 * Get informations about a unique conversation
	 * 
	 * @param {Integer} conversationID The ID of the conversation
	 * @param {function} nextStep What to do once the operation is completed
	 * @param {Boolean} forceRefresh Force informations about the conversation to be fetched (ignore cached informations)
	 * @return {Boolan} True for a success
	 */
	getInfosOne: function(conversationID, nextStep, forceRefresh){

		//First, if the conversation is available in the cache
		if(!forceRefresh && this.__conversationsList['conversation-'+conversationID]){

			//Perform next action now without getting fresh informations on the server
			nextStep(this.__conversationsList['conversation-'+conversationID]);

			//Success
			return true;
		}

		//Else, perform an API request
		var apiURI = "conversations/getInfosOne";
		var params = {
			conversationID: conversationID,
		};

		//Perform the API request
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, function(result){

			//Check for errors
			if(result.error){
				
				//Log error
				ComunicWeb.debug.logMessage("Couldn't get informations about the conversation number "+conversationID+" !");

				//Perform next action now
				nextStep(result);

				return false;
			}

			//Else it is a success
			//Cache the result
			ComunicWeb.components.conversations.interface.__conversationsList["conversation-"+conversationID] = result;

			//Perform next action
			nextStep(result);

			return true;

		});

		//Success
		return true;
	},

	/**
	 * Search for private conversation
	 * 
	 * @param {Integer} otherUser The ID of the other user
	 * @param {Boolean} allowCreation Allow the server to create the conversation if not found
	 * @param {function} callback What to do once the request is completed
	 * @return {Boolean} True for a success
	 */
	searchPrivate: function(otherUser, allowCreation, callback){

		//Perform an API request
		var apiURI = "conversations/getPrivate";
		var params = {
			otherUser: otherUser,
			allowCreate: allowCreation
		}

		//Perform API request
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, function(result){

			//Check for errors
			if(result.error)
				ComunicWeb.debug.logMessage("An error occured while trying to get a private conversation ID !");
			
			//Perfrorm next action
			callback(result);

		});

		//Success
		return true;
	},

	/**
	 * Send a new message
	 * 
	 * @param {Object} infos Informations about the message to send
	 * @info {Integer} conversationID The ID of the conversation
	 * @info {String} message The message to send
	 * @info {HTMLElement} image Optionnal, input field with an image
	 * @info {function} callback What to do once the image was successfully sent
	 * @return {Boolean} true for a success
	 */
	sendMessage: function(infos){

		//Perform an API request
		var apiURI = "conversations/sendMessage";

		var hasImage = false;
		if(infos.image){
			if(infos.image.files[0])
				hasImage = true;
		}

		//Check wether an image has to be included or not
		if(!hasImage){

			//Prepare request
			var params = {
				message: infos.message,
				conversationID: infos.conversationID,
			};

			//Perform an API request
			ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, infos.callback);
		}

		//If we have an image, we must do a formdata request
		else {

			var fd = new FormData();
			fd.append("message", infos.message);
			fd.append("conversationID", infos.conversationID);
			fd.append("image", infos.image.files[0], infos.image.files[0].name);

			//Perform an API request
			ComunicWeb.common.api.makeFormDatarequest(apiURI, fd, true, infos.callback);
		}
	},

	/**
	 * Refresh a conversation
	 * 
	 * @param {Array} newConversations New conversations (which requires the 10 last messages)
	 * @param {Object} toRefresh Conversations to refresh
	 * @param {Function} callback The callback function
	 * @return {Boolean} True for a success
	 */
	refreshConversations: function(newConversations, toRefresh, callback){

		//Perform a request on the API
		var apiURI = "conversations/refresh";
		var params = {
			newConversations: newConversations,
			toRefresh: JSON.stringify(toRefresh),
		}

		//Perform an API request
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);

		//Success
		return true;
	},

	/**
	 * Get the list of unread conversations
	 * 
	 * @param {function} callback
	 */
	getUnreadConversations: function(callback){

		//Perform a request on the API
		var apiURI = "conversations/get_list_unread";
		var params = {};

		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);

	},

	/**
	 * Get older message of a conversation
	 * 
	 * @param {number} conversationID The ID of the conversation
	 * @param {number} oldestMessageID The ID of the oldest message known
	 * @param {number} limit The limit
	 * @param {function} callback
	 */
	getOlderMessages: function(conversationID, oldestMessageID, limit, callback){

		//Perform a request on the API
		var apiURI = "conversations/get_older_messages";
		var params = {
			conversationID: conversationID,
			oldest_message_id: oldestMessageID,
			limit: limit
		};

		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
	},

	/**
	 * Get the the lastest messages of a single conversation
	 * 
	 * @param {Number} convID Target conversation ID
	 * @param {Number} lastMessageID The ID of the last known message
	 * @param {function} callback
	 */
	refreshSingleConversation: function(convID, lastMessageID, callback){

		//Perform a request on the API
		var apiURI = "conversations/refresh_single";
		var params = {
			conversationID: convID,
			last_message_id: lastMessageID
		};

		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);

	},

	/**
	 * Empty conversations cache
	 * 
	 * @param {Boolean} notHard Specify that the object hasn't to be recursively cleaned
	 * @return {Boolean} True for a success
	 */
	emptyCache: function(notHard){
		//Empty cache
		if(!notHard)
			clearObject(this.__conversationsList);
		else
			this.__conversationsList = {}; //"Light" clean

		//Success
		return true;
	},
}

//Register conversations cache cleaning function
ComunicWeb.common.cacheManager.registerCacheCleaner("ComunicWeb.components.conversations.interface.emptyCache");