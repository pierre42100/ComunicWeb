/**
 * Group members page
 * 
 * @author Pierre HubERT
 */

ComunicWeb.pages.groups.pages.members = {

	/**
	 * Open member settings page
	 * 
	 * @param {Number} id The ID of group
	 * @param {HTMLElement} target The target of the page
	 */
	open: function(id, target){

		//Create container
		var membersContainer = createElem2({
			appendTo: target,
			type: "div",
			class: "col-md-6 group-members-page"
		});

		//Add backward link
		var backwardLink = createElem2({
			appendTo: membersContainer,
			type: "div",
			class: "a backward-link",
			innerHTML: "<i class='fa fa-arrow-left'></i> Go back to the group"
		});
		backwardLink.addEventListener("click", function(e){
			openPage("groups/" + id);
		});

		//Loading message
		var loadingMsg = ComunicWeb.common.messages.createCalloutElem(
			"Loading",
			"Please wait while we load a few information...",
			"info"
		);
		membersContainer.appendChild(loadingMsg);

		//Get information about the group
		ComunicWeb.components.groups.interface.getInfo(id, function(info){

			//Check for errors
			if(info.error){
				loadingMsg.remove();
				membersContainer.appendChild(
					ComunicWeb.common.messages.createCalloutElem(
						"Error", 
						"Could not get group information !", 
						"danger"
					)
				);
				return;
			}

			//Get the list of members of the group
			ComunicWeb.components.groups.interface.getMembers(id, function(members){

				//Check for errors
				if(members.error){
					loadingMsg.remove();
					membersContainer.appendChild(
						ComunicWeb.common.messages.createCalloutElem(
							"Error", 
							"Could not get group members !", 
							"danger"
						)
					);
					return;
				}

				//Get the ID of the members of the group
				var membersIDs = ComunicWeb.components.groups.utils.getMembersIDs(members);

				//Get information about the members of the group
				ComunicWeb.user.userInfos.getMultipleUsersInfos(membersIDs, function(users){

					//Check for errors
					if(users.error){
						loadingMsg.remove();
						membersContainer.appendChild(
							ComunicWeb.common.messages.createCalloutElem(
								"Error", 
								"Could not get group members information !", 
								"danger"
							)
						);
						return;
					}

					//Remove loading message
					loadingMsg.remove();

					//Display the members list
					ComunicWeb.pages.groups.pages.members.displayList(info, members, users, membersContainer);

				});


			});
			

		});
	},

	/**
	 * Display the list of members of the group
	 * 
	 * @param {Object} info Information about the group
	 * @param {Array} list The list of members of the group
	 * @param {Object} users The list of users of the group
	 * @param {HTMLElement} target The target for the list
	 */
	displayList: function(info, list, users, target){

		//Append the title of the group
		createElem2({
			appendTo: target,
			type: "h2",
			class: "title",
			innerHTML: "Members of " + info.name
		});

		//Process the list of the members
		var membersList = createElem2({
			appendTo: target,
			type: "div",
			class: "members-list"
		});

		list.forEach(function(member){

			//Fetch user information
			var userInfo = users["user-" + member.user_id];
			
			//Create member container
			var memberContainer = createElem2({
				appendTo: membersList,
				type: "div",
				class: "member"
			});

			//User account image and name
			createElem2({
				appendTo: memberContainer,
				type: "img",
				class: "user-image",
				src: userInfo.accountImage
			});

			createElem2({
				appendTo: memberContainer,
				type: "span",
				class: "member-name",
				innerHTML: userFullName(userInfo)
			});
		});
	}
}