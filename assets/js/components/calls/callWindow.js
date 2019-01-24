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
			open: true,
			window: {},
			streams: {}
		};

		//We have to begin to draw conversation UI
		var callContainer = createElem2({
			appendTo: byId("callsTarget") ? byId("callsTarget") : byId("wrapper"), //If call target is not found, add call in page wrapper
			type: "div",
			class: "call-window" 
		});
		call.window.container = callContainer;


		//Create loading message area
		call.window.loadingMessageContainer = createElem2({
			appendTo: callContainer,
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
		}

		call.window.closeButton.addEventListener("click", function(){
			call.close();
		});


		//Get information about related conversation to get the name of the call
		ComunicWeb.components.conversations.interface.getInfosOne(info.conversation_id, function(conv_info){

			if(conv_info.error)
				return notify("Could not get information about related conversation!", "danger");
			
			ComunicWeb.components.conversations.utils.getName(conv_info, function(name){
				call.setTitle(name);
			})

		}, false);

		//Load user media
		call.setLoadingMessage("Waiting for your microphone and camera...");

		ComunicWeb.components.calls.userMedia.get().then(function(stream){

			//Mark as connecting
			call.setLoadingMessage("Connecting...");

			call.streams.local = stream;

			return true;

		}).catch(function(e){
			console.error("Get user media error: ", e);
			call.setLoadingMessageVisibility(false);
			return notify("Could not get your microphone and camera!", "danger");
		});
	}

}