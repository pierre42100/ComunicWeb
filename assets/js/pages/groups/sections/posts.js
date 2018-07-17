/**
 * Groups posts section
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.groups.sections.posts = {

	/**
	 * ID of the oldest known post
	 */
	_oldest_post_id: 0,

	/**
	 * Loading message
	 */
	_loading_msg: null,

	/**
	 * Load post lock
	 */
	_load_post_locked: false,

	/**
	 * Display the section
	 * 
	 * @param {Object} info Information about the related group
	 * @param {HTMLElement} target The target for the section
	 */
	display: function(info, target){
		
		//Reset posts counter
		this._oldest_post_id = 0;
		this._load_post_locked = true;

		//Create posts target
		var postsBody = createElem2({
			appendTo: target,
			type: "div",
			class: "box box-primary"
		});

		var postsBody = createElem2({
			appendTo: postsBody,
			type: "div",
			class: "box-body"
		});

		//Display loading message
		this._loading_msg = ComunicWeb.common.messages.createCalloutElem(
			"Loading", "Please wait while we load this group posts...", "info");
		postsBody.appendChild(this._loading_msg);

		//Refresh the list of posts
		this._refresh_list(info, postsBody);

		//Detect user scroll
		$(window).scroll(function(){
			
			//Cancel event if it came by error
			if(!postsBody.isConnected)
				return;
			
			//Cancel event if the page is locked
			if(ComunicWeb.pages.groups.sections.posts._load_post_locked !== false)
				return;
		
			//Check if we reached the bottom of the page
			if($(window).scrollTop() + $(window).height() < $(document).height() - 50){
				return;
			}

			//Lock the loading state
			ComunicWeb.pages.groups.sections.posts._load_post_locked = true;

			//Load next posts
			ComunicWeb.pages.groups.sections.posts._refresh_list(info, postsBody);
		});
	},

	/**
	 * Refresh the list of posts of this group
	 * 
	 * @param {Object} info Information about the group
	 * @param {HTMLElement} target 
	 */
	_refresh_list: function(info, target){

		//Get the posts of the group
		ComunicWeb.components.posts.interface.get_group(info.id, 
			ComunicWeb.pages.groups.sections.posts._oldest_post_id, function(result){

			ComunicWeb.pages.groups.sections.posts._loading_msg.remove();

			//Check for errors
			if(result.error){
				target.appendChild(ComunicWeb.common.messages.createCalloutElem(
					"Error", "Could not get this group posts!", "danger"));
				return;
			}


			//Display the list of posts
			ComunicWeb.pages.groups.sections.posts._display_list(result, target);
		});

	},

	/**
	 * Display a list of posts
	 * 
	 * @param {Array} list The list of posts
	 * @param {HTMLElement} target The target for the list
	 */
	_display_list: function(list, target){

		var oldest_id = 0;

		list.forEach(function(post){

			if(oldest_id == 0 || post.ID < oldest_id)
				oldest_id = post.ID;

			//Display the post
			ComunicWeb.components.posts.ui.display_post(post, target);
		});

		if(this._oldest_post_id == 0 && oldest_id == 0){

			//Display message
			var message = ComunicWeb.common.messages.createCalloutElem("No post to display", "This group has not sent any post yet.", "info");
			message.className += " noGroupPosts";
			target.appendChild(message);

		}

		if(this._oldest_post_id == 0 || this._oldest_post_id > oldest_id)
			this._oldest_post_id = oldest_id;
		
		//Unlock posts loading (only if we received more than one post)
		if(list.length > 0)
			this._load_post_locked = false;
	},

};