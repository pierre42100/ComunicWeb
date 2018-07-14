/**
 * Notifications UI script
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.notifications.ui = {

	/**
	 * Display a single notification
	 * 
	 * @param {Object} data Informations about the notification
	 * @param {HTMLElement} target The target of the notification
	 * @param {Object} users Informations about users that might be required
	 * to display the notification
	 */
	display_notification: function(data, target, users){

		//Generate the informations about the notifications
		var from_user = users["user-"+data.from_user_id];

		//Generate the appropriate string

		//Notification author
		var message = userFullName(from_user) + " ";

		//Notification action
		//Comment
		if(data.type == "comment_created")
			message += "posted a comment";
		
		//About friendship requests
		if(data.type == "sent_friend_request")
			message += "sent you a friendship request.";
		if(data.type == "accepted_friend_request")
			message += "accepted your friendship request.";
		if(data.type == "rejected_friend_request")
			message += "rejected your friendship request.";

		//Generic element creation
		if(data.type == "elem_created"){

			if(data.on_elem_type == "post")
				message += "created a new post";

		}

		//Space separator
		message += " ";

		//Notification target
		if(data.from_container_type == "user_page"){

			if(data.from_user_id == data.from_container_id)
				message += "on his / her page";
			else
				message += "on "+userFullName(users["user-"+data.from_container_id])+"'s page";

		}

		//Create notification action
		var action = function(){

			//Mark the notification as seen
			ComunicWeb.components.notifications.interface.mark_seen(data.id, true);

			//Process specific action
			//For the post
			if(data.on_elem_type == "post"){

				//Open associated post page
				openPage("post/" + data.on_elem_id);

			}

			//For the friendship requests
			if(data.on_elem_type == "friend_request"){
				
				//Open user page
				openUserPageFromID(data.from_user_id);

			}

		};

		//Create the notification object
		var notificationContainer = createElem2({
			appendTo: target,
			type: "li",
			class: "notification-container"
		});

		//Create notification link
		var notificationLink = createElem2({
			appendTo: notificationContainer,
			type: "a"
		});
		notificationLink.onclick = action;

		//Add notification left content
		var notificationLeftContent = createElem2({
			appendTo: notificationLink,
			type: "div",
			class: "pull-left"
		});

		//Add user image
		var userImage = createElem2({
			appendTo: notificationLeftContent,
			type: "img",
			src: from_user.accountImage,
			class: "img-circle"
		});


		//Add the notification message
		var notificationMessage = createElem2({
			appendTo: notificationLink,
			type: "p",
			innerHTML: message
		});

		//Add notification date
		var notificationCreationTime = createElem2({
			appendTo: notificationLink,
			type: "small",
			class: "notification-creation-time",
			innerHTML: '<i class="fa fa-clock-o"></i> ' + ComunicWeb.common.date.timeDiffToStr(data.time_create) + " ago"
		});
	},


}