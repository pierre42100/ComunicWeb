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
            class: "col-md-4 group-col-icon",
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


        //Second column : Information about the company
        var secondColumn = createElem2({
            appendTo: row,
            type: "div",
            class: "col-md-4"
        });

        add_p(secondColumn, "Column 2 : Group info");

        //Third column : information about the group
        var thirdColumn = createElem2({
            appendTo: row,
            type: "div",
            class: "col-md-4 col-info"
        });

        //Add join date
        var joinDate = createElem2({
            appendTo: thirdColumn,
            type: "div",
            innerHTML: '<i class="fa fa-clock-o"></i> Created '+ComunicWeb.common.date.timeDiffToStr(info.time_create)+' ago'
        });

        //Add number of members
        var joinDate = createElem2({
            appendTo: thirdColumn,
            type: "div",
            innerHTML: '<i class="fa fa-group"></i> '+ info.number_members+' members'
        });

        //Group visibility
        var visibility = {
            open: "Open group",
            private: "Private group",
            secrete: "Secrete group"
        };
        createElem2({
            appendTo: thirdColumn,
            type: "div",
            innerHTML: "<i class='fa fa-lock'></i> " + visibility[info.visibility]
        });

        //Group registration
        var levels = {
            open: "Open registration",
            moderated: "Moderated registration",
            closed: "Closed registration"
        }
        createElem2({
            appendTo: thirdColumn,
            type: "div",
            innerHTML: "<i class='fa fa-pencil'></i> " + levels[info.registration_level]
        });
        

        //Display membership level
        if(signed_in())
            ComunicWeb.pages.groups.sections.membershipBlock.display(info, thirdColumn);

        //If the user is an admin, add a link to configure the page
        if(signed_in() && info.membership == "administrator"){

            var settingsLink = createElem2({
                appendTo: thirdColumn,
                type: "div",
                class: "a",
                innerHTML: " <i class='fa fa-gear'></i>Settings"
            });
            settingsLink.addEventListener("click", function(e){
                openPage("groups/" + info.id + "/settings");
            });
        }
    },

};