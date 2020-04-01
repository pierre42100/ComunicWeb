/**
 * Main client websocket
 * 
 * @author Pierre HUBERT
 */


class WsMessage {
	constructor(info) {
		this.title = info.title
		this.id = info.id
		this.data = info.data
	}

	get hasId() {
		return this.id.length > 0
	}
}

let requests = {};
let reqCounter = 0;

class UserWebSocket {

	/**
	 * Connect to server
	 */
	static async Connect() {

		try {
			await this.Disconnect();

			console.log("Connect to websocket");

			// Generate an access token
			const token = (await api("ws/token", null, true)).token;

			// Determine websocket URL
			const url = ComunicWeb.__config.apiURL.replace("http", "ws") + "ws?token=" + token

			// Connect to websocket
			this.ws = new WebSocket(url);
			
			// Wait for connection
			this.ws.addEventListener("open", () => console.log("Connected to websocket!"))
			this.ws.addEventListener("error", (e) => this.Error(e))
			this.ws.addEventListener("close", (e) => this.Closed(e));

			// Handle incoming messages
			this.ws.addEventListener("message", (e) => {
				this.ProcessMessage(new WsMessage(JSON.parse(e.data)));
			})

		} catch(e) {
			this.Error(e);
		}
	}

	/**
	 * Wait for the socket to be connected (if not already)
	 */
	static WaitForConnected() {
		return new Promise((res, err) => {

			// Check if we are already connected
			if(this.ws.readyState == WebSocket.OPEN) {
				res();
				return;
			}

			this.ws.addEventListener("open", () => res());
		});
	}

	/**
	 * Get current connection status with the server 
	 */
	static get IsConnected() {
		return this.hasOwnProperty("ws") 
			&& this.ws.readyState == WebSocket.OPEN;
	}

	/**
	 * Handles websocket errors
	 */
	static async Error(e) {
		console.error(e)
		notify("Could not connect to websocket ! Try to refresh the page...", "danger");
	}

	/**
	 * When we get disconnected from the websocket
	 */
	static async Closed(e) {
		console.error("WS closed", e)

		// Notify the application
		SendEvent("wsClosed");

		// Reset requests queue
		requests = {};
		
		// Check if the server was gracefully stopped
		if(!this.hasOwnProperty("ws"))
			return;

		const num_seconds = ComunicWeb.__config.productionMode ? 5 : 0.8;

		notify("Disconnected from the server, page will be reloaded in "+num_seconds+" seconds !", "danger");

		setTimeout(() => {
			ComunicWeb.common.system.reset();
		}, num_seconds*1000);
	}

	/**
	 * Disconnect from server
	 */
	static async Disconnect() {
		console.log("Disconnect from websocket");

		// Disconnect, if reuired
		if(this.hasOwnProperty("ws")) {
			if(this.ws.readyState == WebSocket.OPEN)
				this.ws.close()
			delete this.ws
		}
	}

	/**
	 * Send a request to the server through the socket
	 * 
	 * @param {String} title The title of the request
	 * @param {any} data Information associated to the request
	 */
	static SendRequest(title, data) {
		// Send request
		return new Promise((res, err) => {
			if(this.ws.readyState != WebSocket.OPEN)
				throw new Error("WebSocket is not open!");

			// Determine unique request ID
			const req_id = "r-"+reqCounter++;

			// Send the message
			this.ws.send(JSON.stringify(new WsMessage({
				id: req_id,
				title: title,
				data: data
			})))

			// Add promise information to the queue
			requests[req_id] = {
				res: res,
				err: err
			};
		})

		
	}

	/**
	 * Process an incoming message
	 * 
	 * @param {WsMessage} msg The incoming message
	 */
	static async ProcessMessage(msg) {
		
		// Check if the message is not associated if any request
		if(!msg.hasId)
			this.ProcessDetachedMessage(msg)
		
		else
			this.ProcessResponse(msg);

	}

	/**
	 * Process detached message
	 * @param {WsMessage} msg Incoming message
	 */
	static async ProcessDetachedMessage(msg) {

		switch(msg.title) {

			case "number_notifs":
				SendEvent("newNumberNotifs", msg.data)
				break;

			case "number_unread_conversations":
				SendEvent("newNumberUnreadConvs", msg.data)
				break;

			default:
				console.error("WS Unspported kind of message!", msg);
				break;
		}

	}

	/**
	 * Process response message
	 * 
	 * @param {WsMessage} msg The message
	 */
	static ProcessResponse(msg) {

		// Check for attached request
		if(!requests.hasOwnProperty(msg.id)) {
			console.error("WS error: received unattended message! ", msg)
			return;
		}

		const queue = requests[msg.id];
		delete requests[msg.id];
		
		// Check for error
		if(msg.title !== "success") {
			console.error("WS error", msg.data);
			queue.err(msg)
			return;
		}
		
		// It is a success
		queue.res(msg.data);
	}
}


// Register some events
document.addEventListener("incognitoStatusChanged", (e) => {
	if(UserWebSocket.IsConnected)
		ws("$main/set_incognito", {enable: e.detail.enabled})
})