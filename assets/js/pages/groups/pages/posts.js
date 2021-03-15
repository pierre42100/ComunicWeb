/**
 * Group page
 * 
 * @author Pierre HUBERT
 */

const GroupPostsPage = {

    /**
     * Display information about a group
     * 
     * @param {Number} id The ID of the group to display
     * @param {Object} info Information about the group to display
     * @param {HTMLElement} target The target for the page
     */
    display: function(id, info, target){

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