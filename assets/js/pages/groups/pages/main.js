/**
 * Groups main page
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.groups.pages.main = {

    /**
     * Open the page
     * 
     * @param {HTMLElement} target The target for the page
     */
    open: function(target){

        //Create page container
        var pageContainer = createElem2({
            appendTo: target,
            type: "div",
            class: "groups-main-page"
        });

        //Add a button to offer to create a group
        var createGroupBtn = createElem2({
            appendTo: pageContainer,
            type: "div",
            class: "btn btn-primary btn-create-group",
            innerHTML: "Create a group"
        });
        createGroupBtn.addEventListener("click", function(e){
            openPage("groups/create");
        });

        //Add loading message
        var message = ComunicWeb.common.messages.createCalloutElem(
            "Loading", 
            "Please wait while we retrieve the list of your groups...",
            "info");
        pageContainer.appendChild(message);

        /**
         * This function is used if an error occurs while retrieving the list
         * of groups of the user
         */
        var getListError = function(){
            
            message.remove();
            
            pageContainer.appendChild(
                ComunicWeb.common.messages.createCalloutElem(
                    "Error", 
                    "An error occurred while retrieving the list of groups of the user!",
                    "danger"
                )
            );
        }

        //Get the list of groups of the user
        ComunicWeb.components.groups.interface.getListUser(function(list){

            //Check for errors
            if(list.error)
                return getListError();
            
            //Get information about the groups
            getInfoMultipleGroups(list, function(info){
                
                if(info.error)
                    return getListError();

                message.remove();

                //Display the list of the groups of the user
                ComunicWeb.pages.groups.pages.main._display_list(pageContainer, info);

            }, true);

        });
    },

    /**
     * Display the list of groups of the user
     * 
     * @param {HTMLElement} target The target for the lsit
     * @param {Object} list The list to apply
     */
    _display_list: function(target, list){
        
        for (const i in list) {
            if (list.hasOwnProperty(i)) {
                const group = list[i];
                
                ComunicWeb.pages.groups.pages.main._display_group(group, target);
            }
        }

    },

    /**
     * Display single group entry
     * 
     * @param {Object} group Information about the group
     * @param {HTMLElement} target The target to display
     * information about the group
     */
    _display_group: function(group, target){

        //Create group item
        var groupItem = createElem2({
            appendTo: target,
            type: "div",
            class: "group-item"
        });

        //Display group information
        createElem2({
            appendTo: groupItem,
            type: "img",
            class: "group-icon",
            src: group.icon_url
        });
        
        var groupName = createElem2({
            appendTo: groupItem,
            type: "div",
            class: "group-name a",
            innerHTML: group.name
        });

        groupName.addEventListener("click", function(e){
            openGroupPage(group);
        });

        //Offer the user to delete its membership
        var deleteButton = createElem2({
            appendTo: groupItem,
            type: "div",
            class: "buttons-area a",
            innerHTML: "<i class='fa fa-trash'></i>"
        });

        deleteButton.addEventListener("click", function(e){

            //Ask user confirmation
            ComunicWeb.common.messages.confirm("Do you really want to delete your membership of this group ?", function(r){
                if(!r) return;

                groupItem.style.visibility = "hidden";

                ComunicWeb.components.groups.interface.removeMembership(group.id, function(result){

                    groupItem.style.visibility = "visible";

                    if(result.error)
                        return notify("Could not delete your membership to this group!", "error");
                    
                    groupItem.remove();

                });
            });

        });

        //Display membership status
        ComunicWeb.pages.groups.sections.membershipBlock.display(group, groupItem);
    }

}