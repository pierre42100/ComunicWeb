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
		var membersPage = createElem2({
			appendTo: target,
			type: "div",
			class: "col-md-6 group-members-page"
		});

		//Add backward link
		var backwardLink = createElem2({
			appendTo: membersPage,
			type: "div",
			class: "a backward-link",
			innerHTML: "<i class='fa fa-arrow-left'></i> Go back to the group"
		});
		backwardLink.addEventListener("click", function(e){
			openPage("groups/" + id);
		});

		//Get information about the group
		ComunicWeb.components.groups.interface.getInfo(id, function(info){

			//Check for errors
			if(info.error){
				membersPage.appendChild(
					ComunicWeb.common.messages.createCalloutElem(
						"Error", 
						"Could not get group information !", 
						"danger"
					)
				);
				return;
			}

			ComunicWeb.pages.groups.pages.members.applyGroupInfo(id, info, membersPage);
		});

	},

	/**
	 * Apply group information
	 * 
	 * @param {Number} id The ID of the group
	 * @param {Object} info Information about the target of the group
	 * @param {HTMLElement} target The target for the page
	 */
	applyGroupInfo: function(id, info, target){

		document.title = info.name + " - Members";

		//Append the title of the group
		createElem2({
			appendTo: target,
			type: "h2",
			class: "title",
			innerHTML: "Members of " + info.name
		});

		//Add invite form
		var inviteFormTarget = createElem2({
			appendTo: target,
			type: "div"
		});
		var inviteFormCallback;
		
		//Add members list target
		var membersList = createElem2({
			appendTo: target,
			type: "div",
			class: "members-list"
		});

		/**
		 * Load the page components
		 */
		var loadComponents = function(){
			ComunicWeb.pages.groups.pages.members.addInviteForm(info, inviteFormTarget, inviteFormCallback);
			ComunicWeb.pages.groups.pages.members.refreshMembersList(id, info, membersList);
		}

		/**
		 * Method called when a user has just been invited
		 */
		inviteFormCallback = function(){
			emptyElem(inviteFormTarget);
			emptyElem(membersList);
			loadComponents();
		}

		loadComponents();
	},

	/**
	 * Add members invite form
	 * 
	 * @param {Object} info Information about the target group
	 * @param {HTMLElement} target The target for the form
	 * @param {Function} callback
	 */
	addInviteForm: function(info, target, callback){

		//Create form container
		var formContainer = createElem2({
			appendTo: target,
			type: "form",
			class: "invite-user-form"
		});

		//Form input
		var userInput = createFormGroup({
			target: formContainer, 
			multiple: false,
			placeholder: "Select user",
			type: "select2"});
		userInput.parentNode.className = "input-group";

		ComunicWeb.components.userSelect.init(userInput);

		//Add submit button
		var groupsButton = createElem2({
			appendTo: userInput.parentNode,
			type: "div",
			class: "input-group-btn"
		});

		createElem2({
			appendTo: groupsButton,
			type: "button",
			elemType: "submit",
			class: "btn btn-primary",
			innerHTML: "Invite user"
		});

		/**
		 * Handle form submit
		 */
		formContainer.onsubmit = function(){

			//Get the list of selected users
			var usersToInvite = ComunicWeb.components.userSelect.getResults(userInput);

			//Check if there is not any user to invite
			if(usersToInvite.length == 0){
				notify("Please choose a user to invite!", "danger");
				return false;
			}

			//Invite the first selected user
			ComunicWeb.components.groups.interface.inviteUser(usersToInvite[0], info.id, function(result){

				if(result.error)
					return notify("Could not invite user to join the group!", "danger");
				
				callback();

			});

			return false;
		}
	},

	/**
	 * Refresh the list of members of the group
	 * 
	 * @param {Number} id The ID of the target group
	 * @param {Object} info Information about the group
	 * @param {HTMLElement} target The target for the list
	 */
	refreshMembersList: function(id, info, target){

		//Loading message
		var loadingMsg = ComunicWeb.common.messages.createCalloutElem(
			"Loading",
			"Please wait while we load a few information...",
			"info"
		);
		target.appendChild(loadingMsg);

		//Get the list of members of the group
		ComunicWeb.components.groups.interface.getMembers(id, function(members){

			//Check for errors
			if(members.error){
				loadingMsg.remove();
				target.appendChild(
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
			getMultipleUsersInfos(membersIDs, function(users){

				//Check for errors
				if(users.error){
					loadingMsg.remove();
					target.appendChild(
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

				//Display the group members list
				ComunicWeb.pages.groups.pages.members.displayList(info, members, users, target);

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
		//Process the list of members
		list.forEach(function(member){
			ComunicWeb.pages.groups.pages.members._display_member(info, member, users, target);
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
		var membershipChooseContainer = createElem2({
			appendTo: memberContainer,
			type: "div",
			class: "btn-group"
		});
		var membershipLevelButton = createElem2({
			appendTo: membershipChooseContainer,
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

		//Manage other levels
		else if(info.membership == "administrator" && userID() != userInfo.userID) {

			//Add dropdown attribute to the button
			membershipLevelButton.setAttribute("data-toggle", "dropdown");

			var membershipDropdown = createElem2({
				appendTo: membershipChooseContainer,
				type: "ul",
				class: "dropdown-menu"
			});

			/**
			 * Add an option to membership dropdown menu
			 * 
			 * @param {String} name The name of the option to add
			 */
			var addOption = function(name){

				//Create element
				var elemLi = createElem2({
					appendTo: membershipDropdown,
					type: "li"
				});

				//Add link
				var elemLink = createElem2({
					appendTo: elemLi,
					type: "a"
				});

				//Add option name
				createElem2({
					appendTo: elemLink,
					type: "span",
					innerHTML: membershipLevels[name]
				});

				//Make the option lives
				elemLi.addEventListener("click", function(e){

					//Perform a request over the API
					ComunicWeb.components.groups.interface.updateMembership(info.id, userInfo.userID, name, function(result){

						//Check for error
						if(result.error)
							return notify("An error occurred while trying to update the membership of this user!", "danger");
						
						//Display new membership
						membershipLevelButton.innerHTML = membershipLevels[name];
					});

				});
			};

			addOption("administrator");
			addOption("moderator");
			addOption("member");
		}
	}
}