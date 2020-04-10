/**
 * Base class for events on custom class management
 * 
 * @author Pierre Hubert
 */

class CustomEvents {

	constructor() {

		/**
		 * @type {Map<string, Array<(e) => any>>}
		 */
		this.evts = new Map();
	}

	/**
	 * Register to an event
	 * 
	 * @param {string} evt The name of the event to register to
	 * @param {(e) => any} cb Callback function
	 */
	on(evt, cb) {
		if(!this.evts.has(evt))
			this.evts.set(evt, []);
		
		this.evts.get(evt).push(cb)
	}


	/**
	 * Propagate a new event
	 * 
	 * @param {string} evt The name of the event
	 * @param {any} data Data associated with the event
	 */
	emitEvent(evt, data) {
		if(!this.evts.has(evt))
			this.evts.set(evt, []);

		this.evts.get(evt).forEach((e) => {
			e(data)
		})
	}
}