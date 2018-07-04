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
                ComunicWeb.pages.groups.pages.settings.display(id, result, target);
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

        alert(settings);

    },
}