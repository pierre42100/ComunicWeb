/**
 * Calls window
 * 
 * @author Pierre Hubert
 */


class CallWindow extends CustomEvents {

	/**
	 * Create a new call window
	 * 
	 * @param {Conversation} conv Information about the target conversation
	 */
	constructor(conv) {
		super()
		
		// Initialize variables
		this.conv = conv;
		this.callID = conv.ID;

		/** @type {Map<number, Peer>} */
		this.peersEls = new Map()

		/** @type {Map<number, HTMLVideoElement>} */
		this.videoEls = new Map()


		this.construct(conv);
	}

	async construct(conv) {

		try {
			// Check if calls target exists or not
			if(!byId("callsTarget"))
				createElem2({
					appendTo: byId("wrapper"),
					type: "div",
					id: "callsTarget",
				})
			
			this.conv = conv;

			this.rootEl = createElem2({
				appendTo: byId("callsTarget"),
				type: "div",
				class: "call-window"
			})

			
			// Construct head
			this.windowHead = createElem2({
				appendTo: this.rootEl,
				type: "div",
				class: "head",
				innerHTML: "<i class='fa fa-phone'></i>" +
					await getConvName(conv) + 
					" <span class='pull-right'></span>"
			})

			// Close button
			this.closeButton = createElem2({
				appendTo: this.windowHead.querySelector(".pull-right"),
				type: "a",
				innerHTML: "<i class='fa fa-times'></i>",
				onclick: () => this.Close()
			})

			this.makeWindowDraggable();


			// Create members area
			this.membersArea = createElem2({
				appendTo: this.rootEl,
				type: "div",
				class: "members-area"
			})


			// Create videos area
			this.videosArea = createElem2({
				appendTo: this.rootEl,
				type: "div",
				class: "videos-area"
			})




			// Contruct bottom area
			const bottomArea = createElem2({
				appendTo: this.rootEl,
				type: "div",
				class: "window-bottom"
			})

			/**
			 * @param {HTMLElement} btn 
			 * @param {boolean} selected 
			 */
			const setButtonSelected = (btn, selected) => {
				if(selected)
					btn.classList.add("selected")
				else
					btn.classList.remove("selected")
			}

			// Display the list of buttons
			const buttonsList = [
				
				// Audio button
				{
					icon: "fa-microphone",
					label: "mic",
					selected: false,
					onclick: () => {
						this.toggleStream(false)
					}
				},

				// Hang up button
				{
					icon: "fa-phone",
					class: "hang-up-button",
					selected: false,
					onclick: () => {
						this.Close(true)
					}
				},

				// Video button
				{
					icon: "fa-video-camera",
					label: "camera",
					selected: false,
					onclick: () => {
						this.toggleStream(true)
					}
				},


				//Full screen button
				{
					icon: "fa-expand",
					selected: false,
					onclick: (btn) => {
						RequestFullScreen(this.rootEl);
						setTimeout(() => {
							setButtonSelected(btn, IsFullScreen());
						}, 1000);
					}
				},
			]

			//Add buttons
			buttonsList.forEach((button) => {

				const buttonEl = createElem2({
					appendTo: bottomArea,
					type: "div",
					innerHTML: "<i class='fa " + button.icon + "'></i>"
				});
				buttonEl.setAttribute("data-label", button.label)

				//Add button optionnal class
				if(button.class)
					buttonEl.classList.add(button.class);

				buttonEl.addEventListener("click", () => {
					button.onclick(buttonEl);
				});


				setButtonSelected(buttonEl, button.selected)

			});


			/**
			 * Refresh buttons state
			 */
			this.refreshButtonsState = () => {
				
				// Microphone button
				setButtonSelected(
					bottomArea.querySelector("[data-label=\"mic\"]"),
					this.mainStream && this.mainStream.getAudioTracks()[0].enabled
				)

				// Video button
				setButtonSelected(
					bottomArea.querySelector("[data-label=\"camera\"]"),
					this.mainStream && this.mainStream.getVideoTracks().length > 0 && 
						this.mainStream.getVideoTracks()[0].enabled
				)
			}





			
			// Join the call
			await ws("calls/join", {
				convID: this.conv.ID
			})

			// Get call configuration
			this.callsConfig = await ws("calls/config");

			// Get the list of members of the call
			const currMembersList = await ws("calls/members", {
				callID: this.conv.ID
			})

			// Apply this list of user
			for(const user of currMembersList)
				if(user.userID != userID())
					await this.AddMember(user.userID)

			// Start to connect to ready pears
			for(const user of currMembersList)
				if(user.userID != userID() && user.ready)
					await this.PeerReady(user.userID)


		} catch(e) {
			console.error(e)
			notify("Could not initialize call!", "danger");
		}
	}

	/**
	 * Check if this conversation window is open or not
	 * 
	 * @returns {boolean}
	 */
	get isOpen() {
		return this.rootEl.isConnected
	}

