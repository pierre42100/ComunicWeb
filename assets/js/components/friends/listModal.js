/**
 * Friends list modal
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.friends.listModal = {

	/**
	 * Display the box that contains the list of friends of the user
	 * 
	 * @param {number} user The ID of the target user
	 */
	display: function(user){
		
		//Check if the user is requesting its own friends list or not
		if(user == userID()){

			//Get the list of friends of the current user
			ComunicWeb.components.friends.interface.get_current_list(true, function(r){

				//Check for error
				if(r.error){
					ComunicWeb.common.notificationSystem.showNotification("Could not get your list of friends !", "danger");
					return;
				}

				//Show the list
				ComunicWeb.components.friends.listModal._show(user, r);
			});

		}

		else

			//Try to get the list of friends of the specified user
			ComunicWeb.components.friends.interface.get_user_list(user, function(r){

				//Check for error
				if(r.error){
					ComunicWeb.common.notificationSystem.showNotification("Could not get the of friends of the user (it may be private) !", "danger");
					return;
				}

				//Show the list
				ComunicWeb.components.friends.listModal._show(user, r);

			});

	},

	/**
	 * Show the list of friends of a user
	 * 
	 * @param {number} user The ID of the target user
	 * @param {object} list The list of users to display
	 */
	_show: function(user, list){

		//Create a modal root
		var modal = createElem2({
			type: "div",
			class: "modal modal-primary input-string-modal"
		});
	
		var modalDialog = createElem2({
			appendTo: modal,
			type: "div",
			class: "modal-dialog"
		});
	
		var modalContent = createElem2({
			appendTo: modalDialog,
			type: "div",
			class: "modal-content",
		});
	
		//Modal header
		var modalHeader = createElem2({
			appendTo: modalContent,
			type: "div",
			class: "modal-header"
		});
	
		var closeModal = createElem2({
			appendTo: modalHeader,
			type: "button",
			class: "close",
		});
	
		createElem2({
			appendTo: closeModal,
			type: "span",
			innerHTML: "x"
		});
	
		var modalTitle = createElem2({
			appendTo: modalHeader,
			type: "h4",
			class: "modal-title",
			innerHTML: "Friends list"
		});
	
		//Modal body
		var modalBody = createElem2({
			appendTo: modalContent,
			type: "div",
			class: "modal-body",
		});
	
		//Modal footer
		var modalFooter = createElem2({
			appendTo: modalContent,
			type: "div",
			class: "modal-footer"
		});
	
		var closeButton = createElem2({
			appendTo: modalFooter,
			type: "button",
			class: "btn btn-default",
			innerHTML: "Close"
		});
	
		//Create the response function
		var respond = function(){
	
			//Close modal
			$(modal).modal('hide');
			emptyElem(modal);
			modal.remove();
		}
	
		//Make the buttons live
		closeButton.onclick = respond;
		closeModal.onclick = respond;
	
		//Display the right version of the friends list
		if(userID() == user){

			//Show the friends list of the user
			this._show_personnal(modalBody, list);

		}
		else {
			
			//Display a read-only list of friends
			this._show_read_only(modalBody, list, user);

		}

		//Show the modal
		$(modal).modal('show');
	},

	/**
	 * Display a read-only list of friends
	 * 
	 * @param {HTMLElement} target The target for the list of friends
	 * @param {array} ids The list of IDs of the target users
	 * @param {userID} user The ID of the related user
	 */
	_show_read_only: function(target, ids, user){

		//Create the friends list container
		var list = createElem2({
			appendTo: target,
			type: "div",
			class: "friends-list-ro"
		});

		//Get informations about the users
		ComunicWeb.user.userInfos.getMultipleUsersInfos(ids, function(users){

			//Check for errors
			if(users.error){
				ComunicWeb.common.notificationSystem.showNotification("An error occured while retrieving informations about the friends !", "danger");
				return;
			}

			//Parse the list of friends
			ids.forEach(function(id){
				
				//Display the user
				const userContainer = createElem2({
					appendTo: list,
					type: "div",
					class: "friend"
				});

				//Create user link
				const userLink = createElem2({
					appendTo: userContainer,
					type: "a"
				});

				//Add user account image
				createElem2({
					appendTo: userLink,
					type: "img",
					src: users["user-" + id].accountImage
				});

				//Add users name
				createElem2({
					appendTo: userLink,
					type: "div",
					class: "friends-name",
					innerHTML: userFullName(users["user-" + id])
				});

				//Make the link button lives
				userLink.onclick = function(){
					
					//Open user page
					openUserPage(users["user-" + id]);

					//Close all modals
					$(".modal").modal("hide");

				}
			});

		});

	},

	/**
	 * Show the list of friends of the user
	 * 
	 * @param {HTMLElement} target The target element for the list
	 * @param {array} list The list of friends of the user
	 */
	_show_personnal: function(target, list){

		//Get the list of friends ID
		var usersID = ComunicWeb.components.friends.utils.getUsersIdFromPersonnalList(list);

		//Create list target
		var listTarget = createElem2({
			appendTo: target,
			type: "div",
			class: "personnal-friends-list"
		});

		//Get informations about the users
		ComunicWeb.user.userInfos.getMultipleUsersInfos(usersID, function(users){

			//Check for errors
			if(users.error){
				ComunicWeb.common.notificationSystem.showNotification("Could not get informations about friends !", "danger");
				return;
			}

			//Display each friend
			list.forEach(function(friend){

				//Display the friend
				ComunicWeb.components.friends.ui.show_personnal_friend(listTarget, friend, users["user-"+friend.ID_friend]);

			});

		});

	},

	

};