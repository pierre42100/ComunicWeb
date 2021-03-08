/**
 * Conversations category
 * 
 * @author Pierre HUBERT
 */

/**
 * Get and return the title of a conversation
 * 
 * @param {Object} conversation Information about the target conversation
 * @return {String} The name of the conversation
 */
function GetConversationTitle(conversation){

    let count = 0;
    let name = "";

    conversation.members.forEach(member => {

        //We only needs information about three members
        if(count > 3) return;

        //We skip current user ID
        if(member.user_id == userID()) return;

        let memberInfo = getUserInfo(member.user_id);

        if(name.length > 0)
            name += ", ";
        
        name += memberInfo.full_name;

    });

    return name;

}

/**
 * Apply the list of conversations
 */
function ApplyConversations(){

    let target = byId("conversations-target");

    data.conversations_list.forEach(conversationInfo => {

        let conversationCard = createElem2({
            appendTo: target,
            type: "div",
            class: "conversation card blue-grey darken-1"
        });

        let conversationCardContent = createElem2({
            appendTo: conversationCard,
            type: "div",
            class: "card-content"
        });

        
        //Conversation title
        createElem2({
            appendTo: conversationCardContent,
            type: "h2",
            innerHTML: conversationInfo.name ? conversationInfo.name : GetConversationTitle(conversationInfo)
        });

        // Conversation logo
        if (conversationInfo.logo)
        {
            let logo = createElem2({
                appendTo: conversationCardContent,
                class: "conversation-logo",
                type: "img",
            });
            applyURLToImage(logo, conversationInfo.logo);
        }

        //Conversation metadata
        let metadataContainer = createElem2({
            appendTo: conversationCardContent,
            type: "div",
            class: "conversation-metadata"
        });

        function addMetadata(data){
            return createElem2({
                appendTo: metadataContainer,
                type: "div",
                innerHTML: data
            })
        }

        addMetadata("ID: " + conversationInfo.id);
        if (conversationInfo.color)
            addMetadata("Color: #" + conversationInfo.color).style.color = "#" + conversationInfo.color;
        addMetadata("Last activity: " + timeToStr(conversationInfo.last_activity));

        //Process members list
        let conversationMembers = createElem2({
            appendTo: conversationCardContent,
            type: "div",
            class: "conversation-members"
        });

        conversationInfo.members.forEach(member => {

            let memberContainer = createElem2({
                appendTo: conversationMembers,
                type: "div"
            });

            fillElWithUserInfo(memberContainer, member.user_id);

            const addInfo = (str) => createElem2({
                appendTo: memberContainer,
                type: "span",
                innerHTML: " <i>" + str + "</i> "
            })

            addInfo(member.is_admin ? "Admin" : "");
            addInfo(member.following ? "Following" : "");
        });

        //Process conversation messages
        let conversationMessage = createElem2({
            appendTo: conversationCardContent,
            type: "div",
            class: "conversation-messages"
        });

        data.conversations_messages[conversationInfo.id].forEach(message => {
            
            let messageContainer = createElem2({
                appendTo: conversationMessage,
                type: "div",
                class: "message"
            });

            // Handle server messages
            if(!message.user_id) {
                messageContainer.innerHTML = "<i>Server message:" + JSON.stringify(message.server_message) + "</i>";
                return;
            }

            //Message author
            let messageAuthor = createElem2({
                appendTo: messageContainer,
                type: "div",
                class: "user-info"
            });
            fillElWithUserInfo(messageAuthor, message.user_id);

            //Message content
            createElem2({
                appendTo: messageContainer,
                type: "div",
                class: "message-content",
                innerHTML: message.message
            });

            //Message file
            if(message.file != null){
                if (message.file.type.startsWith("image/"))
                {
                    let messageImageContainer = createElem2({
                        appendTo: messageContainer,
                        type: "a",
                        href: getFilePathFromURL(message.file.url),
                    });
                    messageImageContainer.target = "_blank"
    
                    let messageImage = createElem2({
                        appendTo: messageImageContainer,
                        type: "img",
                        class: "message-image"
                    });
                    applyURLToImage(messageImage, message.file.url);
                }

                else {
                    let messageFileContainer = createElem2({
                        appendTo: messageContainer,
                        type: "div",
                        class: "message-file"
                    });
    
                    messageFileContainer.innerHTML = 
                        "Size: "+ fileSizeToHuman(message.file.size) + "<br />" +
                        "Type: " + message.file.type + "<br />" +
                        "URL: <a target='_blank' href='" + getFilePathFromURL(message.file.url) + "'>"+message.file.url+"</a><br />";
                    
                    if (message.file.thumbnail) {
                        let thumb = createElem2({
                            appendTo: messageFileContainer,
                            type: "img",
                            class: "message-file-thumb"
                        });
                        applyURLToImage(thumb, message.file.thumbnail)
                    }
                }
            }

            //Message date
            createElem2({
                appendTo: messageContainer,
                type: "div",
                class: "message-date",
                innerHTML: timeToStr(message.time_sent)
            })

        });

    });
}