	/**
	 * Make the call window draggable
	 */
	makeWindowDraggable() {

		const checkWindowMinPosition = () => {

			if(window.innerHeight < this.rootEl.style.top.replace("px", ""))
				this.rootEl.style.top = "0px";
			
			if(window.innerWidth < this.rootEl.style.left.replace("px", ""))
				this.rootEl.style.left = "0px";

			if(this.rootEl.style.left.replace("px", "") < 0)
				this.rootEl.style.left = "0px";

			if(this.rootEl.style.top.replace("px", "") < 49)
				this.rootEl.style.top = "50px";
		}

		//Enable dragging
		{
			var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

			this.windowHead.addEventListener("mousedown", (e) => {
				e = e || window.event;
				e.preventDefault();

				//Check if the window is currently in full screen mode
				if(IsFullScreen())
					return; 

				//get the mouse cursor position at startup
				pos3 = e.clientX;
				pos4 = e.clientY;
				document.onmouseup = closeDragElement;
				document.onmousemove = elementDrag;
			});

			const elementDrag = (e) => {
				e = e || window.event;
				e.preventDefault();

				//Calculate new cursor position
				pos1 = pos3 - e.clientX;
				pos2 = pos4 - e.clientY;
				pos3 = e.clientX;
				pos4 = e.clientY;

				//Set element new position
				this.rootEl.style.top = (this.rootEl.offsetTop - pos2) + "px";
				this.rootEl.style.left = (this.rootEl.offsetLeft - pos1) + "px";

				checkWindowMinPosition();
			}

			const closeDragElement = () => {

				//Stop moving when mouse button is released
				document.onmouseup = null;
				document.onmousemove = null;
			}
		}

		window.addEventListener("resize", () => {
			checkWindowMinPosition();
		});
	}

	/**
	 * Close this window & cancel the call
	 * 
	 * @param {boolean} propagate Set to true to propagate
	 * the event
	 */
	async Close(propagate = true) {
		this.rootEl.remove();

		// Leave the call
		if(UserWebSocket.IsConnected)
			await ws("calls/leave", {
				convID: this.conv.ID
			})

		
		if(this.mainPeer) {
			this.mainPeer.destroy();
			delete this.mainPeer;
		}
		
		// Destroy peer connections
		for(const el of this.peersEls)
			el[1].destroy()

		if(propagate)
			this.emitEvent("close");
	}

	/**
	 * Add a member to this call
	 * 
	 * @param {number} userID The ID of the target member
	 */
	async AddMember(userID) {
		
		// Apply user information
		const el = createElem2({
			appendTo: this.membersArea,
			type: "span",
			innerHTML: (await user(userID)).fullName
		});
		el.setAttribute("data-call-member-name-id", userID)

	}

	/**
	 * Get the name element of a member
	 * 
	 * @param {number} userID The ID of the user to get
	 * @return {HTMLElement|null}
	 */
	getMemberNameEl(userID) {
		return this.membersArea.querySelector("[data-call-member-name-id=\""+userID+"\"]");
	}


	/**
	 * Remove the video element of a specific user
	 * 
	 * @param {number} peerID Target peer ID
	 */
	removeVideoElement(peerID) {
		const el = this.videoEls.get(peerID);
		this.videoEls.delete(peerID)

		el.pause()
		el.parentNode.remove()
	}

	/**
	 * Remove a member connection
	 * 
	 * @param {number} userID Target user ID
	 */
	async RemoveMemberConnection(userID) {

		const el = this.getMemberNameEl(userID)
		if(el)
			el.classList.remove("ready")

		// Remove video (if any)
		if(this.videoEls.has(userID)) {
			this.removeVideoElement(userID)
		}
		
		// Remove peer connection (if any)
		if(this.peersEls.has(userID)) {
			this.peersEls.get(userID).destroy()
			this.peersEls.delete(userID)
		}

	}

	/**
	 * Remove a user from a call
	 * 
	 * @param {number} userID The ID of the target user
	 */
	async RemoveMember(userID) {
		
		// Remove user name
		const el = this.getMemberNameEl(userID)
		if(el)
			el.remove()
		
		this.RemoveMemberConnection(userID);
	}

	/**
	 * Get call configuration
	 */
	callConfig() {
		return {
			iceServers: this.callsConfig.iceServers.map((e) => {return {urls: e}})
		};
	}

	/**
	 * Toggle stream state
	 * 
	 * @param {boolean} isVideo 
	 */
	async toggleStream(isVideo) {

		if(isVideo && !this.conv.can_have_video_call) {
			notify("Video calls can not be perfomed on this conversations!", "danger")
			return;
		}

		const hasAudio = (this.mainPeer && !this.mainPeer.destroyed) === true;
		const hasVideo = (this.mainPeer && !this.mainPeer.destroyed && this.mainStream && this.mainStream.getVideoTracks().length > 0) === true;

		// Check if current stream is not enough
		if(hasAudio && isVideo && !hasVideo)
			this.mainPeer.destroy()

		// Check if we have to start stream or just to mute them
		if(!hasAudio || (isVideo && !hasVideo)) {
			await this.startStreaming(isVideo)
		}

		// Toggle mute
		else {

			// Video
			if(isVideo) {
				this.mainStream.getVideoTracks()[0].enabled = !this.mainStream.getVideoTracks()[0].enabled
			}


			// Audio
			else {
				this.mainStream.getAudioTracks()[0].enabled = !this.mainStream.getAudioTracks()[0].enabled
			}

		}

		this.refreshButtonsState()
	}

