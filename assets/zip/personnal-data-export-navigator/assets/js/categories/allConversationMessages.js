/**
 * All conversation messages category
 * 
 * @author Pierre HUBERT
 */

/**
 * Apply the entire list of conversation messages of the user
 */
function ApplyAllConversationMessages(){

    let target = document.querySelector("#all-conversation-messages-table tbody");

    data.all_conversation_messages.forEach(message => {

        let messageEl = createElem2({
            appendTo: target,
            type: "tr",
            innerHTML:
                "<td>" + message.ID + "</td>" +
                "<td>" + timeToStr(message.time_insert) + "</td>" +
                "<td>" + message.message + "</td>" 
        });

        //Add conversation image (if any)
        if(message.image_path != null){
            let imageElem = createElem2({
                appendTo: messageEl,
                type: "img",
                class: "conversation-img"
            });

            applyURLToImage(imageElem, message.image_path);
        }

    });

}