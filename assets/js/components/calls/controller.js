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
			});

		});

		// Each time a page is opened, wec check if we have to create calls target
		document.addEventListener("openPage", function(){

			//Signed out users can not make calls
			if(!signed_in())
				return;

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
				ComunicWeb.components.calls.ringScreen.show(name, 30, function(accept){
					
					undoIsProcessing();

					ComunicWeb.components.calls.controller.applyReponseForCall(call, accept);

				});
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

	}
}