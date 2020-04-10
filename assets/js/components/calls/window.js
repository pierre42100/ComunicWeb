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
		this.construct(conv);
	}

	async construct(conv) {
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
		const windowHead = createElem2({
			appendTo: this.rootEl,
			type: "div",
			class: "head",
			innerHTML: "<i class='fa fa-phone'></i>" +
				await getConvName(conv) + 
				" <span class='pull-right'></span>"
		})

		// Close button
		this.closeButton = createElem2({
			appendTo: windowHead.querySelector(".pull-right"),
			type: "a",
			innerHTML: "<i class='fa fa-cross'></i>",
			onclick: () => this.Close()
		})

	}

	/**
	 * Close this window & cancel the call
	 * 
	 * @param {boolean} propagate Set to true to propagate
	 * the event
	 */
	Close(propagate = true) {
		this.rootEl.remove();

		if(propagate)
			this.emitEvent("closed");
	}
}