/**
 * Latest posts page main script
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.latestPosts.main = {

	/**
	 * Last loaded post id
	 */
	_last_post_id: 0,

	/**
	 * Specify if post loading is locked or not
	 */
	_load_post_locked: false,

	/**
	 * Open latest posts page
	 * 
	 * @param {Object} params Parametres required to open the page
	 * @param {HTMLElement} target The target for the user page
	 */
	open: function(params, target){
		
		//Reset variables
		this._last_post_id = 0;
		this._load_post_locked = true;

		//Create post list box
		//Create row
		var pageRow = createElem2({
			appendTo: target,
			type: "div",
			class: "row latest-posts-row"
		});

		//Post column
		var column = createElem2({
			appendTo: pageRow,
			type: "div",
			class: "col-md-5"
		});

		// Display create posts form
		ComunicWeb.components.posts.form.display("user", userID(), column);

		//Create post box
		var postBox = createElem2({
			appendTo: column,
			type: "div",
			class: "box box-primary"
		});

		//Create box body
		var boxBody = createElem2({
			appendTo: postBox,
			type: "div",
			class: "box-body"
		});

		//Load the list
		this._load_list(boxBody);

		//Catch scroll event
		$(window).scroll(function(){
			
			//Cancel event if it came by error
			if(!boxBody.isConnected)
				return;
			
			//Cancel event if the page is locked
			if(ComunicWeb.pages.latestPosts.main._load_post_locked !== false)
				return;
		
			//Check if we reached the bottom of the page
			if($(window).scrollTop() + $(window).height() < $(document).height() - 50){
				return;
			}

			//Lock the loading state
			ComunicWeb.pages.latestPosts.main._load_post_locked = true;

			//Load next posts
			ComunicWeb.pages.latestPosts.main._load_list(boxBody);
		});
	},

	/**
	 * Load the list of post
	 * 
	 * @param {HTMLElement} target The target
	 */
	_load_list: function(target){

		//Perform a request on the server to get the list of latest posts
		ComunicWeb.components.posts.interface.get_latest(this._last_post_id, true, function(response){

			//Check for errors - display a modal
			if(response.error){
				
				//Display modal error
				var error = ComunicWeb.common.messages.createCalloutElem(lang("page_latest_posts_err_get_list_title"), lang("page_latest_posts_err_get_list_message"), "danger");
				error.className += " latestPostsError";
				target.appendChild(error);
			}
			else
				//Display the list of posts
				ComunicWeb.pages.latestPosts.main._display_list(response, target);
			
			//Unlock posts loading (if required)
			if(response.length != 0)
				ComunicWeb.pages.latestPosts.main._load_post_locked = false;
		});

	},

	/**
	 * Display the list of latest post
	 * 
	 * @param {Object} list The list of posts to display
	 * @param {HTMLElement} target The target for the posts
	 */
	_display_list: function(list, target){

		//Process the list of posts
		for (var index = 0; index < list.length; index++) {

			//Display the post
			ComunicWeb.components.posts.ui.display_post(list[index], target);

			//Save its ID
			this._last_post_id = list[index].ID;
		}

		//Check if there aren't any post to display
		if(list.length == 0){
			//Display message
			var message = ComunicWeb.common.messages.createCalloutElem(lang("page_latest_posts_notice_no_post_title"), lang("page_latest_posts_notice_no_posts_message"), "info");
			message.className += " noLatestPosts";
			target.appendChild(message);
		}
	}
}