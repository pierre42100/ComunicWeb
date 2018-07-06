/**
 * Access to group forbiden page script
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.groups.pages.forbidden = {

    /**
     * Open access forbidden page
     * 
     * @param {Number} id The ID of the target group
     * @param {HTMLElement} target The target of the page
     */
    open: function(id, target){

        //Create page container
        var pageContainer = createElem2({
            appendTo: target,
            type: "div",
            class: "group-forbidden-page-container"
        });

        //Loading message target
        var loadingMessage = ComunicWeb.common.messages.createCalloutElem(
            "Loading", 
            "Please wait while we load a few information...", 
            "info");
        pageContainer.appendChild(loadingMessage);

        //Get information about the page
        ComunicWeb.components.groups.interface.getInfo(id, function(result){

            //Remove loading message
            loadingMessage.remove();

            //Check for errors
            if(result.error){
                pageContainer.appendChild(
                    ComunicWeb.common.messages.createCalloutElem(
                        "Error",
                        "An error occured while retrieve group information!",
                        "danger"
                    )
                );
            }

            //Display forbidden page
            ComunicWeb.pages.groups.pages.forbidden.display(id, result, pageContainer);

        });

    },

    /**
     * Display forbidden page
     * 
     * @param {Number} id The ID of the group
     * @param {Object} result Information about the group
     * @param {HTMLElement} target The target for the page
     */
    display: function(id, result, target){

        //Create a box to contain information about registration
        var box = createElem2({
            appendTo: target,
            type: "div",
            class: "box box-primary"
        });

        //Box body
        var boxBody = createElem2({
            appendTo: box,
            type: "div",
            class: "box-body"
        });

        //Display basical information about the group
        //Group logo
        createElem2({
            appendTo: boxBody,
            type: "img",
            src: result.icon_url,
            class: "group-logo"
        });

        //Add group title
        createElem2({
            appendTo: boxBody,
            type: "h2",
            innerHTML: result.name,
            class: "group-name"
        });

        //Add a notice
        add_p(boxBody, "A registration is required to access this group contents.");

        //Append membership block (if the user is signed in)
        if(signed_in())
            ComunicWeb.pages.groups.sections.membershipBlock.display(result, boxBody);
    },
}