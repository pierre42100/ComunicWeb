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

    conversation.members.forEach(member_id => {

        //We only needs information about three members
        if(count > 3) return;

        //We skip current user ID
        if(member_id == userID()) return;

        let memberInfo = getUserInfo(member_id);

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

        //Conversation metadata
        let metadataContainer = createElem2({
            appendTo: conversationCardContent,
            type: "div",
            class: "conversation-metadata"
        });

        function addMetadata(data){
            createElem2({
                appendTo: metadataContainer,
                type: "div",
                innerHTML: data
            })
        }

        addMetadata("ID: " + conversationInfo.ID);
        addMetadata("Owner: " + getUserInfo(conversationInfo.ID_owner).full_name);
        addMetadata("Last activity: " + timeToStr(conversationInfo.last_active));
        addMetadata("Following: " + (conversationInfo.following == 1? "Yes" : "No"));
        addMetadata("Saw last message: " + (conversationInfo.saw_last_message == 1? "Yes" : "No"));

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

            fillElWithUserInfo(memberContainer, member);

        });

        //Process conversation messages
        let conversationMessage = createElem2({
            appendTo: conversationCardContent,
            type: "div",
            class: "conversation-messages"
        });

        data.conversations_messages[conversationInfo.ID].forEach(message => {
            
            let messageContainer = createElem2({
                appendTo: conversationMessage,
                type: "div",
                class: "message"
            });

            //Message author
            let messageAuthor = createElem2({
                appendTo: messageContainer,
                type: "div",
                class: "user-info"
            });
            fillElWithUserInfo(messageAuthor, message.ID_user);

            //Message content
            createElem2({
                appendTo: messageContainer,
                type: "div",
                class: "message-content",
                innerHTML: message.message
            });

            //Message image
            if(message.image_path != null){
                let messageImageContainer = createElem2({
                    appendTo: messageContainer,
                    type: "div",
                });

                let messageImage = createElem2({
                    appendTo: messageImageContainer,
                    type: "img",
                    class: "message-image"
                });
                applyURLToImage(messageImage, message.image_path);
            }

            //Message date
            createElem2({
                appendTo: messageContainer,
                type: "div",
                class: "message-date",
                innerHTML: timeToStr(message.time_insert)
            })

        });

    });
}