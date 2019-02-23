/**
 * Calls ring screen
 * 
 * Display a popup to ask the user whether he wants
 * to respond to a call or not
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.calls.ringScreen = {

	/**
	 * Song object
	 * 
	 * @type {SongPlayer}
	 */
	_song: undefined,

	/**
	 * Notify user about an incoming call and offer him to respond it
	 * 
	 * @param {String} title The title of the conversation
	 * @param {number} timeout Timeout after which the call is automatically
	 * considered as rejected
	 * @param {(accept : boolean) => any} callback Callback function
	 * @return {Object} Information about the window
	 */
	show: function(title, timeout, callback){

		//Initialize song first
		if(this._song == undefined)
			this._song = new SongPlayer([
				ComunicWeb.__config.assetsURL + "audio/phone_ring.mp3",
				ComunicWeb.__config.assetsURL + "audio/phone_ring.ogg"
			]);
		this._song.playForever();

		var callContainer = createElem2({
			appendTo: document.body,
			type: "div",
			class: "ring-call-container"
		});

		var callMessageBox = createElem2({
			appendTo: callContainer,
			type: "div",
			class: "call-message-box"
		});

		add_p(callMessageBox, "<i>" + title + "</i> is calling you");


		//Add buttons to respond to call
		var respondButtons = createElem2({
			appendTo: callMessageBox,
			type: "div",
			class: "response-buttons"
		});
		
		var rejectButton = createElem2({
			appendTo: respondButtons,
			type: "button",
			class: "btn btn-danger",
			innerHTML: "Reject"
		});

		var acceptButton = createElem2({
			appendTo: respondButtons,
			type: "button",
			class: "btn btn-success",
			innerHTML: "Accept"
		});

		var close = function(){

			ComunicWeb.components.calls.ringScreen._song.stop();

			//Remove elem
			emptyElem(callContainer);
			callContainer.remove();
			
		}

		var hasResponded = false;
		var respond = function(accept){
			
			close();

			if(hasResponded)
				return;
			hasResponded = true;

			callback(accept);
		}

		rejectButton.addEventListener("click", function() {
			respond(false);
		});

		acceptButton.addEventListener("click", function(){
			respond(true);
		});

		//Automatically reject the call after a certain amount of time
		setTimeout(function(){
			respond(false);
		}, timeout*1000);

		return {

			/**
			 * A function to close the current ringscreen, without
			 * calling callback
			 */
			close: close,

			/**
			 * A function to programmatically respond to call
			 */
			respond: respond

		};
	}

}