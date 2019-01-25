/**
 * Notifications service
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.notifications.service = {
	
	/**
	 * Last known number of notifications
	 */
	last_notifs_number: -1,

	/**
	 * Init the service
	 * 
	 * @param {HTMLElement} target The target that will receive 
	 * the number of unread notifications
	 * @param {Bool} auto_hide Automatically hide the notifications 
	 * number if there is not any new notification
	 * @param {HTMLElement} target_conversations Optionnal, defins the target
	 * for the number of conversations
	 */
	init: function(target, auto_hide, target_conversations){

		//Initialize interval
		var interval = setInterval(function(){

			//Auto-remove interval if the target has been removed
			if(!target.isConnected){
				ComunicWeb.common.pageTitle.setNotificationsNumber(0);
				ComunicWeb.components.notifications.service.last_notifs_number = -1;
				return clearInterval(interval);
			}
				

			//Get the number of notifications from the API
			ComunicWeb.components.notifications.interface.getAllUnread(
				ComunicWeb.components.calls.controller.isAvailable(), function(response){

				//Continue in case of success
				if(response.error)
					return;

				//Update the target
				target.innerHTML = response.notifications;

				//If the number of notifications equals 0, hide the target if required
				if(response.notifications == 0 && auto_hide)
					target.style.display = "none";
				else
					target.style.display = "block";
				
				//Update the number of conversations if possible too
				if(target_conversations){

					//Update the target
					target_conversations.innerHTML = response.conversations;

					//If the number of notifications equals 0, hide the target if required
					if(response.conversations == 0 && auto_hide)
						target_conversations.style.display = "none";
					else
						target_conversations.style.display = "block";

				}

				//Sum notification number
				var total_number_notifs = response.notifications + response.conversations;

				//Update page title too
				ComunicWeb.common.pageTitle.setNotificationsNumber(total_number_notifs);

				//Play song if required
				if(ComunicWeb.components.notifications.service.last_notifs_number != -1 
					&& total_number_notifs > ComunicWeb.components.notifications.service.last_notifs_number)
					ComunicWeb.components.notifications.song.play();
				
					ComunicWeb.components.notifications.service.last_notifs_number = total_number_notifs;
				
				
				//Process the number of calls if possible
				if(response.calls && response.calls > 0)
					ComunicWeb.components.calls.controller.newCallsAvailable(response.calls);
			});

		}, 2000);

	},

}