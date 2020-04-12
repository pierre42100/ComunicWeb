/**
 * Calls controller
 * 
 * @author Pierre Hubert
 */

/**
 * @type {Map<number, CallWindow>}
 */
let OpenCalls = new Map();

class CallsController {

	/**
	 * Open a call for a conversation
	 * 
	 * @param {Conversation} conv Information about the target conversation
	 */
	static Open(conv) {
		if(OpenCalls.has(conv.ID) && OpenCalls.get(conv.ID).isOpen)
			return;
		
		console.info("Open call for conversation " + conv.ID);
		
		// Create a new window for the conversation
		const window = new CallWindow(conv);
		OpenCalls.set(conv.ID, window)
		this.AddToLocalStorage(conv.ID);

		window.on("close", () => {
			OpenCalls.delete(conv.ID)
			this.RemoveFromLocalStorage(conv.ID)
		})
	}


	/**
	 * Add the conversation to local storage
	 * 
	 * @param {number} convID Target conversation ID
	 */
	static AddToLocalStorage(convID) {
		const list = this.GetListLocalStorage();
		if(!list.includes(convID))
			list.push(convID)
		this.SetListLocalStorage(list)
	}

	/**
	 * @param {number} convID Target conversation ID
	 */
	static RemoveFromLocalStorage(convID) {
		this.SetListLocalStorage(
			this.GetListLocalStorage().filter(e => e != convID)
		)
	}

	/**
	 * @return {number[]} The ID of the opened conversations
	 */
	static GetListLocalStorage() {
		const content = localStorage.getItem("calls")
		if(content == null)
			return []
		else
			return JSON.parse(content).filter(e => e != null);
	}

	/**
	 * Update the list of open calls
	 * 
	 * @param {number[]} list New list
	 */
	static SetListLocalStorage(list) {
		localStorage.setItem("calls", JSON.stringify(list))
	}
}

document.addEventListener("userJoinedCall", (e) => {
	const detail = e.detail;

	if(OpenCalls.has(detail.callID))
		OpenCalls.get(detail.callID).AddMember(detail.userID)
})

document.addEventListener("userLeftCall", (e) => {
	const detail = e.detail;

	if(OpenCalls.has(detail.callID))
		OpenCalls.get(detail.callID).RemoveMember(detail.userID)
})

document.addEventListener("newCallSignal", (e) => {
	const detail = e.detail
	let signal = detail.data

	// Fix candidate format
	if(signal.hasOwnProperty("candidate"))
		signal = {
			candidate: signal
		}

	if(OpenCalls.has(detail.callID))
		OpenCalls.get(detail.callID).NewSignal(detail.peerID, signal)
});

document.addEventListener("callPeerReady", (e) => {
	const detail = e.detail;

	if(OpenCalls.has(detail.callID))
		OpenCalls.get(detail.callID).PeerReady(detail.peerID)
})


document.addEventListener("wsClosed", () => {
	// Close all the current conversations
	OpenCalls.forEach((v) => v.Close(false))

	OpenCalls.clear();
})


document.addEventListener("openPage", () => {
	CallsController.GetListLocalStorage().forEach(async c => {
		if(!OpenCalls.has(c))
			CallsController.Open(await getSingleConversation(c))
	})
})