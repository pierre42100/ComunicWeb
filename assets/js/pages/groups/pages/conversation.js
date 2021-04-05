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

        const convTarget = createElem2({
            appendTo: target,
            type: "div",
            class: "row",
            innerHTML: "<div class='col-md-6 group-page-conversation'></div>"
        }).children[0]


        ConversationPageConvPart.open(conv.id, convTarget)
    }

}