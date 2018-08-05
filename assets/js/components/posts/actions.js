/**
 * Post actions
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.posts.actions = {

	/**
	 * Reload a single post
	 * 
	 * @param {int} postID The ID of the post to reload
	 * @param {HTMLElement} container The current container of the post
	 */
	reload_post: function(postID, container){

		//Lock the post
		container.style.visibility = "hidden";

		//Perform a request through the interface
		ComunicWeb.components.posts.interface.get_single(postID, function(infos){

			//Make the post visible
			container.style.visibility = "visible";

			//Check for errors
			if(infos.error){
				ComunicWeb.common.notificationSystem.showNotification("An error occured while getting information about the post !", "danger");
				return;
			}

			//Empty the post container
			emptyElem(container);

			//Display post
			ComunicWeb.components.posts.ui.display_post(infos, container);
			
		});

	},

}