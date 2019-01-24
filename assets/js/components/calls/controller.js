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
			
			//Add the call to the list of opened calls
			ComunicWeb.components.calls.currentList.addCallToList(call.id);

			//Initialize call
			ComunicWeb.components.calls.callWindow.initCall(call);

		});

	}
}