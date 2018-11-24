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

        //Update page title
        ComunicWeb.common.pageTitle.setTitle(info.name);

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


        //Check if the user can create posts or not
        if(ComunicWeb.components.groups.utils.canCreatePosts(info)){
            
            //Intialize posts creation form
            var postFormRow = createElem2({
                appendTo: target,
                type: "div",
                class: "row group-page"
            });

            //Add column
            var postFormCol = createElem2({
                appendTo: postFormRow,
                type: "div",
                class: "col-md-6"
            });

            //Display form
            ComunicWeb.components.posts.form.display("group", id, postFormCol);
        }

        //Display group posts
        var postsRow = createElem2({
            appendTo: target,
            type: "div",
            class: "row group-page"
        });

        var postsCol = createElem2({
            appendTo: postsRow,
            type: "div",
            class: "col-md-6"
        });

        ComunicWeb.pages.groups.sections.posts.display(info, postsCol);

    }

}