/**
 * Posts communication interface with the API
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.posts.interface = {

	/**
	 * Get user posts
	 * 
	 * @param {int} userID The ID of the target user
	 * @param {function} callback Callback function
	 */
	get_user: function(userID, callback){

		//Prepare the API request
		var APIuri = "posts/get_user";
		var params = {
			userID: userID
		};

		//Make the request
		ComunicWeb.common.api.makeAPIrequest(APIuri, params, true, callback);

	},

	/**
	 * Send a new post
	 * 
	 * @param {string} kind The kind of page
	 * @param {string} id The ID of the kind of page
	 * @param {FormData} data The data of the new post
	 * @param {function} callback The function to call once the post is posted
	 */
	send_post: function(kind, id, data, callback){

		//Prepare the request
		var apiURI = "posts/create";

		//Append the kind of post to the request
		data.append("kind-page", kind);
		data.append("kind-id", id);

		//Perform the request
		ComunicWeb.common.api.makeFormDatarequest(apiURI, data, true, callback);

	},

	/**
	 * Change post visibility level
	 * 
	 * @param {int} postID The ID of the post
	 * @param {string} new_level New visibility level for the post
	 * @param {function} callback What to do once we got a response
	 */
	set_visibility_level: function(postID, new_level, callback){

		//Prepare the API request
		var APIuri = "posts/set_visibility_level";
		var params = {
			postID: postID,
			new_level: new_level
		};

		//Make the request
		ComunicWeb.common.api.makeAPIrequest(APIuri, params, true, callback);

	},

	/**
	 * Delete a post
	 * 
	 * @param {int} postID The ID of the post to delete
	 * @param {function} callback What to do once we got a reponse
	 */
	delete: function(postID, callback){

		//Prepare an API request
		apiURI = "posts/delete";
		params = {
			postID: postID
		};

		//Perform the request
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);

	},

	/**
	 * Update a message content
	 * 
	 * @param {int} postID The ID of the post to update
	 * @param {string} content The new content of the post
	 * @param {function} callback What to do once post has been updated
	 */
	update_content: function(postID, content, callback){

		//Prepare an API request
		apiURI = "posts/update_content";
		params = {
			postID: postID,
			new_content: content
		};

		//Perform the request
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);

	},

}