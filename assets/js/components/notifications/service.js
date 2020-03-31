/**
 * Notifications service
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.notifications.service = {
	
	/**
	 * Last known number of notifications
	 */
	last_total_count: -1,
	count_unread_notifications: -1,
	count_unread_conv: -1,

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
	init: async function(target, auto_hide, target_conversations){

		processResponse = () => {
			
			if(!target.isConnected || this.count_unread_notifications < 0 || this.count_unread_conv < 0)
				return;
			
			//Update the target
			target.innerHTML = this.count_unread_notifications;

			//If the number of notifications equals 0, hide the target if required
			target.style.display = this.count_unread_conv == 0 && auto_hide ? "none" : "block";
			
			//Update the number of conversations if possible too
			if(target_conversations){

				//Update the target
				target_conversations.innerHTML = this.count_unread_conv;

				//If the number of notifications equals 0, hide the target if required
				target_conversations.style.display = this.count_unread_conv == 0 && auto_hide ? "none" : "block";

			}

			//Sum notification number
			let total_number_notifs = this.count_unread_conv + this.count_unread_notifications;

			//Update page title too
			ComunicWeb.common.pageTitle.setNotificationsNumber(total_number_notifs);

			//Play song if required
			if(this.last_total_count != -1 && total_number_notifs > this.last_total_count)
				ComunicWeb.components.notifications.song.play();
			
			this.last_total_count = total_number_notifs;
			
		}


		// Initial load
		try {
			const response = await ComunicWeb.components.notifications.interface.asyncGetAllUnread(false);
			this.count_unread_conv = response.conversations;
			this.count_unread_notifications = response.notifications;
			this.last_total_count = response.notifications + response.conversations;

			processResponse();
		} catch(e) {
			console.error("Could not get the number of unread notifications!")
			console.error(e);
		}
	},

}