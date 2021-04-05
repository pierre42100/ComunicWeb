/**
 * Group conversation page
 * 
 * @author Pierre Hubert
 */

const GroupConversationPage = {

    /**
     * Show a group conversation page
     * 
     * @param {Conversation} conv Information about the target conversation
     * @param {HTMLElement} target Target page
     */
    show: function(conv, target) {
        ConversationPageConvPart.open(conv.id, target)
    }

}