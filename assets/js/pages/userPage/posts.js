/**
 * Posts function
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.pages.userPage.posts = {

	/**
	 * Last displayed post ID
	 */
	_last_post_id: 0,

	/**
	 * Specify if post loading is locked
	 */
	_load_post_locked: false,

	/**
	 * Display the posts
	 * 
	 * @param {Object} userInfos Informations about the user
	 * @param {Object} params Additionnal parametres passed with the request
	 * @param {HTMLElement} target The target where the posts will be applied
	 */
	display: function(userInfos, params, target){

		//Reset last post id
		this._last_post_id = 0;
		this._load_post_locked = true;

		//Create posts blocks
		var postsBlock = createElem2({
			appendTo: target,
			type: "div",
			class: "box box-primary box-user-posts"
		});

		var postsBody = createElem2({
			appendTo: postsBlock,
			type: "div",
			class: "box-body",
		});

		//Display loading message
		var loadingMsg = createElem2({
			appendTo: postsBody,
			type: "p",
			innerHTML: lang("user_page_posts_loading")
		});
		loadingMsg.style.textAlign = "center";

		//Trigger an event the the user reach the end of the page
		$(window).scroll(function(){
			
			//Cancel event if it came by error
			if(!postsBlock.isConnected)
				return false;
			
			//Cancel event if the page is locked
			if(ComunicWeb.pages.userPage.posts._load_post_locked !== false)
				return;
		
			//Check if we reached the bottom of the page
			if($(window).scrollTop() + $(window).height() < $(document).height() - 50){
				return;
			}

			//Lock the loading state
			ComunicWeb.pages.userPage.posts._load_post_locked = true;

			//Load next posts
			ComunicWeb.pages.userPage.posts._load_posts(userInfos, postsBody);
		});

		//Load the posts
		this._load_posts(userInfos, postsBody, function(){
			loadingMsg.remove();
		});
		
	},

	/**
	 * Load the posts for the user
	 * 
	 * @param {Object} userInfos Informations about the user to load
	 * @param {HTMLElement} target The target for the posts
	 * @param {function} callback What to do once the posts have been loaded
	 */
	_load_posts: function(userInfos, target, callback){

		//Get the posts from the API
		ComunicWeb.components.posts.interface.get_user(userInfos.userID, this._last_post_id, function(result){

			//Check for errors
			if(result.error){
				//Display notification
				ComunicWeb.common.notificationSystem.showNotification(lang("user_page_posts_err_get_posts"), "danger", 4, "Error");
			}
			else {

				//Show the posts
				ComunicWeb.pages.userPage.posts._show(result, target);

			}

			//Unlock posts loading, if required
			if(result.length != 0)
				ComunicWeb.pages.userPage.posts._load_post_locked = false;

			//Call callback (if any)
			if(callback)
				callback();

		});

	},

	/**
	 * Show user posts
	 * 
	 * @param {Object} posts The list of posts to display
	 * @param {HTMLElement} target The rendering target
	 */
	_show: function(posts, target){

		//Process each post
		var i;
		for(i in posts){
			
			//Display post
			ComunicWeb.components.posts.ui.display_post(posts[i], target);

			//Update last post ID (if small than previous one or if it has not been initialized yet)
			this._last_post_id = posts[i].ID;

		}

		//Check if there is not any posts
		if(this._last_post_id == 0){
			this._no_posts_msg(target);
		}
	},

	/**
	 * Display a message to inform user that there is not any post
	 * on the page he is visiting
	 * 
	 * @param {HTMLElement} target The target for the message
	 */
	_no_posts_msg: function(target){
		
		var msgContainer = createElem2({
			appendTo: target,
			type: "div"
		});

		var msgTitle = createElem2({
			appendTo: msgContainer,
			type: "h2",
			innerHTML: lang("user_page_posts_notice_no_posts_title")
		});
		msgTitle.style.textAlign = "center";

		var msgContent = createElem2({
			appendTo: msgContainer,
			type: "p",
			innerHTML: lang("user_page_posts_notice_no_posts_message")
		}).style.textAlign = "center";
	}



};