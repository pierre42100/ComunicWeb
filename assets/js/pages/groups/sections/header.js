/**
 * Groups header
 * 
 * @author Pierre HUBERT
 */

const GroupSectionHeader = {

    /**
     * Display groups page header
     * 
     * @param {AdvancedGroupInfo} info Information about the group to display
     * @param {HTMLElement} target The target for the header
     */
    display: function(info, target){
        
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

        //Create header container
        const headerContainer = createElem2({
            appendTo: headerColumn,
            type: "div",
            class: "group-header box box-primary"
        });

        //Create a row
        const row = createElem2({
            appendTo: headerContainer,
            type: "div",
            class: "box-body row"
        });

        //First column
        const firstColumn = createElem2({
            appendTo: row,
            type: "div",
            class: "col-md-4 group-col-icon",
        });

        //Group icon
        const groupIcon = createElem2({
            appendTo: firstColumn,
            type: "img",
            src: info.icon_url,
            class: "group-icon"
        });
        
        //Group name
        const groupName = createElem2({
            appendTo: firstColumn,
            type: "span",
            class: "group-name",
            innerHTML: info.name
        });

        //Group tag (if any)
        if(info.virtual_directory != "null"){
            createElem2({
                appendTo: firstColumn,
                type: "small",
                class: "group-tag",
                innerHTML: "@" + info.virtual_directory
            });
        }


        createElem2({
            appendTo: row,
            type: "div",
            class: "spacer"
        })

        // Second column : basic information about the group
        var thirdColumn = createElem2({
            appendTo: row,
            type: "div",
            class: "col-md-7 col-metadata"
        });
        
        // Forez group
        if (info.is_forez_group) {
            createElem2({
                appendTo: thirdColumn,
                type: "div",
                innerHTML: "<span><i class='fa fa-leaf'></i> Forez Group</span>"
            })
        }

        // Display membership level
        ComunicWeb.pages.groups.sections.membershipBlock.display(info, thirdColumn);
        
        // Display follow block
        if(signed_in() && ComunicWeb.components.groups.utils.isGroupMember(info))
            ComunicWeb.pages.groups.sections.followBlock.display(info, thirdColumn);

        // Likes block
        ComunicWeb.components.like.button.display(
            "group",
            info.id,
            info.number_likes,
            info.is_liking,
            createElem2({
                appendTo: thirdColumn,
                type: "div"
            })
        );
    },

};

ComunicWeb.pages.groups.sections.header = GroupSectionHeader;