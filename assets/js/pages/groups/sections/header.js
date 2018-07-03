/**
 * Groups header
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.groups.sections.header = {

    /**
     * Display groups page header
     * 
     * @param {Object} info Information about the group to display
     * @param {HTMLElement} target The target for the header
     */
    display: function(info, target){
        
        //Create header container
        var headerContainer = createElem2({
            appendTo: target,
            type: "div",
            class: "group-header"
        });

        //Create a row
        var row = createElem2({
            appendTo: headerContainer,
            type: "div",
            class: "row"
        });

        //First column
        var firstColumn = createElem2({
            appendTo: row,
            type: "div",
            class: "col-lg-8"
        });

        //Group icon
        var groupIcon = createElem2({
            appendTo: firstColumn,
            type: "img",
            src: info.icon_url,
            class: "group-icon"
        });
        
        //Group name
        var groupName = createElem2({
            appendTo: firstColumn,
            type: "span",
            class: "group-name",
            innerHTML: info.name
        });
    },

};