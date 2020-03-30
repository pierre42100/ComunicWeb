/**
 * Main client websocket
 * 
 * @author Pierre HUBERT
 */
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

		} catch(e) {
			this.Error(e);
		}
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
		
		const num_seconds = ComunicWeb.__config.productionMode ? 5 : 0.5;

		notify("Disconnected from the server, page will be reloaded in "+num_seconds+" seconds !", "danger");

		setTimeout(() => ComunicWeb.common.system.restart(), num_seconds*1000);
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
}