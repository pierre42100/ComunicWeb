/**
 * Single call window management
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.calls.callWindow = {

	/**
	 * Initialize a call
	 * 
	 * @param {Object} info Information about the call to initialize
	 */
	initCall: function(info){

		/**
		 * Initialize call object
		 */
		var call = {
			info: info,

			/**
			 * @type {String}
			 */
			localPeerID: undefined,

			/**
			 * @type {Boolean}
			 */
			open: true,

			window: {},
			streams: {},

			/**
			 * @type {SignalExchangerClient}
			 */
			signalClient: undefined
		};

		//We have to begin to draw conversation UI
		var callContainer = createElem2({
			appendTo: byId("callsTarget") ? byId("callsTarget") : byId("wrapper"), //If call target is not found, add call in page wrapper
			type: "div",
			class: "call-window" 
		});
		call.window.container = callContainer;


		//Add toolbar
		call.window.toolbar = createElem2({
			appendTo: callContainer,
			type: "div",
			class: "call-toolbar",
			innerHTML: "<i class='fa fa-phone'>"
		});

		//Call title
		call.window.title = createElem2({
			appendTo: call.window.toolbar,
			type: "div",
			class: "call-title",
			innerHTML: "Loading..."
		});

		/**
		 * Update the title of the call
		 */
		call.setTitle = function(title){
			call.window.title.innerHTML = title;
		}

		//Add close button
		call.window.closeButton = createElem2({
			appendTo: call.window.toolbar,
			type: "button",
			class: "btn btn-box-tool close-btn",
			innerHTML: "<i class='fa fa-times'></i>"
		});

		//Make close button lives
		call.close = function(){
			call.open = false;
			callContainer.remove();

			//Close sockets connections too
			ComunicWeb.components.calls.callWindow.stop(call);
		}

		call.window.closeButton.addEventListener("click", function(){
			call.close();
		});


		//Get information about related conversation to get the name of the call
		ComunicWeb.components.conversations.utils.getNameForID(info.conversation_id, function(name){

			if(!name)
				return notify("Could not get information about related conversation!", "danger");
			
			call.setTitle(name);

		});


		//Call box body
		call.window.body = createElem2({
			appendTo: callContainer,
			type: "div",
			class: "call-window-body"
		});



		
		/**
		 * Create loading message area
		 */
		call.window.loadingMessageContainer = createElem2({
			appendTo: call.window.body,
			type: "div",
			class: "loading-message-container",
			innerHTML: "<i class='fa fa-clock-o'></i>"
		});

		call.window.loadingMessageContent = createElem2({
			appendTo: call.window.loadingMessageContainer,
			type: "div",
			class: "message",
			innerHTML: "Loading..."
		});

		/**
		 * Set loading message visiblity
		 * 
		 * @param {Boolean} visible TRUE to make it visible / FALSE else
		 */
		call.setLoadingMessageVisibility = function(visible){
			call.window.loadingMessageContainer.style.display = visible ? "flex" : "none";
		}

		/**
		 * Update call loading message
		 * 
		 * @param {String} message The new message to show to the
		 * users
		 */
		call.setLoadingMessage = function(message){
			call.window.loadingMessageContent.innerHTML = message;
		}




		//Load user media
		call.setLoadingMessage("Waiting for your microphone and camera...");

		ComunicWeb.components.calls.userMedia.get()
		.then(function(stream){

			//Mark as connecting
			call.setLoadingMessage("Connecting...");

			call.streams.local = stream;

			return true;

		})
		
		//Start to automaticaly refresh information the call
		.then(function(){
			
			var interval = setInterval(function(){

				if(!call.open)
					return clearInterval(interval);

				ComunicWeb.components.calls.callWindow.refreshInfo(call);

			}, 4000);

			return true;

		})
		
		.catch(function(e){
			console.error("Get user media error: ", e);
			call.setLoadingMessageVisibility(false);
			return notify("Could not get your microphone and camera!", "danger");
		});


		//Initialize connection to signaling server

		//Get current user call ID
		call.info.members.forEach(function(member){

			if(member.userID == userID())
				call.localPeerID = member.user_call_id;
		});

		var config = ComunicWeb.components.calls.controller.getConfig();
		call.signalClient = new SignalExchangerClient(
			config.signal_server_name,
			config.signal_server_port,
			call.localPeerID
		);
	},

	/**
	 * Refresh at a regular interval information about the call
	 * 
	 * @param {Object} call Call Root object
	 */
	refreshInfo: function(call){

		ComunicWeb.components.calls.interface.getInfo(call.info.id, function(result){

			if(result.error)
				return notify("Could not get information about the call!", "danger");

			call.info = result;

			ComunicWeb.components.calls.callWindow.gotNewCallInfo(call);
		});

	},

	/**
	 * This method get called each time information about the call
	 * are refreshed on the server
	 * 
	 * @param {Object} call Information about the call
	 */
	gotNewCallInfo: function(call) {

		//Check if we are connected to signaling server
		if(!call.signalClient.isConnected())
			return;

		//Check if all other members rejected call
		var allRejected = true;
		call.info.members.forEach(function(member){
			if(member.accepted != "rejected" && member.userID != userID())
				allRejected = false;
		});

		//Check if all call peer rejected the call
		if(allRejected){
			call.setLoadingMessage("All other peers rejected the call !");

			setTimeout(function(){
				call.close();
			}, 20000);

			return;
		}
	},

	/**
	 * Stop the ongoing call
	 * 
	 * @param {Object} call Information about the call
	 */
	stop: function(call){

		//Remove the call from the opened list
		ComunicWeb.components.calls.currentList.removeCallFromList(call.info.id);

		//Close the connection to the server
		if(call.signalClient.isConnected())
			call.signalClient.close();

	}
}