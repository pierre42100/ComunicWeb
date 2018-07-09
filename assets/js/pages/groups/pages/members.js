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

		//Process the list of members
		list.forEach(function(member){
			ComunicWeb.pages.groups.pages.members._display_member(info, member, users, membersList);
		});
	},

	/**
	 * Display a single membership information
	 * 
	 * @param {Object} info Information about the group
	 * @param {Object} member Information about the membership
	 * @param {Object} users The list of users of the group
	 * @param {HTMLElement} target The target for the list
	 */
	_display_member: function(info, member, users, target){

		//Fetch user information
		var userInfo = users["user-" + member.user_id];
		
		//Create member container (if required)
		if(target.className != "member")
			var memberContainer = createElem2({
				appendTo: target,
				type: "div",
				class: "member"
			});
		else {
			emptyElem(target);
			var memberContainer = target;
		}

		//User account image and name
		createElem2({
			appendTo: memberContainer,
			type: "img",
			class: "user-image",
			src: userInfo.accountImage
		});

		createElem2({
			appendTo: memberContainer,
			type: "div",
			class: "member-name",
			innerHTML: userFullName(userInfo)
		});

		//Add an option to delete the member
		//Delete user button
		var deleteUserButton = createElem2({
			appendTo: memberContainer,
			type: "div",
			class: "delete-link",
			innerHTML: "<i class='fa fa-trash'></i>"
		});
		if(userID() != userInfo.userID){

			deleteUserButton.addEventListener("click", function(e){

				//Ask user confirmation
				ComunicWeb.common.messages.confirm("Do you really want to delete this membership ?", function(r){
					if(!r) return;

					//Hide the member
					memberContainer.style.visibility = "hidden";

					ComunicWeb.components.groups.interface.deleteMember(info.id, userInfo.userID, function(result){

						//Show the member
						memberContainer.style.visibility = "visible";

						//Check for error
						if(result.error)
							return notify("Could not delete the member from the group!", "danger");
						
						//Else, remove completely the member
						memberContainer.remove();

					});

				});

			})
		}
		else
			deleteUserButton.style.visibility = "hidden";

		//Display user membership level
		var membershipLevels = {
			administrator: "Administrator",
			moderator: "Moderator",
			member: "Member",
			invited: "Invited",
			pending: "Requested"
		};
		var membershipLevelButton = createElem2({
			appendTo: memberContainer,
			type: "button",
			class: "btn btn-default dropdown-toggle btn-membership-level",
			type: "button",
			innerHTML: membershipLevels[member.level]
		});
		add_space(memberContainer);

		//Check if the user is pending
		if(member.level == "pending"){

			//Disable membership level button
			membershipLevelButton.disabled = true;

			//Create container
			var responseContainer = createElem2({
				appendTo: memberContainer,
				type: "div"
			});

			//Offer the moderator to accept or not the request
			var acceptRequest = createElem2({
				appendTo: responseContainer,
				type: "div",
				class: "btn btn-success",
				innerHTML: "Accept"
			});
			add_space(responseContainer);
			var rejectRequest = createElem2({
				appendTo: responseContainer,
				type: "div",
				class: "btn btn-danger",
				innerHTML: "Reject"
			});

			/**
			 * Respond to user request
			 * 
			 * @param {Boolean} accept Specify whether the request was accepted or not
			 */
			var respondRequest = function(accept){

				//Hide response area
				responseContainer.style.visibility = "hidden";

				//Perform the request on the API
				ComunicWeb.components.groups.interface.respondRequest(info.id, userInfo.userID, accept, function(result){

					//Check for errors
					if(result.error){
						responseContainer.style.visibility = "visible";
						return notify("An error occurred while trying to respond to the request!", "danger");
					}	
					
					//If the response was to reject the request, remove the user from the list
					if(!accept)
						memberContainer.remove();
					else {

						ComunicWeb.components.groups.interface.getMembership(userInfo.userID, info.id, function(member){

							//Check for errors
							if(member.error)
								return notify("Could not refresh membership information!", "danger");
							
							//Apply new membership information
							ComunicWeb.pages.groups.pages.members._display_member(info, member, users, memberContainer);
						});
					}
				})

			}

			//Make the buttons lives
			acceptRequest.addEventListener("click", function(e){respondRequest(true)});
			rejectRequest.addEventListener("click", function(e){respondRequest(false)});
		}

		//Check if the user was invited
		else if(member.level == "invited"){

			//Disable membership level button
			membershipLevelButton.disabled = true;

			//Add a button to cancel invitation
			var cancelInvitationButton = createElem2({
				appendTo: memberContainer,
				type: "div",
				class: "btn btn-danger",
				innerHTML: "Cancel"
			});

			cancelInvitationButton.addEventListener("click", function(e){

				//Peform the request on the APi
				ComunicWeb.components.groups.interface.cancelInvitation(info.id, userInfo.userID, function(result){

					cancelInvitationButton.style.visibility = "hidden";

					//Check for errors
					if(result.error){
						cancelInvitationButton.style.visibility = "visible";
						return notify("An error occurred while trying to cancel the invitation!", "danger");
					}

					//Remove the member
					memberContainer.remove();
				});

			});
		}

	}
}