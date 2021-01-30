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
		this.allowVideo = conv.can_have_video_call;

		/** @type {Map<number, Peer>} */
		this.peersEls = new Map()

		/** @type {Map<number, SimplePeer>} */
		this.streamsEls = new Map()

		/** @type {Map<number, HTMLVideoElement>} */
		this.videoEls = new Map()

		/** @type {Map<number, AudioContext>} */
		this.audioContexts = new Map()

		this.blurBackground = false;

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

			if(!this.conv.can_have_video_call)
				this.rootEl.classList.add("audio-only")

			
			// Construct head
			this.windowHead = createElem2({
				appendTo: this.rootEl,
				type: "div",
				class: "head",
				innerHTML: "<i class='fa fa-phone'></i>" +
					"<span class='title'>"+ await getConvName(conv) + "</span>" + 
					" <span class='pull-right'></span>"
			})

			// Add counter
			this.timeEl = createElem2({
				insertBefore: this.windowHead.querySelector(".pull-right"),
				type: "span",
				class: "time",
				innerHTML: "00:00:00"
			})

			// Close button
			this.closeButton = createElem2({
				appendTo: this.windowHead.querySelector(".pull-right"),
				type: "a",
				innerHTML: "<i class='fa fa-times'></i>",
				onclick: () => this.Close()
			})

			// Make counter lives
			this.callDuration = 0;
			const interval = setInterval(() => {

				if(!this.timeEl.isConnected)
					clearInterval(interval)

				this.callDuration++;
				this.timeEl.innerHTML = rpad(Math.floor(this.callDuration/3600), 2, 0) + ":" 
					+ rpad(Math.floor((this.callDuration/60)%60), 2, 0) + ":"
					+ rpad(this.callDuration%60, 2, 0)
			}, 1000);


			this.makeWindowDraggable();


			// Create members area
			this.membersArea = createElem2({
				appendTo: this.rootEl,
				type: "div",
				class: "members-area"
			})

			// Add message area
			this.messageArea = createElem2({
				appendTo: this.rootEl,
				type: "div",
				class: "messages-area"
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
				
				// Toggle current user camera visibility
				{
					icon: "fa-eye",
					selected: false,
					label: "toggle-camera-visibility",
					needVideo: true,
					onclick: (btn) => {
						setButtonSelected(btn, this.toggleMainStreamVisibility())
					}
				},

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
					needVideo: true,
					onclick: () => {
						this.toggleStream(true)
					}
				},


				// Submenu button
				{
					subMenu: true,
					icon: "fa-ellipsis-v",
					selected: true,
					label: "submenu",
					onclick: () => {}
				},
			]

			// Sub-menu entries
			const menuEntries = [

				// Full screen button
				{
					icon: "fa-expand",
					text: "Toggle fullscreen",
					needVideo: true,
					onclick: () => {
						RequestFullScreen(this.rootEl);
					}
				},


				// Share screen button
				{
					icon: "fa-tv",
					text: "Share screen",
					needVideo: true,
					onclick: () => {
						this.startStreaming(true, true)
					}
				},

				// Blur background
				{
					icon: "fa-paint-brush",
					text: "Toggle blur background",
					needVideo: true,
					onclick: () => {
						this.blurBackground = !this.blurBackground;
					}
				},

				// Share camera button
				{
					icon: "fa-video-camera",
					text: "Share webcam",
					needVideo: true,
					onclick: () => {
						this.startStreaming(true, false)
					}
				},

				// Record streams
				{
					icon: "fa-save",
					text: "Start / Stop recording",
					onclick: () => {
						this.startRecording()
					}
				},

				// Stop streaming
				{
					icon: "fa-stop",
					text: "Stop streaming",
					onclick: () => {
						this.closeMainPeer()
					}
				}

			]

			//Add buttons
			buttonsList.forEach((button) => {

				if(button.needVideo && !this.allowVideo)
					return;


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
				if(this.allowVideo)
					setButtonSelected(
						bottomArea.querySelector("[data-label=\"camera\"]"),
						this.mainStream && this.mainStream.getVideoTracks().length > 0 && 
							this.mainStream.getVideoTracks()[0].enabled
					)
			}

			this.on("localVideo", () => {
				setButtonSelected(bottomArea.querySelector("[data-label=\"toggle-camera-visibility\"]"), true)
			})





			// Process sub menu
			const menu = bottomArea.querySelector("[data-label=\"submenu\"]");
			menu.classList.add("dropup");


			const menuButton = menu.firstChild;
			menuButton.classList.add("dropdown-toggle");
			menuButton.setAttribute("data-toggle", "dropdown")

			const menuEntriesTarget = createElem2({
				appendTo: menu,
				type: "ul",
				class: "dropdown-menu"
			})

			// Parse list of menu entries
			for(const entry of menuEntries) {

				if(entry.needVideo && !this.allowVideo)
					continue

				const a = createElem2({
					appendTo: menuEntriesTarget,
					type: "li",
					innerHTML: "<a></a>"
				}).firstChild;

				// Add icon
				createElem2({
					appendTo: a,
					type: "i",
					class: "fa " + entry.icon,
				})

				// Add label
				a.innerHTML += entry.text

				a.addEventListener("click", () => entry.onclick())
			}





			// Check for anchors
			this.CheckNewTargetForWindow()


			
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
				await this.AddMember(user.userID)

			// Start to connect to ready pears
			for(const user of currMembersList)
				if(user.userID != userID() && user.ready)
					await this.PeerReady(user.userID)

			// Show helper notice
			this.on("closedMainPeer", () => {
				// Show appropriate message
				this.setMessage("Click on <i class='fa fa-microphone'></i> to start to share audio"+
				(this.allowVideo ? " or on <i class='fa fa-video-camera'></i> to start sharing your camera" : "") + ".");
			})

			this.emitEvent("closedMainPeer")

		} catch(e) {
			console.error(e)
			notify("Could not initialize call!", "danger");
		}
	}

	/**
	 * Check if current call window can be applied somewhere on the screen
	 */
	CheckNewTargetForWindow() {
		const target = byId("target-for-video-call-"+this.callID)

		this.rootEl.remove()

		if(target) {
			target.appendChild(this.rootEl)
			this.rootEl.classList.add("embedded")
		}

		else {
			byId("callsTarget").appendChild(this.rootEl)
			this.rootEl.classList.remove("embedded")
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

		// Stop recording
		if(this.isRecording)
			this.startRecording();

		// Leave the call
		if(UserWebSocket.IsConnected)
			await ws("calls/leave", {
				convID: this.conv.ID
			})

		
		if(this.mainPeer) {
			this.closeMainPeer()
		}
		
		// Destroy peer connections
		for(const el of this.peersEls)
			el[1].destroy()

		if(propagate)
			this.emitEvent("close");
	}

	/**
	 * Display a new message for the window
	 * 
	 * @param {String} msg New message / null to remove
	 */
	setMessage(msg) {
		if(msg == null) {
			this.messageArea.style.display = "none"
		}
		else {
			this.messageArea.style.display = "block";
			this.messageArea.innerHTML = msg;
		}
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

		if(el) {
			el.pause()
			el.parentNode.remove()	
		}

		const ctx = this.audioContexts.get(peerID);
		this.audioContexts.delete(peerID);

		if (ctx) {
			// The delay is here to ensure context has been initialized
			// to make sure state update event is correctly propagated
			setTimeout(() => ctx.close(), 100);
		}
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

		// Remove associated stream
		if(this.streamsEls.has(userID)) {
			this.streamsEls.delete(userID)
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
			notify("Video calls can not be done on this conversations!", "danger")
			return;
		}

		const hasAudio = (this.mainPeer && !this.mainPeer.destroyed) === true;
		const hasVideo = (this.mainPeer && !this.mainPeer.destroyed && this.mainStream && this.mainStream.getVideoTracks().length > 0) === true;

		// Check if current stream is not enough
		if(hasAudio && isVideo && !hasVideo) {
			this.closeMainPeer()
		}

		// Check if we have to start stream or just to mute them
		if(!hasAudio || (isVideo && !hasVideo)) {
			try {
				await this.startStreaming(isVideo)
			} catch(e) {
				notify("Could not start streaming ! (did you block access to your camera / microphone ?)", "danger")
				console.error(e)
			}
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
	 * Toggle current peer stream visibility
	 * 
	 * @return {boolean} New state
	 */
	toggleMainStreamVisibility() {
		const el = this.videoEls.get(userID())
		
		if(!el || el.nodeName !== "VIDEO")
			return false;
		
		// Show again element
		if(el.parentNode.style.display == "none") {
			el.parentNode.style.display = ""
			return true
		}

		// Hide element
		else {
			el.parentNode.style.display = "none"
			return false
		}
	}

	/**
	 * Add audio / video stream to the user
	 * 
	 * @param {number} peerID Remove peer ID
	 * @param {boolean} muted True to mute video
	 * @param {MediaStream} stream Target stream
	 */
	async applyStream(peerID, muted, stream) {

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

		// Apply video
		const videoEl = document.createElement(isVideo ?  "video" : "audio");
		videoContainer.appendChild(videoEl)

		videoEl.muted = muted;

		videoEl.srcObject = stream
		
		// Fix Chrome exception: DOMException: play() failed because the user didn't interact with the document first.
		try {
			await videoEl.play()
		} catch(e) {
			console.error("Caught play() error", e)
			notify("Please click anywhere on the page to resume video call");

			// Wait for user interaction before trying again
			document.addEventListener("click", () => {
				if(videoEl.isConnected)
					videoEl.play()
			}, {
				once: true
			})
		}

		// Request fullscreen on double click
		videoEl.addEventListener("dblclick", () => {
			RequestFullScreen(this.rootEl);
		})
		

		// Setup audio context to determine whether the person is talking or not
		const audioContext = new AudioContext();

		const gain_node = audioContext.createGain();
		gain_node.connect(audioContext.destination);
		
		// Prevent echo
		gain_node.disconnect(0)
		
		const script_processor_analysis_node = audioContext.createScriptProcessor(2048, 1, 1);
        script_processor_analysis_node.connect(gain_node);

		const microphone_stream = audioContext.createMediaStreamSource(stream);
		microphone_stream.connect(gain_node)

		const analyzer_node = audioContext.createAnalyser();
		analyzer_node.smoothingTimeConstant = 0
		analyzer_node.fftSize = 4096
		analyzer_node.connect(script_processor_analysis_node);

		microphone_stream.connect(analyzer_node)

		const freq_data = new Uint8Array(analyzer_node.frequencyBinCount)

		const memberEl = this.getMemberNameEl(peerID);


		script_processor_analysis_node.onaudioprocess = function(e) {
			analyzer_node.getByteFrequencyData(freq_data);

			let count = 0;
			let sum = 0;
			for(let val = 0; val < 50 && val < freq_data.length; val++)
			{
				sum += freq_data[val];
				count++;
			}

			const avg = sum/count;

			if(avg > 50)
			{
				memberEl.classList.add("talking")
				videoEl.classList.add("talking")
			}
			else
			{
				memberEl.classList.remove("talking");
				videoEl.classList.remove("talking")
			}
				
		}

		audioContext.addEventListener("statechange", e => {
			if (audioContext.state == "closed")
			{
				console.info("Release audio analysis ressources for peer " + peerID);
				gain_node.disconnect();
				script_processor_analysis_node.disconnect();
				microphone_stream.disconnect();
				analyzer_node.disconnect();

				memberEl.classList.remove("talking")
				videoEl.classList.remove("talking")
			}
		})



		this.videoEls.set(peerID, videoEl)
		this.audioContexts.set(peerID, audioContext)


		if(isVideo) {
			// Show user name
			const userName = (await user(peerID)).fullName
			videoEl.title = userName
		}

		if(isVideo && peerID == userID()) {
			// Emit an event
			this.emitEvent("localVideo")
		}
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
	 * @param {boolean} shareScreen
	 */
	async startStreaming(includeVideo, shareScreen = false) {

		// Close any previous connection
		await this.closeMainPeer();
		

		this.setMessage(null)

		let stream;
		
		// Get user screen
		if(includeVideo && shareScreen) {
			stream = await requestUserScreen(true)

			// Ask for audio separatly
			const second_stream = await navigator.mediaDevices.getUserMedia({
				audio: true
			})

			stream.addTrack(second_stream.getAudioTracks()[0])
		}

		// Use regular webcam
		else {
			// First, query user media
			stream = await navigator.mediaDevices.getUserMedia({
				video: this.conv.can_have_video_call && includeVideo,
				audio: true,
			})
		}
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
		
		// If streaming video stream, allow to blur background
		if(includeVideo)
		{
			// Create capture
			const videoTarget = document.createElement("video");
			videoTarget.muted = true;
			videoTarget.srcObject = stream;
			videoTarget.play()

			const canvasTarget = document.createElement("canvas");

			// Mandatory to initialize context
			const canvas = canvasTarget.getContext("2d");


			// Wait for video to be ready
			await new Promise((res, rej) => videoTarget.addEventListener("loadeddata", e => res(), {once: true}));

			const videoTrack = this.mainStream.getVideoTracks()[0];

			// Fix video & canvas size
			videoTarget.width = videoTrack.getSettings().width
			videoTarget.height = videoTrack.getSettings().height
			canvasTarget.width = videoTarget.width;
			canvasTarget.height = videoTarget.height;


			// Process images
			(async () => {
				try {

					while(videoTrack.readyState == "live")
					{
						if (this.blurBackground) {

							// Load network if required
							if (!this.backgroundDetectionNetwork)
							{
								this.backgroundDetectionNetwork = await bodyPix.load({
									multiplier: 0.75,
									stride: 32,
									quantBytes: 4
								});
							}

							const segmentation = await this.backgroundDetectionNetwork.segmentPerson(videoTarget);

							const backgroundBlurAmount = 6;
							const edgeBlurAmount = 2;
							const flipHorizontal = true;

							bodyPix.drawBokehEffect(
							canvasTarget, videoTarget, segmentation, backgroundBlurAmount,
							edgeBlurAmount, flipHorizontal);
						}
						
						else {
							canvas.drawImage(videoTarget, 0, 0, videoTarget.width, videoTarget.height);
							await new Promise((res, rej) => setTimeout(() => res(), 1000 / videoTrack.getSettings().frameRate));
						}
					}
				}
				catch(e)
				{
					console.error("Failure", e);
				}
			})();
			
			
			stream = canvasTarget.captureStream();
			stream.addTrack(this.mainStream.getAudioTracks()[0]);
		}

			
		// Show user video
		await this.applyStream(userID(), true, stream)
		this.refreshButtonsState()

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
			
			this.getMemberNameEl(userID()).classList.add("ready");
			
			setTimeout(() => {
				// Add a little delay before notifying other peers in order to let the tracks be received by the proxy
				if(this.mainPeer && !this.mainPeer.destroyed)
					ws("calls/mark_ready", {
						callID: this.callID
					})
			}, 2000);
			
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
	 * Close main peer connection
	 */
	async closeMainPeer() {

		// Remove ready attribute
		const memberEl = this.getMemberNameEl(userID());
		if (memberEl)
			memberEl.classList.remove("ready");

		// Close peer connection
		if(this.mainPeer) {
			this.mainPeer.destroy();
			delete this.mainPeer;
		}

		// Release user media
		if(this.mainStream) {
			this.mainStream.getTracks().forEach(e => e.stop())
			delete this.mainStream
		}

		this.removeVideoElement(userID())
		this.refreshButtonsState()

		// Propagate information
		try {
			await ws("calls/stop_streaming", {
				callID: this.callID
			})
		} catch(e) {
			console.log("Failed to notify of streaming stop", e)
		}

		this.emitEvent("closedMainPeer")
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

			this.streamsEls.set(peerID, stream)
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

	/**
	 * Check out whether we are currently recording video or not
	 */
	get isRecording() {
		return this.hasOwnProperty("recorder");
	}

	/**
	 * Start / stop recording the streams
	 */
	startRecording() {

		const onDataAvailable = blob => {
			console.info("New record  available", blob)

			// = GET URL = const url = URL.createObjectURL(blob)

			// Save file
			saveAs(blob, new Date().getTime() + ".webm")
		}

		// Start recording
		if(!this.isRecording) {
			// Determine the list of streams to save
			const streams = []

			if(this.mainStream)
				streams.push(this.mainStream)
			this.streamsEls.forEach(v => streams.push(v))

			// Create & start recorder
			this.recorder = new MultiStreamRecorder(streams);
			this.recorder.ondataavailable = onDataAvailable
			this.recorder.start(30*60*1000); // Ask for save every 30min
			

			// Add notice
			this.recordLabel = createElem2({
				insertBefore: this.videosArea,
				type: "div",
				class: "record-label",
				innerHTML: "Recording"
			});

			createElem2({
				appendTo: this.recordLabel,
				type: "a",
				innerHTML: "STOP",
				onclick: () => this.startRecording()
			})
		}


		// Stop recording
		else {
			this.recorder.stop(onDataAvailable)
			delete this.recorder

			// Remove notice
			this.recordLabel.remove()
		}
	}
}