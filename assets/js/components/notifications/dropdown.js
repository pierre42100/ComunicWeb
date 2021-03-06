/**
 * Notifications menu bar dropdown
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.notifications.dropdown = {

	/**
	 * Display new data dropdowns
	 * 
	 * @param {HTMLElement} target The target for the notification area
	 */
	display: function(target){
		
		//Display the number of notifications
		var notifs_number_elem = this.display_notifications_dropdown(target);

		//Display the number of unread conversations
		var conversations_number_elem = ComunicWeb.components.conversations.unreadDropdown.display_dropdown(target);

		//Initialize service
		ComunicWeb.components.notifications.service.init(notifs_number_elem, true, conversations_number_elem);
	},

	/**
	 * Display notifications dropdown
	 * 
	 * @param {HTMLElement} target The target of the notification dropdown
	 * @return {HTMLElement} The HTML element that contains the number of unread notifications
	 */
	display_notifications_dropdown: function(target){

		//Create the button
		var dropdown = createElem2({
			appendTo: target,
			type: "li",
			class: "dropdown messages-menu"
		});

		//Add dropdown toggle
		var dropdownToggle = createElem2({
			appendTo: dropdown,
			type: "a",
			class: "dropdown-toggle",
			href: "#",
			innerHTML: '<i class="fa fa-bell-o"></i>'
		});
		dropdownToggle.setAttribute("data-toggle", "dropdown");

		//Add notification number
		var notificationsNumber = createElem2({
			appendTo: dropdownToggle,
			type: "span",
			class: "label label-danger",
			innerHTML: "0"
		});

		//Add dropdown menu
		var dropdownMenu = createElem2({
			appendTo: dropdown,
			type: "ul",
			class: "dropdown-menu"
		});

		//Add dropdown header
		var dropdownHeader = createElem2({
			appendTo: dropdownMenu,
			type: "li",
			class: "header",
			innerHTML: lang("notifications_dropdown_title")
		});

		//Add notifications list
		var notificationsListContainer = createElem2({
			appendTo: dropdownMenu,
			type: "li"
		});
		var notificationsList = createElem2({
			appendTo: notificationsListContainer,
			type: "ul",
			class: "menu"
		});

		//Add dropdown bottom
		var dropdownBottom = createElem2({
			appendTo: dropdownMenu,
			type: "li",
			class: "footer"
		});

		//Add a button to offer the user to delete all his notifications
		var deleteAllLink = createElem2({
			appendTo: dropdownBottom,
			type: "a",
			innerHTML: lang("notifications_dropdown_delete_all_link")
		});

		//Make the delete all notifications link lives
		deleteAllLink.onclick = function(){

			ComunicWeb.common.messages.confirm(lang("notifications_dropdown_confirm_delete_all"), function(accept){

				//We continue only if the user confirmed the operation
				if(!accept)
					return;

				//Perform a request to the server through the interface
				ComunicWeb.components.notifications.interface.delete_all(function(result){

					//Check for errors
					if(result.error){
						ComunicWeb.common.notificationSystem.showNotification(lang("notifications_dropdown_err_delete_all_notifications"), "danger");
						return;
					}

					//Display success
					ComunicWeb.common.notificationSystem.showNotification(lang("notifications_dropdown_delete_all_success"), "success");

				});


			});

		};

		//Enable slimscroll
		$(notificationsList).slimScroll({
			height: '100%'
		});

		//Refresh the notifications list if the user click the dropdown button
		dropdownToggle.onclick = function(){
			ComunicWeb.components.notifications.dropdown.refresh_list_notifications(notificationsList);
		}
		
		//Return the number of notifications target
		return notificationsNumber;
	},

	/**
	 * Refresh the list of notifications
	 * 
	 * @param {HTMLElement} list The notifications list to refresh
	 */
	refresh_list_notifications: function(list){

		//Perform a request on the API
		ComunicWeb.components.notifications.interface.get_list_unread(function(result){

			//Check for errors
			if(result.error){
				ComunicWeb.common.notificationSystem.showNotification(lang("notifications_dropdown_err_get_notifs_list"), "danger");
				return;
			}

			//Get the list of required users informations
			var users_id = ComunicWeb.components.notifications.utils.get_users_id(result);
			
			//Get informations about the users
			ComunicWeb.user.userInfos.getMultipleUsersInfo(users_id, function(users){

				//Check for errors
				if(users.error){
					ComunicWeb.common.notificationSystem.showNotification(lang("notifications_dropdown_err_get_related_users_info"), "danger");
					return;
				}

				//Get information about the groups
				var groups_id = ComunicWeb.components.notifications.utils.get_groups_id(result);
				getInfoMultipleGroups(groups_id, function(groups){

					//Check for errors
					if(groups.error)
						return notify(lang("notifications_dropdown_err_get_related_groups_info"), "danger");

					//Empty the target list
					list.innerHTML = "";

					//Process the list of notifications
					for (var i = 0; i < result.length; i++) {
						const notification = result[i];
						
						//Display the notification
						ComunicWeb.components.notifications.ui.display_notification(notification, list, users, groups);
					}

					//Display a message if there isn't any notification to display
					if(result.length == 0){

						list.innerHTML = "<li class='no-notification-msg'>" + lang("notifications_dropdown_no_notif_notice") + "</li>";

					}

				});
				

			}, false);
			

		});

	}
}