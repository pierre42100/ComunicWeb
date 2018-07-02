/**
 * Groups main script
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.groups.main = {

    /**
	 * Open settings page
	 * 
	 * @param {object} args Optionnal arguments
	 * @param {HTMLElement} target The target for the page
	 */
	open: function(args, target){

        //Determine which page / group should be opened
        if(!args.subfolder)
            var page = "main";
        
        else {

            //Extract the name of the page from the URL
            if(!args.subfolder.includes("/"))
                var page = args.subfolder;
            else {
                var page = args.subfolder.split("/")[0];
            }

        }

        //Check if the main page has to be opened
        if(page == "main"){
            ComunicWeb.pages.groups.pages.main.open(target);
        }

        //Else the page was not found
        else
            ComunicWeb.common.error.pageNotFound(args, target);
    }
    
};