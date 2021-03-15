/**
 * Groups main script
 * 
 * @author Pierre HUBERT
 */

const GroupsPage = {

	/**
	 * Open groups page
	 * 
	 * @param {object} args Optionnal arguments
	 * @param {HTMLElement} target The target for the page
	 */
	open: async function(args, target){

		try {

			//Determine which page / group should be opened
			if(args.groupID)
				page = args.groupID;

			else if(!args.subfolder)
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
			if(!args.subfolder || args.subfolder.split("/").length < 2){
				page = "posts";
			}
			else {
				//Extract the page to open from the URL
				page = args.subfolder.split("/")[1];

				//Check if there is nothing after "/"
				if(page.length < 2)
					page = "posts";
			}

			/** @type {AdvancedGroupInfo} Get information about the group*/
			const group = await new Promise((res, rej) => GroupsInterface.getAdvancedInfo(groupID, function(result){

				//Check for errors
				if(result.error){
	
					//Check the code of the error
					if(result.error.code == 401)
						ComunicWeb.pages.groups.pages.forbidden.open(id, target);
					
					//The group does not exists
					else 
						
						ComunicWeb.common.error.pageNotFound({}, target);
					return;
				}
	
				res(result);
	
			}));

			//Update page title
			ComunicWeb.common.pageTitle.setTitle(group.name);
	
			// Display the header for the group
			GroupSectionHeader.display(group, target);

			// Display the tabs of the group
			await GroupTabs.show(group, target, page);

		} catch(e) {
			console.error(e);
			target.appendChild(createCallout(
				tr("Error"),
				tr("Failed to load group page!"),
				"danger"
			))
		}
		
		
		/*//Check which page to open
		if(page == "group")
			ComunicWeb.pages.groups.pages.group.open(groupID, target);
		
		else if(page == "settings")
			ComunicWeb.pages.groups.pages.settings.open(groupID, target);
		
		else if(page == "members")
			ComunicWeb.pages.groups.pages.members.open(groupID, target);


		//Unrecognized page
		else
			ComunicWeb.common.error.pageNotFound(args, target);*/
	}
	
};

ComunicWeb.pages.groups.main = GroupsPage;