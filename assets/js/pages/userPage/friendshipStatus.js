/**
 * Handle the update of the friendship status
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.userPage.friendshipStatus = {

	/**
	 * Display the friendship status
	 * 
	 * @param {Integer} userID The ID of the target user
	 * @param {HTMLElement} target The target element
	 */
	display: function(userID, target){
		
		//Get the current status of the friendship
		ComunicWeb.components.friends.list.getStatus(userID, function(response){
			
			//Empty the target area
			emptyElem(target);
			target.innerHTML = "";

			//Check for errors
			if(response.error){
				message = ComunicWeb.common.messages.createCalloutElem("Error", "Couldn't load friendship informations !", "danger");
				target.appendChild(message);
				return;
			}

			//Check if the user has received a friendship request
			if(response.received_request){
				
				//Offer the user to reject a frienship request
				var rejectRequest = createElem2({
					appendTo: target,
					type: "button",
					class: "btn btn-xs btn-danger",
					innerHTML: "Reject request"
				});
				
				createElem2({
					appendTo: target,
					type: "span",
					innerHTML: " ",
				})

				//Offer the user to accept a frienship request
				var acceptRequest = createElem2({
					appendTo: target,
					type: "button",
					class: "btn btn-xs btn-success",
					innerHTML: "Accept request"
				});

				//Prepare the buttons
				acceptRequest.setAttribute("data-accept", "true");
				rejectRequest.setAttribute("data-accept", "false");

				//Setup the action
				var respondRequest = function(){

					//Lock the buttons
					acceptRequest.disabled = true;
					rejectRequest.disabled = true;

					//Get the status of the request
					var accept = this.getAttribute("data-accept") == "true";
					
					//Perform the action
					ComunicWeb.components.friends.list.respondRequest(userID, accept, function(response){
						
						//Unlock the buttons
						acceptRequest.disabled = false;
						rejectRequest.disabled = false;

						//Check for errors
						if(response.error){
							ComunicWeb.common.notificationSystem.showNotification("Couldn't update request status !", 
							"danger", 5);
						}

						else {
							//Reopen user page
							openUserPageFromID(userID);
						}

					});
					

				}
				acceptRequest.onclick = respondRequest;
				rejectRequest.onclick = respondRequest;

			}

			//Check if user has sent a friendship request
			else if(response.sent_request){
				
				//Offer the user to cancel a frienship request
				var cancelRequest = createElem2({
					appendTo: target,
					type: "button",
					class: "btn btn-xs btn-danger",
					innerHTML: "Cancel request"
				});

				cancelRequest.onclick = function(){

					//Lock button
					this.disabled = true;

					//Send the request
					ComunicWeb.components.friends.list.removeRequest(userID, function(response){

						//Check for errors
						if(response.error){
							ComunicWeb.common.notificationSystem.showNotification("An error occured while trying to remove the request !");
						}

						//Reload this component
						ComunicWeb.pages.userPage.friendshipStatus.display(userID, target);

					});

				}

			}

			//Display send request message
			else if(response.are_friend == false) {
				
				//Offer the user to send a frienship request
				var sendRequestButton = createElem2({
					appendTo: target,
					type: "button",
					class: "btn btn-xs btn-primary",
					innerHTML: "Send request"
				});

				sendRequestButton.onclick = function(){

					//Lock button
					this.disabled = true;

					//Send the request
					ComunicWeb.components.friends.list.sendRequest(userID, function(response){

						//Check for errors
						if(response.error){
							ComunicWeb.common.notificationSystem.showNotification("An error occured while trying to send the request !");
						}

						//Reload this component
						ComunicWeb.pages.userPage.friendshipStatus.display(userID, target);

					});

				}

			}

			//Offer user to follow other user
			else {

				//Setup button
				var followButton = createElem2({
					appendTo: target,
					type: "button",
					class: "btn btn-primary btn-block",
				});

				if(response.following){
					followButton.innerHTML = "Following";
					followButton.setAttribute("data-following", "true");
				}
				else {
					followButton.innerHTML = "Follow";
					followButton.setAttribute("data-following", "false");
				}

				//Make the follow button live
				followButton.onclick = function(){
					
					//Lock button
					this.disabled = true;

					//Check if the user has to be followed or not (reverse current state)
					var follow = this.getAttribute("data-following") == "false";

					ComunicWeb.components.friends.list.setFollowing(userID, follow, function(response){

						//Check for errors
						if(response.error){
							ComunicWeb.common.notificationSystem.showNotification("An error occured while trying to update following status !");
						}

						//Reload this component
						ComunicWeb.pages.userPage.friendshipStatus.display(userID, target);

					});
				}

			}

		});

	}

}