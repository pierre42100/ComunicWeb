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

    },

}