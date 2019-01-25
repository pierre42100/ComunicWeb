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



		/**
		 * Initialize utilities
		 */

		/**
		 * Get member information based on call ID
		 * 
		 * @param {String} id The ID of the peer to process
		 * @return Information about the peer / empty object
		 * if no peer found
		 */
		call.getMemberByCallID = function(id){
			var memberInfo = undefined;
			call.info.members.forEach(function(member){

				if(member.user_call_id == id)
					memberInfo = member;

			});
			return memberInfo;
		}



		/**
		 * We have to begin to draw conversation UI
		 */
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


		//Call videos target
		call.window.videosTarget = createElem2({
			appendTo: call.window.body,
			type: "div",
			class: "streams-target"
		});


		/**
		 * Create loading message area
		 */
		call.window.loadingMessageContainer = createElem2({
			insertBefore: call.window.body.firstChild,
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
			call.setLoadingMessageVisibility(true);
			call.window.loadingMessageContent.innerHTML = message;
		}




		//Load user media
		call.setLoadingMessage("Waiting for your microphone and camera...");

		ComunicWeb.components.calls.userMedia.get().then(function(stream){

			//Check if connection has already been closed
			if(!call.open)
				return;

			call.localStream = stream;

			//Initialize signaling server connection
			ComunicWeb.components.calls.callWindow.initializeConnectionToSignalingServer(call);

			//Add local stream to the list of visible stream
			ComunicWeb.components.calls.callWindow.addVideoStream(call, true, stream);

			//Mark as connecting
			call.setLoadingMessage("Connecting...");

			return true;

		}).catch(function(e){
			console.error("Get user media error: ", e);
			call.setLoadingMessageVisibility(false);
			return notify("Could not get your microphone and camera!", "danger");
		});

		/**
		 * Start to automaticaly refresh information about the call
		 */
		var interval = setInterval(function(){

			if(!call.open)
				return clearInterval(interval);

			ComunicWeb.components.calls.callWindow.refreshInfo(call);

		}, 4000);

	},


	/**
	 * Initialize connection to signaling server
	 * 
	 * @param {Object} call Information about the call
	 */
	initializeConnectionToSignalingServer: function(call) {

		//Get current user call ID
		call.info.members.forEach(function(member){

			if(member.userID == userID())
				call.localPeerID = member.user_call_id;
		});


		//Create client instance and connect to server
		var config = ComunicWeb.components.calls.controller.getConfig();
		call.signalClient = new SignalExchangerClient(
			config.signal_server_name,
			config.signal_server_port,
			call.localPeerID
		);


		/**
		 * Error when connecting to signaling server
		 */
		call.signalClient.onError = function(){
			call.setLoadingMessage("Could not connect to signaling server!");
			call.open = false;
		};

		/**
		 * Connection to signaling server is not supposed to close
		 */
		call.signalClient.onClosed = function(){
			call.setLoadingMessage("Connection to signaling server closed!");
			call.open = false;
		}

		/**
		 * A remote peer sent a ready notice
		 */
		call.signalClient.onReadyMessage = function(peerID){
			ComunicWeb.components.calls.callWindow.readyToInitialize(call, peerID);
		}

		/**
		 * A remote peer sent a signal
		 */
		call.signalClient.onSignal = function(signal, peerID){
			ComunicWeb.components.calls.callWindow.receivedSignal(call, peerID, signal);
		}

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

		//Check if we are connected to signaling server and we have got local
		//streams
		if(!call.signalClient || !call.signalClient.isConnected() || !call.localStream)
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

		//Process the connection to each accepted member
		call.info.members.forEach(function(member){

			//Ignores all not accepted connection
			if(member.userID == userID() || member.accepted !== "accepted")
				return;
			
			//Check if we have not peer information
			if(!call.streams.hasOwnProperty("peer-" + member.userID)){

				//If the ID of the current user is bigger than the remote
				//peer user ID, we wait a ready signal from him
				if(member.userID < userID())
					return;

				//Else we have to create peer
				ComunicWeb.components.calls.callWindow.createPeerConnection(call, member, false);
			}

		});
	
	},

	/**
	 * Create a peer connection
	 * 
	 * @param {Object} call Information about the peer
	 * @param {Object} member Information about the member
	 * @param {Boolean} isInitiator Specify whether current user is the
	 * initiator of the connection or not
	 */
	createPeerConnection: function(call, member, isInitiator){

		var peerConnection = {
			peer: undefined
		};
		call.streams["peer-" + member.userID] = peerConnection;

		//Get call configuration
		var config = ComunicWeb.components.calls.controller.getConfig();

		//Create peer
		var peer = new SimplePeer({ 
			initiator: isInitiator,
			stream: call.localStream,
			trickle: false,
			config: {
				'iceServers': [
					{ urls: config.stun_server },
					{"url": config.turn_server, 
										"credential": config.turn_username,
										"username": config.turn_password}
				]
			}
		});
		peerConnection.peer = peer;
	
		//Add a function to remove connection
		peerConnection.removePeerConnection = function(){
			peer.destroy();
			delete call.streams["peer-" + member.userID];

			if(peerConnection.video)
				peerConnection.video.remove();
		}


		peer.on("error", function(err){
			console.error("Peer error !", err, member);
			peerConnection.removePeerConnection();
		});

		peer.on("signal", function(data){
			console.log('SIGNAL', JSON.stringify(data));
			call.signalClient.sendSignal(member.user_call_id, JSON.stringify(data));
		});

		peer.on("message", message => {
			console.log("Message from remote peer: " + message);
		});


		peer.on("close", function(){
			peerConnection.removePeerConnection();
		});

		peer.on("stream", function(stream){
			ComunicWeb.components.calls.callWindow.streamAvailable(call, member, stream);
		});

		
		//If this peer does not initialize connection, inform other peer we are ready
		if(!isInitiator)
			call.signalClient.sendReadyMessage(member.user_call_id);
	},


	/**
	 * This method is called when a remote peers notify it is ready to
	 * establish connection
	 * 
	 * @param {Object} call Information about the call
	 * @param {String} peerID Remote peer ID
	 */
	readyToInitialize: function(call, peerID){

		var member = call.getMemberByCallID(peerID);
		if(member == undefined)
			return;
		
		//It the user with the smallest ID who send the ready message
		//else it would mess everything up
		if(member.userID > userID())
			return;

		this.createPeerConnection(call, member, true);
	},

	/**
	 * This method is called when we received a remote signal
	 * 
	 * @param {Object} call Information about the call
	 * @param {String} peerID Remote peer ID
	 * @param {String} signal Received signal
	 */
	receivedSignal: function(call, peerID, signal){

		console.log("Received signal from " + peerID, signal);

		var member = call.getMemberByCallID(peerID);
		if(member == undefined)
			return;

		//Check we have got peer information
		if(!call.streams.hasOwnProperty("peer-" + member.userID))
			return;

		call.streams["peer-" + member.userID].peer.signal(JSON.parse(signal));
	},

	/**
	 * This method is called when a remote stream becomes available
	 * 
	 * @param {Object} call Information about remote call
	 * @param {String} member Information about target member
	 * @param {MediaStream} stream Remote stream available
	 */
	streamAvailable: function(call, member, stream){
		
		call.setLoadingMessageVisibility(false);

		call.streams["peer-" + member.userID].stream = stream;

		call.streams["peer-" + member.userID].video = this.addVideoStream(call, false, stream);

	},

	/**
	 * Create and set a video object for a stream
	 * 
	 * @param {Object} call Target call
	 * @param {Boolean} muted Specify whether audio should be muted
	 * or not
	 * @param {MediaStream} stream Target stream
	 * @return {HTMLVideoElement} Generated video element
	 */
	addVideoStream: function(call, muted, stream){

		/**
		 * @type {HTMLVideoElement}
		 */
		let video = createElem2({
			appendTo: call.window.videosTarget,
			type: "video"
		});

		video.muted = muted;

		//Set target video object and play it
		video.srcObject = stream;
		video.play();

		return video;
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

		//Close all socket connections
		for (var key in call.streams) {
			if (call.streams.hasOwnProperty(key)) {
				var element = call.streams[key];
				element.removePeerConnection();
			}
		}
	}
}