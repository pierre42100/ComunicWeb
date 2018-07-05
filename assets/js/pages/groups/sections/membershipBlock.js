/**
 * Membership information block
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.groups.sections.membershipBlock = {

    /**
     * Display membership block
     * 
     * @param {Object} info Information about the membership
     * @param {HTMLElement} target The target where the block will be applied
     */
    display: function(info, target){
        
        //Membership container
        var container = createElem2({
            appendTo: target, 
            type: "div"
        });

        //Check if the user is an administrator / moderator / member
        if(info.membership == "administrator")
            return createElem2({
                appendTo: container,
                type: "span",
                innerHTML: "<i class='fa fa-check'></i> Administrator"
            });
        
        if(info.membership == "moderator")
            return createElem2({
                appendTo: container,
                type: "span",
                innerHTML: "<i class='fa fa-check'></i> Moderator"
            });
        
        if(info.membership == "member")
            return createElem2({
                appendTo: container,
                type: "span",
                innerHTML: "<i class='fa fa-check'></i> Member"
            });

    }

};