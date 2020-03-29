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
		await this.Disconnect();

		console.log("Connect to websocket");
	}

	/**
	 * Disconnect from server
	 */
	static async Disconnect() {
		console.log("Disconnect from websockt");

	}
}