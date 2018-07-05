/**
 * Membership information block
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.groups.sections.membershipBlock = {

	/**
	 * Display membership block
	 * 
	 * @param {Object} info Information about the membership (= basic info about the group)
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
		
		//Check if the user has been invited
		if(info.membership == "invited"){
			var invitedContainer = createElem2({
				appendTo: container,
				type: "span",
				innerHTML: "<i class='fa fa-question'></i> Invited "
			});

			//Offer the user to accept the invitation
			var acceptInvitation = createElem2({
				appendTo: invitedContainer,
				type: "span",
				class: "a",
				innerHTML: "Accept"
			});

			add_space(invitedContainer);

			//Offer the user to reject
			var rejectInvitation = createElem2({
				appendTo: invitedContainer, 
				type: "span",
				class: "a reject-group-invitation-link",
				innerHTML: "Reject"
			});

			/**
			 * Respond to a group invitation
			 * 
			 * @param {Boolean} accept Set whether the invation was accepted or not
			 */
			var respondInvitation = function(accept){

				//Perform the request over the server
				ComunicWeb.components.groups.interface.respondInvitation(info.id, accept, function(result){

					//Check for errors
					if(result.error)
						notify("An error occurred while trying to respond to the invitation!", "danger");
					
					//Refresh the component
					emptyElem(container);
					ComunicWeb.components.groups.interface.getInfo(info.id, function(result){

						//Check for errors
						if(result.error)
							return notify("Could not refresh membership information!", "danger");
						
						//Display the component again
						ComunicWeb.pages.groups.sections.membershipBlock.display(result, container);

					});

				});

			}

			//Accept invitation
			acceptInvitation.addEventListener("click", function(e){
				//Accept the invitation
				respondInvitation(true);
			});

			//Reject invitation
			rejectInvitation.addEventListener("click", function(e){

				ComunicWeb.common.messages.confirm("Do you really want to reject this invitation ?", function(r){
					if(!r) return;

					//Reject the invitation
					respondInvitation(false);
				})

			});
		}

	}

};