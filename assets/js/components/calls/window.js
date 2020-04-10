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
		this.conv = conv;
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



			// Join the call
			await ws("calls/join", {
				convID: this.conv.ID
			})

			// Get the list of members of the call
			const currMembersList = await ws("calls/members", {
				callID: this.conv.ID
			})

			// Apply this list of user
			for(const user of currMembersList)
				if(user != userID())
					await this.AddMember(user)

		} catch(e) {
			console.error(e)
			notify("Could not initialize call!", "danger");
		}
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
		createElem2({
			appendTo: this.membersArea,
			type: "span",
			innerHTML: (await user(userID)).fullName
		});

	}
}