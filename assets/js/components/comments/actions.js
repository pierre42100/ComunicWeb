/**
 * Comments actions
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.comments.actions = {

	/**
	 * Reload a single comment
	 * 
	 * @param {number} commentID The ID of the comment to reload
	 * @param {HTMLElement} target The target of the reloaded comment
	 */
	reload: function(commentID, target){
		
		//Hide the comment to reload
		target.style.visibility = "hidden";

		//Get informations about the comment on the API server
		ComunicWeb.components.comments.interface.get_single(commentID, function(result){

			//Display again the comment to update
			target.style.visibility = "visible";

			//Check for errors
			if(result.error){
				ComunicWeb.common.notificationSystem.showNotification(lang("comments_actions_err_get_info_single"), "danger");
				return;
			}

			//Apply new informations about the comment
			//Display new comment informations
			ComunicWeb.components.comments.ui.display_comment(result, target);

		});

	}

};