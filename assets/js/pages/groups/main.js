/**
 * Groups main script
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.groups.main = {

	/**
	 * Open groups page
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
			if(!signed_in()) openPage("login");
			return ComunicWeb.pages.groups.pages.main.open(target);
		}

		//Check if the page to create a group has to be opened
		else if (page == "create"){
			if(!signed_in()) openPage("login");
			return ComunicWeb.pages.groups.pages.create.open(target);
		}

		//Else determine which group page to open (specified after the ID of the group)
		var groupID = page;
		if(args.subfolder.split("/").length < 2){
			page = "group";
		}
		else {
			//Extract the page to open from the URL
			page = args.subfolder.split("/")[1];

			//Check if there is nothing after "/"
			if(page.length < 2)
				page = "group";
		}

		//Check which page to open
		if(page == "group")
			ComunicWeb.pages.groups.pages.group.open(groupID, target);
		
		else if(page == "settings")
			ComunicWeb.pages.groups.pages.settings.open(groupID, target);
		
		else if(page == "members")
			ComunicWeb.pages.groups.pages.members.open(groupID, target);


		//Unrecognized page
		else
			ComunicWeb.common.error.pageNotFound(args, target);
	}
	
};