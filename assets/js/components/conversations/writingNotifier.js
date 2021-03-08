/**
 * Notify when a user is writing a new message
 * in a conversation
 * 
 * @author Pierre Hubert
 */

class ConversationWritingNotifier {
    constructor(target, convID) {
        this.messageArea = createElem2({
            appendTo: target,
            type: "div",
            class: "user-writing-message"
        })

        this.setText("hello world for conv " + convID)
    }

    /**
     * Update message. If message is empty, hide the area
     * 
     * @param {String} msg 
     */
    setText(msg) {
        if(msg.length == 0)
            return this.messageArea.style.display = "none";
        
        this.messageArea.style.display = "block";
        this.messageArea.innerHTML = msg;
    }
}