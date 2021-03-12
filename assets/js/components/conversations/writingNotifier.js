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

        this.setText("")

        this.usersFifo = []

        // Listen to events
        this.listener = (e) => {
            if(!this.messageArea.isConnected) {
                document.removeEventListener("WritingMessageInConv", this.listener)
                return;
            }
            
            if (e.detail.conv_id == convID)
                this.newWritingEvent(e.detail.user_id)
        }
        document.addEventListener("WritingMessageInConv", e => this.listener(e))
    }

    /**
     * Handle new writing event
     * 
     * @param {number} user_id Target user ID
     */
    async newWritingEvent(user_id) {
        this.usersFifo.push(user_id)
        await this.refreshText()

        setTimeout(() => {
            this.usersFifo.shift();
            this.refreshText()
        }, ServerConfig.conf.conversations_policy.conversation_writing_event_lifetime * 1000)
    }

    /**
     * Apply new text
     */
    async refreshText() {
        try {
            if (this.usersFifo.length == 0)
                return this.setText("");
            
            const users = [...new Set([...this.usersFifo])];
            const info = await getUsers(users);

            if (users.length == 1)
                this.setText(tr("%1% is writing...", {"1": info.get(users[0]).fullName}))
            
            else
            {
                let last = users.pop();
                this.setText(tr("%1% and %2% are writing...", {
                    "1": users.map(id => info.get(id).fullName).join(", "),
                    "2": info.get(last).fullName
                }));
            }
        
        
        } catch(e) {
            console.error(e);
            this.setText("")
        }
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