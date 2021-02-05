/**
 * User page
 * 
 * Display the profile of the user
 * 
 * Main file
 * 
 * @author Pierre HUBERT
 */
ComunicWeb.pages.userPage.main = {

	/**
	 * Open user page
	 * 
	 * @param {Object} params Parametres required to open the page
	 * @param {HTMLElement} target The target for the user page
	 */
	open: function(params, target){
		
		//Check if a subfolder was specified or not
		if(params.subfolder){
			
			var user = params.subfolder;

			//Check if there are also subfolder (which are then removed)
			if(user.indexOf("/")){
				user = user.split("/").shift();
			}

		} else {
			var user = "me";
		}

		//Check if the user specified is an ID
		if(user*1 == user){
			this.openUserPage(user, params, target);
		}
		else {

			//Check if we are opening user page
			if(user === "me"){
				if(signed_in()){
					//Open current user page
					openPage("user/"+userID());
				}
				else {
					//Redirect to login page
					openPage("login");
				}
			}
			else {

				//Search which page should be opened now
				ComunicWeb.user.userInfos.getIDfromPath(user, function(id){
					
					//The user was not found
					if(id < 0){
						ComunicWeb.common.error.pageNotFound(null, target);
					}

					else {
						ComunicWeb.pages.userPage.main.openUserPage(id, params, target);
					}

				});


			}

		}
		
	},

	/**
	 * Open precise user page
	 * 
	 * @param {Integer} id The ID of the user to open the page
	 * @param {Object} params Parametres required to open the page
	 * @param {HTMLElement} target Target of the user page
	 */
	openUserPage: function(id, params, target){
		
		//Log action
		log("Open user page : " + id);
		
		//Fetch informations about the user
		ComunicWeb.user.userInfos.getAdvancedInfos(id, function(response){
			
			//Check for errors
			if(response.error){
				
				//Check if the page was not found
				if(response.error.code == 404){
					ComunicWeb.common.error.pageNotFound(params, target);
				}

				//Check if we are not allowed to get the informations
				if(response.error.code == 401){
					//Display access forbidden page
					ComunicWeb.pages.userPage.accessForbidden.display(id, params, target);
				}

			}
			else {
				//Display user page
				ComunicWeb.pages.userPage.main.displayUserPage(response, params, target);
			}


		});

	},

	/**
	 * Display a user page
	 * 
	 * @param {Object} infos Informations about the user to display
	 * @param {Object} params Parameters required to open the page
	 * @param {HTMLElement} target Target of the user page
	 */
	displayUserPage: function(infos, params, target){

		//Update page title
		ComunicWeb.common.pageTitle.setTitle(infos.firstName + " " + infos.lastName);
		
		//Create the section class content
		var sectionContent = createElem2({
			appendTo: target,
			type: "section",
			class: "content"
		});

		//Content row
		var row = createElem2({
			appendTo: sectionContent,
			type: "div",
			class: "row page-container"
		});

		//Create left column
		var leftColumn = createElem2({
			appendTo: row,
			type: "div",
			class: "col-md-4"
		});

		//Display profile informations
		ComunicWeb.pages.userPage.profileInfos.display(infos, leftColumn);

		//Create right column
		const rightColumn = createElem2({
			appendTo: row,
			type: "div",
			class: "col-md-8 user-page-right-column"
		});

		//Display post creation form if the user is allowed to do so
		if(infos.can_post_texts == true)
			ComunicWeb.components.posts.form.display("user", infos.userID, rightColumn);

		//Display posts
		ComunicWeb.pages.userPage.posts.display(infos, params, rightColumn);
	}

}