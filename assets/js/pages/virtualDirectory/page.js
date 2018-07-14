/**
 * Virtual directory main page
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.virtualDirectory.page = {

	/**
	 * Open virtual directory page
	 * 
	 * @param {object} args Optionnal arguments
	 * @param {HTMLElement} target The target for the page
	 */
	open: function(args, target){

		//Forward the request on the API
		ComunicWeb.components.virtualDirectory.interface.find(args.rootDirectory, function(r){

			//Check for errors
			if(r.error)
				return ComunicWeb.common.error.pageNotFound(args, target);
			
			//Check if the page is a user
			if(r.kind == "user"){
				ComunicWeb.pages.userPage.main.openUserPage(r.id, args, target);
			}

			//Check if the page is  a group
			if(r.kind == "group"){
				ComunicWeb.pages.groups.pages.group.open(r.id, target);
			}
		});

	},

};