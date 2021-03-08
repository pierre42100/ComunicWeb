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
                "<td>" + message.id + "</td>" +
                "<td>" + timeToStr(message.time_sent) + "</td>" +
                "<td class='file-cell'></td>" 
                 
        });

        //Add conversation image (if any)
        if(message.file != null){
            let cell = messageEl.querySelector(".file-cell");

            if (message.file.type.startsWith("image/")) {
                let imageElem = createElem2({
                    appendTo: cell,
                    type: "img",
                    class: "conversation-img"
                });

                applyURLToImage(imageElem, message.file.url);
            }

            else {
                let link = createElem2({
                    appendTo: cell,
                    type: "a",
                    href: getFilePathFromURL(message.file.url),
                    innerHTML: message.file.url
                })
                link.target = "_blank"
            }
        }

        if (message.message)
            messageEl.innerHTML += "<td>" + message.message + "</td>";
    });

}