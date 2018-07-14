/**
 * Friend user interface script
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.friends.ui = {

	/**
	 * Display a single friend informations
	 * 
	 * @param {HTMLElement} target The target to display the friend
	 * @param {Object} friend Informations about the friendship
	 * @param {Object} user Informations about the user
	 */
	show_personnal_friend: function(target, friend, user){

		//Create friend container, if required
		if(target.className == "friend"){
			var friendContainer = target;
			emptyElem(friendContainer);
		}
		else
			var friendContainer = createElem2({
				appendTo: target,
				type: "div",
				class: "friend"
			});

		//Get informations about the friend
		const friendID = friend.ID_friend;

		//Create user link
		const userLink = createElem2({
			appendTo: friendContainer,
			type: "a"
		});

		//Add user account image
		createElem2({
			appendTo: userLink,
			type: "img",
			src: user.accountImage
		});

		//Add users name
		createElem2({
			appendTo: userLink,
			type: "div",
			class: "friends-name",
			innerHTML: userFullName(user)
		});

		//Make the link button lives
		userLink.onclick = function(){
			
			//Open user page
			openUserPage(user);

			//Close all modals
			$(".modal").modal("hide");

		}

		//Create actions area
		var actionsOnFriendArea = createElem2({
			appendTo: friendContainer, 
			type: "div",
			class: "friends-actions"
		});

		//Check if the friendship has been accepted or not
		if(friend.accepted == 0){

			//Offer the user to accept or reject friendship request
			//Reject
			var rejectRequestBtn = createElem2({
				appendTo: actionsOnFriendArea,
				type: "input",
				elemType: "button",
				class: "btn btn-danger",
				value: "Refuser"
			});
			rejectRequestBtn.setAttribute("data-accept-request", "false");
			
			add_space(actionsOnFriendArea);

			//Accept
			var acceptRequestBtn = createElem2({
				appendTo: actionsOnFriendArea,
				type: "button",
				class: "btn btn-success",
				innerHTML: "Accepter"
			});
			acceptRequestBtn.setAttribute("data-accept-request", "true");

			add_space(actionsOnFriendArea);

			//Make the buttons lives
			var respond = function(){
				
				//Check whether the request was accepted or not
				var accept = this.getAttribute("data-accept-request") == "true";

				//Perform the request on the server
				ComunicWeb.components.friends.list.respondRequest(friendID, accept, function(r){

					//Check for error
					if(r.error){
						ComunicWeb.common.notificationSystem.showNotification("Could not respond to request !", "danger");
						return;
					}

					if(!accept){
						friendContainer.remove();
					}
					else {

						//Update friendship informations
						ComunicWeb.components.friends.actions.refresh_single_personnal(friendID, friendContainer);
					}

				});

			};
			
			acceptRequestBtn.onclick = respond;
			rejectRequestBtn.onclick = respond;
		}

		else {

			//Display following state
			var followButton = createElem2({
				appendTo: actionsOnFriendArea,
				type: "button",
				class: "btn btn-primary"
			});

			if(friend.following == 0){
				followButton.innerHTML = "Follow";
				followButton.setAttribute("data-set-following", "true");
			}
			else {
				followButton.innerHTML = "<i class='fa fa-check'></i>  Following";
				followButton.setAttribute("data-set-following", "false");
			}

			add_space(actionsOnFriendArea);

			followButton.onclick = function(){

				//Check if the request is to follow or not the user
				var follow = this.getAttribute("data-set-following") == "true";

				//Lock button
				followButton.disabled = true;

				//Perform callback action
				ComunicWeb.components.friends.list.setFollowing(friendID, follow, function(r){
					
					//Check for errors
					if(r.error){
						ComunicWeb.common.notificationSystem.showNotification("Could not update follow state !", "danger");
					}

					//Update friendship informations
					ComunicWeb.components.friends.actions.refresh_single_personnal(friendID, friendContainer);
				});

			}

			//Check if the user can post text on user page
			var postTextsButton = createElem2({
				appendTo: actionsOnFriendArea,
				type: "button",
				class: "btn btn-primary"
			});

			if(friend.canPostTexts){
				postTextsButton.innerHTML = "<i class='fa fa-check'></i> Post Texts";
				postTextsButton.setAttribute("data-allow-post-texts", "false");
			}
			else {
				postTextsButton.innerHTML = "Post Texts";
				postTextsButton.setAttribute("data-allow-post-texts", "true");
			}

			//Make the button lives
			postTextsButton.onclick = function(){
				
				//Check out if we have to allow or disallow texts post
				var allow_post = this.getAttribute("data-allow-post-texts") == "true";

				//Update the status
				ComunicWeb.components.friends.interface.set_can_post_texts(friendID, allow_post, function(r){

					if(r.error)
						ComunicWeb.common.notificationSystem.showNotification("Could not update posts creation status !", "danger");
					
					//Update friendship informations
					ComunicWeb.components.friends.actions.refresh_single_personnal(friendID, friendContainer);

				});
			}
		}

		

		//Offer to delete friendship
		const deleteLink = createElem2({
			appendTo: friendContainer,
			type: "a",
			innerHTML: "<i class='fa fa-trash'></i>"
		});

		//Make the delete button lives
		deleteLink.onclick = function(){

			//Prompt user confirmation
			if(ComunicWeb.common.messages.confirm("Do you really want to delete this user from your friends list ?", function(confirm){
				
				//Check if the user cancelled the operation
				if(!confirm)
					return;
				
				//Try to delete the friend from the list
				friendContainer.style.visibility = "hidden";
				ComunicWeb.components.friends.interface.remove_friend(friendID, function(result){

					//Make friend container visible
					friendContainer.style.visibility = "visible";

					//Check for errors
					if(result.error){
						ComunicWeb.common.notificationSystem.showNotification("Could not delete friend !", "danger");
						return;
					}

					//Delete the element
					friendContainer.remove();

				});

			}));
		}

	}

}