	/**
	 * Add audio / video stream to the user
	 * 
	 * @param {number} peerID Remove peer ID
	 * @param {boolean} muted True to mute video
	 * @param {MediaStream} stream Target stream
	 */
	applyStream(peerID, muted, stream) {

		// Remove any previous video stream
		if(this.videoEls.has(peerID)) {
			this.removeVideoElement(peerID)
		}

		const isVideo = stream.getVideoTracks().length > 0;

		const videoContainer = createElem2({
			appendTo: this.videosArea,
			type: "div",
			class: isVideo ? "video" : undefined
		})

		const videoEl = document.createElement(isVideo ?  "video" : "audio");
		videoContainer.appendChild(videoEl)

		videoEl.muted = muted;

		videoEl.srcObject = stream
		videoEl.play()

		this.videoEls.set(peerID, videoEl)
	}

	/**
	 * Send a signal back to the proxy
	 * 
	 * @param {Number} peerID Target peer ID
	 * @param {data} data The signal to send
	 */
	async SendSignal(peerID, data) {
		const type = data.hasOwnProperty("sdp") ? "SDP" : "CANDIDATE";
			
		await ws("calls/signal", {
			callID: this.callID,
			peerID: peerID,
			type: type,
			data: type == "SDP" ? JSON.stringify(data) : JSON.stringify(data.candidate)
		})
	}

	/**
	 * Start to send this client audio & video
	 * 
	 * @param {boolean} includeVideo
	 */
	async startStreaming(includeVideo) {

		// First, query user media
		const stream = await navigator.mediaDevices.getUserMedia({
			video: this.conv.can_have_video_call && includeVideo,
			audio: true
		})
		this.mainStream = stream;

		if(includeVideo)
			stream.getVideoTracks()[0].applyConstraints({
				width: {max: 320},
				height: {max: 240},
				frameRate: {max: 24}
			})

		// Check if the window was closed in the mean time
		if(!this.isOpen)
			return

		// Show user video
		this.applyStream(userID(), true, stream)

		this.mainPeer = new SimplePeer({
			initiator: true,
			trickle: true, // Allow exchange of multiple ice candidates
			stream: stream,
			config: this.callConfig()
		})

		// Forward signals
		this.mainPeer.on("signal", data => {
			this.SendSignal(userID(), data)
		})

		// Return errors
		this.mainPeer.on("error", err => {
			console.error("Peer error!", err);
			notify("An error occured while trying to connect!", "danger", 5)
		});

		this.mainPeer.on("connect", () =>  {
			console.info("Connected to remote peer!")
			ws("calls/mark_ready", {
				callID: this.callID
			})
		})

		this.mainPeer.on("message", message => {
			console.log("Message from remote peer: " + message);
		});

		this.mainPeer.on("stream", stream => {
			console.log("mainPeer stream", stream)
			alert("Stream on main peer!!!")
		});

		/*

		DO NOT DO THIS !!! On configuration change it would close
		the call window...

		this.mainPeer.on("close", () => {
			console.log("Connection to main peer was closed.")
			if(this.mainPeer)
				this.Close(false);
		});*/
	}

	/**
	 * Start to receive video from remote peer
	 * 
	 * @param {number} peerID Target peer ID
	 */
	async PeerReady(peerID) {

		// Remove any previous connection
		if(this.peersEls.has(peerID)) {
			this.peersEls.get(peerID).destroy()
		}

		// Mark the peer as ready
		const el = this.getMemberNameEl(peerID)
		if(el)
			el.classList.add("ready")

		const peer = new SimplePeer({
			initiator: false,
			trickle: true, // Allow exchange of multiple ice candidates
			config: this.callConfig(),
		})
		this.peersEls.set(peerID, peer)

		peer.on("signal", data => this.SendSignal(peerID, data))

		peer.on("error", err => {
			console.error("Peer error! (peer: " + peerID + ")", err);
			notify("An error occured while trying to to a peer !", "danger", 5)
		});

		peer.on("connect", () =>  {
			console.info("Connected to a remote peer ("+peerID+") !")
		})

		peer.on("message", message => {
			console.log("Message from remote peer: " + message);
		});

		peer.on("stream", stream => {
			console.log("Got remote peer stream", stream)

			this.applyStream(peerID, false, stream)
		});

		peer.on("close", () => {
			console.info("Connection to peer " + peerID + " closed");
			this.RemoveMemberConnection(peerID)
		})

		// Request an offer from proxy
		await ws("calls/request_offer", {
			callID: this.callID,
			peerID: peerID,
		})

		console.log(peer)
	}

	/**
	 * Handles new signals
	 * 
	 * @param {Number} peerID Target peer ID
	 * @param {any} data Signal data
	 */
	NewSignal(peerID, data) {

		if(peerID == userID()) {
			if(this.mainPeer)
				this.mainPeer.signal(data)
		}
		else if(this.peersEls.has(peerID)) {
			this.peersEls.get(peerID).signal(data)
		}

	}
}