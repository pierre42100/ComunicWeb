/**
 * Page settings
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.groups.pages.settings = {

    /**
     * Open group settings page
     * 
     * @param {Number} id The ID of the settings page
     * @param {HTMLElement} target The target of the page
     */
    open: function(id, target){
        
        //Create settings container
        var settingsContainer = createElem2({
            appendTo: target,
            type: "div",
            class: "group-settings-container col-md-6"
        });

        //Add backward link
        var backwardLink = createElem2({
            appendTo: settingsContainer,
            type: "div",
            class: "a",
            innerHTML: "<i class='fa fa-arrow-left'></i> Go back to the group"
        });
        backwardLink.addEventListener("click", function(e){
            openPage("groups/" + id);
        });

        //Add title
        createElem2({
            appendTo: settingsContainer,
            type: "h2",
            class: "title",
            innerHTML: "Group settings"
        });

        //Display loading message
        var loadingMsg = ComunicWeb.common.messages.createCalloutElem(
            "Loading", 
            "Please wait while we retrieve the settings of the page...", 
            "info");
        settingsContainer.appendChild(loadingMsg);
        
        //Get the settings of the page
        ComunicWeb.components.groups.interface.getSettings(id, function(result){

            //Remove loading message
            loadingMsg.remove();

            //Check for error
            if(result.error){
                
                //Check if the user is not authorized to access the page
                if(result.error.code == 401){
                    //The user is not authorized to see this page
                    settingsContainer.appendChild(ComunicWeb.common.messages.createCalloutElem(
                        "Access forbidden",
                        "You are not authorized to access these information !",
                        "danger"
                    ));
                }

                //Else the page was not found
                else {
                    settingsContainer.remove();
                    ComunicWeb.common.error.pageNotFound({}, target);
                }

            }

            else {
                //Display settings pages
                ComunicWeb.pages.groups.pages.settings.display(id, result, settingsContainer);
            }

        });

    },

    /**
     * Display page settings
     * 
     * @param {Number} id The ID of the target page
     * @param {Object} settings The settings of the page
     * @param {HTMLElement} target The target of the page
     */
    display: function(id, settings, target){

        //Create form container
        var formContainer = createElem2({
            appendTo: target,
            type: "div",
            class: "group-settings-form"
        });

        //Group ID (not editable)
        createFormGroup({
            target: formContainer,
            label: "Group ID",
            type: "text",
            value: settings.id,
            disabled: true
        });

        //Group name
        var groupName = createFormGroup({
            target: formContainer,
            type: "text",
            label: "Group name",
            placeholder: "The name of the group",
            value: settings.name,
        });

        //Submit button
        var submitButtonContainer = createElem2({
            appendTo: formContainer,
            type: "div",
            class: "submit-button-container"
        });
        var submitButton = createElem2({
            appendTo: submitButtonContainer,
            type: "div",
            class: "btn btn-primary",
            innerHTML: "Submit"
        });

        submitButton.addEventListener("click", function(e){

            //Check if another request is already pending or not
            if(submitButton.disabled)
                return;

            //Validate the form
            if(!ComunicWeb.common.formChecker.checkInput(groupName, true))
                return;
            
            //Check the length of the name of the group
            if(groupName.value.length < 4)
                return notify("Please check the name of group !", "danger");

            //Prepare the update request on the server
            var settings = {
                name: groupName.value
            };

            //Lock the send button
            submitButton.disabled = true;

            //Perform the request on the API
            ComunicWeb.components.groups.interface.setSettings(id, settings, function(result){

                //Unlock send button
                submitButton.disabled = false;

                //Check for errors
                if(result.error)
                    return notify("An error occured while trying to update group settings!", "danger");
                else
                    return notify("Group settings have been successfully updated!", "success");

            });
        });
    },
}