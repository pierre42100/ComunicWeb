/**
 * Calls controller
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.calls.controller = {

	/**
	 * This variable contains the initialization state
	 * of the call component
	 */
	_is_init: false,

	/**
	 * This variable contains whether the user is being
	 * notified of a call or not
	 */
	_is_processing_call: false,

	/**
	 * Initialize calls component
	 */
	init: function(){
	
		//We init this component just once
		if(this._is_init)
			return;

		ComunicWeb.debug.logMessage("Initialize calls component");

		//Initialize call container
		var initializeCallContainer = function(){

			//Signed out users can not make calls
			if(!signed_in()){
				ComunicWeb.components.calls.controller.userSignedOut();
				return;
			}

			//Need a wrapper to continue
			if(!byId("wrapper"))
				return;

			//Check if calls target already exists
			if(byId("callsTarget"))
				return;
			
			//Call system must be available
			if(!ComunicWeb.components.calls.controller.isAvailable())
				return;
				
			//Create call target
			createElem2({
				appendTo: byId("wrapper"),
				type: "div",
				id: "callsTarget"
			});

			//Now we have to reopen current calls
			ComunicWeb.components.calls.controller.reopenCurrentCalls();
		}

		//We wait the user to be connected before trying to get
		// call configuration
		document.addEventListener("got_user_id", function(){

			//Check if we have already the call configuration
			if(ComunicWeb.components.calls.__config !== undefined)
				return;
			
			ComunicWeb.components.calls.interface.getConfig(function(config){

				//Check if we could not get calls configuration
				if(config.error)
					return;

				//Save calls configuration
				ComunicWeb.components.calls.__config = config;

				initializeCallContainer();
			});

		});

		// Each time a page is opened, wec check if we have to create calls target
		document.addEventListener("openPage", function(){
			initializeCallContainer();
		});
	},

	/**
	 * Access calls configuration
	 * 
	 * @return Cached calls configuration
	 */
	getConfig() {
		return ComunicWeb.components.calls.__config;
	},

	/**
	 * Check if the call feature is available or not
	 */
	isAvailable: function(){

		//If do not have any call configuration, it is not possible to
		//make calls
		if(this.getConfig() == null)
			return false;

		//Read configuration
		return this.getConfig().enabled;
	},

	/**
	 * Initiate a call for a conversation
	 * 
	 * @param {Number} conversationID The ID of the target conversation
	 */
	call: function(conversationID){
		
		//Create / Get call information for the conversation
		ComunicWeb.components.calls.interface.createForConversation(conversationID, function(call){

			if(call.error)
				return notify("Could not get a call for this conversation!", "danger");
			
			ComunicWeb.components.calls.controller.open(call);

		});

	},

	/**
	 * Call this method to initialize a call for a call we have information about
	 * 
	 * @param {Object} call Information about the call
	 */
	open: function(call){

		//Add the call to the list of opened calls
		ComunicWeb.components.calls.currentList.addCallToList(call.id);

		//Initialize call
		ComunicWeb.components.calls.callWindow.initCall(call);
	},

	/**
	 * This method is called each time the notification service
	 * detect that the number of pending calls has increased. It
	 * must in fact be "thread-safe" to avoid to do twice things
	 * that should be one only once
	 * 
	 * @param {number} number The number of pending calls
	 */
	newCallsAvailable: function(number){

		//Check if user is already processing a call
		if(this._is_processing_call)
			return;
		this._is_processing_call = true;
		
		/**
		 * Switch processing call to false
		 */
		var undoIsProcessing = function(){
			ComunicWeb.components.calls.controller._is_processing_call = false;
		}

		//Get information about the next pending call
		ComunicWeb.components.calls.interface.getNextPendingCall(function(call){
			
			//Check if there is no pending call
			if(call.notice)
				return undoIsProcessing();
			
			ComunicWeb.components.conversations.utils.getNameForID(call.conversation_id, function(name){

				//Check for errors
				if(!name){
					ComunicWeb.debug.logMessage("Could not get the name of the conversation for a call, cannot process it!");
					undoIsProcessing();
					return;
				}

				//Show ring screen
				var prompting = true;
				var ringScreenInfo = ComunicWeb.components.calls.ringScreen.show(name, 30, function(accept){
					
					prompting = false;

					undoIsProcessing();

					ComunicWeb.components.calls.controller.applyReponseForCall(call, accept);

				});

				//Regulary check if the call is still valid
				var interval = setInterval(function(){

					if(!prompting)
						return clearInterval(interval);

					ComunicWeb.components.calls.interface.getInfo(call.id, function(info){

						//Check for errors
						if(info.error)
							return;

						//Refuse the call if everyone has left it
						if(ComunicWeb.components.calls.utils.hasEveryoneLeft(info))
						ringScreenInfo.respond(false);
					});
				}, 2000);


			});

		});
	},

	/**
	 * Apply a response for the call
	 * 
	 * @param {Object} call Information about the target call
	 * @param {Boolean} accept TRUE to accept call / FALSE else
	 */
	applyReponseForCall: function(call, accept){

		//Send response to server
		ComunicWeb.components.calls.interface.respondToCall(call.id, accept, function(r){

			//Check for error
			if(r.error)
				return notify("Could not send response to call to server!", "danger");

			if(!accept)
				return;
			
			//We may start the call now
			ComunicWeb.components.calls.controller.open(call);

		});

	},

	/**
	 * Reopen all current calls
	 */
	reopenCurrentCalls: function(){

		//Process each call to open it
		ComunicWeb.components.calls.currentList.getCurrentCallsList().forEach(function(entry){
			
			ComunicWeb.components.calls.interface.getInfo(entry, function(call){

				if(call.error){
					ComunicWeb.components.calls.currentList.removeCallFromList(entry);
					return notify("Could not get information about a call!", "danger");
				}
				
				ComunicWeb.components.calls.controller.open(call);

			});

		});

	},

	/**
	 * Call this method only if the system is sure that
	 * nobody is signed in the current tab
	 */
	userSignedOut: function(){
		
		//Remove all the current calls from the list
		ComunicWeb.components.calls.currentList.removeAllCalls();

	}
}