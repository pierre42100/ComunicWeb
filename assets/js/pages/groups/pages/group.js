/**
 * Group page
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.groups.pages.group = {

    /**
     * Open (display) a group page
     * 
     * @param {Number} id The ID of the group to display
     * @param {HTMLElement} target The target for the page
     */
    open: function(id, target){
        
        //Get information about the group
        ComunicWeb.components.groups.interface.getAdvancedInfo(id, function(result){

            //Check for errors
            if(result.error){

                //Check the code of the error
                if(result.error.code == 401){
                    ComunicWeb.pages.groups.pages.forbidden.open(id, target);
                }

                else 
                    //The group does not exists
                    ComunicWeb.common.error.pageNotFound({}, target);

            }

            else
                //Display group page
                ComunicWeb.pages.groups.pages.group.display(id, result, target);

        });

    },

    /**
     * Display information about a group
     * 
     * @param {Number} id The ID of the group to display
     * @param {Object} info Information about the group to display
     * @param {HTMLElement} target The target for the page
     */
    display: function(id, info, target){

        //Create page row
        var pageRow = createElem2({
            appendTo: target,
            type: "div",
            class: "row group-page"
        });

        //Create header column
        var headerColumn = createElem2({
            appendTo: pageRow,
            type: "div",
            class: "col-md-6"
        });

        //Display the header for the group
        ComunicWeb.pages.groups.sections.header.display(info, headerColumn);

    }

}