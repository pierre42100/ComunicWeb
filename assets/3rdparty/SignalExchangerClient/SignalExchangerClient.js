/**
 * Signal exchanger web client
 * 
 * @author Pierre HUBERT
 */

class SignalExchangerClient {

    /**
     * Server domain
     * 
     * @type {String}
     */
    //domain;

    /**
     * Server port
     * 
     * @type {Number}
     */
    //port;

    /**
     * Current client ID
     * 
     * @type {String}
     */
    //clientID;
    
    /**
     * Socket connection to the server
     * 
     * @type {WebSocket}
     */
    //socket;

    /**
     * Function called in case of error
     * 
     * @type {Function}
     */
    //onError = null;

    /**
     * Function called when the connection is etablished
     * 
     * @type {Function}
     */
    //onConnected = null;

    /**
     * Function called when the connection to the socket is closed
     * 
     * @type {Function}
     */
    //onClosed = null;

    /**
     * Function called when we get a new signal information
     * 
     * @type {Function}
     */
    //onSignal = null;

    /**
     * Function called when we get a ready message notice
     * 
     * @type {Function}
     */
    //onReadyMessage = null;

    /**
     * Construct a client instance
     * 
     * @param {String} domain The name of the signal server
     * @param {Number} port The port of the server to use
     * @param {String} clientID The ID of current client
     * @param {Boolean} secure Specify whether connection to the socket should be secure or not
     */
    constructor(domain, port, clientID, secure) {
        
        //Save information
        this.domain = domain,
        this.port = port;
        this.clientID = clientID;

        this.socket = new WebSocket((secure ? "wss" : "ws") + "://" + this.domain + ":" + this.port + "/socket");

        //Add a few events listeners
        this.socket.addEventListener("open", () => {
            this.serverConnected();

            if(this.onConnected != null)
                setTimeout(this.onConnected, 10);
        });

        this.socket.addEventListener("message", message => {

            let data;
            try {
                data = JSON.parse(message.data);
            } catch(e){
                console.error("Could not parse message from server!");
                return;
            }

            console.log("New message from socket", data);

            this.serverMessage(data);
        });

        this.socket.addEventListener("error", () => {
            if(this.onError != null)
                setTimeout(this.onError, 0);
        });

        this.socket.addEventListener("close", () => {
            if(this.onClosed != null)
                setTimeout(this.onClosed, 0);   
        });
    }

    /**
     * Use this method to get the current connection status to the server
     * 
     * @return {Boolean} TRUE if the client is connected to the server / FALSE else
     */
    isConnected() {
        return this.socket.readyState == WebSocket.OPEN;
    }

    /**
     * Close the connection to the server (if connected)
     */
    close() {
        if(this.isConnected())
            this.socket.close();
    }

    /**
     * Method called once the client is successfully
     * connected to the client
     */
    serverConnected(){
        
        //Send data to the server to identificate client
        this.sendData({
            client_id: this.clientID
        });

    }

    /**
     * Send ready message to a peer
     * 
     * @param {String} peerID The ID of the target peer for the message
     */
    sendReadyMessage(peerID){

        this.sendData({
            ready_msg: true,
            target_id: peerID
        });

    }

    /**
     * Send a signal to the server
     * 
     * @param target_id The ID of the target for the signal
     * @param content Signal to send to the target
     */
    sendSignal(target_id, content){
        
        //Send directly the message to the server
        this.sendData({
            signal: content,
            target_id: target_id
        });

        //Save the current signal being sent to be able to send
        //it again in case of failure
        this.pending_signal = content;
        this.pending_signal_target = target_id;
    }

    /**
     * Stop to try to send the current signal message in queue
     * 
     * This does not cancel the sending of messages already sent through
     * socket
     */
    cancelCurrentSignal() {
        this.pending_signal = undefined;
        this.pending_signal_target = undefined;
    }

    /**
     * Send data to the server
     * 
     * @param {Object} data The data to send to the server
     */
    sendData(data){
        console.log("Sending data to server", data);
        this.socket.send(JSON.stringify(data));
    }

    /**
     * This method is called when the server has sent a new message to this client
     * 
     * @param {Object} message The message sent by the server, as a JSON object
     */
    serverMessage(message){

        //Check if it is a callback for a pending message
        if(message.signal_sent){
            if(message.number_of_targets < 1 && this.pending_signal && this.pending_signal_target){

                //We have to send the message again
                setTimeout(() => {
                    this.sendSignal(this.pending_signal, this.pending_signal_target);
                }, 1000);

            }

            else {

                //Else we can remove from this class information about the signal being sent
                this.cancelCurrentSignal();

            }
        }

        //Check if message is a callback for a ready notice
        else if(message.ready_message_sent){

            if(message.number_of_targets < 1){

                //Try to send message again
                setTimeout(() => {
                    this.sendReadyMessage(message.target_id);
                }, 1000);

            }

        }

        // Check if message is a ready notice
        else if(message.ready_msg){
            if(this.onReadyMessage != null)
                this.onReadyMessage(message.source_id);
        }

        // Check if the message is a signal
        else if(message.signal){
            if(this.onSignal != null)
                this.onSignal(message.signal, message.source_id);
        }


    }
}