/**
 * Groups API interface
 * 
 * @author Pierre HUBERT
 */

const GroupsInterface = {

	/**
	 * Create a group
	 * 
	 * @param {String} name The name of the group to create
	 * @param {Function} callback
	 */
	create: function(name, callback){

		//Perform a request over the API
		var apiURI = "groups/create";
		var params = {
			name: name
		};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
	},

	/**
	 * Get the list of groups of the user
	 * 
	 * @param {Function} callback
	 */
	getListUser: function(callback){
		//Perform a request over the API
		var apiURI = "groups/get_my_list";
		var params = {};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
	},

	/**
	 * Remove a user membership
	 * 
	 * @param {Number} groupID The ID of the target group
	 * @param {Function} callback
	 */
	removeMembership: function(groupID, callback){
		//Perform the request over the API
		var apiURI = "groups/remove_membership";
		var params = {
			id: groupID
		};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
	},

	/**
	 * Get information about a group
	 * 
	 * @param {Number} id The ID of the target group
	 * @param {Function} callback Callback
	 */
	getInfo: function(id, callback){
		//Perform the request over the API
		var apiURI = "groups/get_info";
		var params = {
			id: id
		};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
	},

	/**
	 * Get information about multiple groups
	 * 
	 * @param {Array} list The IDs of the groups to get
	 * @param {Function} callback
	 */
	getInfoMultiple: function(list, callback){
		//Perform the request over the API
		var apiURI = "groups/get_multiple_info";
		var params = {
			list: list
		};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
	},

	/**
	 * Get advanced information about a group
	 * 
	 * @param {Number} id The ID of the target group
	 * @param {Function} callback Callback
	 */
	getAdvancedInfo: function(id, callback){
		//Perform the request over the API
		var apiURI = "groups/get_advanced_info";
		var params = {
			id: id
		};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
	},

	/**
	 * Get the settings of a group
	 * 
	 * @param {Number} id The ID of the target group
	 * @return {Promise<GroupSettings>}
	 */
	getSettings: async function(id){
		return await api("groups/get_settings", {id: id}, true);
	},

	/**
	 * Set (update) the settings of a group
	 * 
	 * @param {Number} id The ID of the target group
	 * @param {Object} settings The new settings to apply to 
	 * the group
	 * @param {Function} callback
	 */
	setSettings: function(id, settings, callback){
		//Perform the request over the API
		var apiURI = "groups/set_settings";
		settings.id = id;
		ComunicWeb.common.api.makeAPIrequest(apiURI, settings, true, callback);
	},

	/**
	 * Create a new group conversation
	 * 
	 * @param {Number} groupID The ID of the target group
	 * @param {String} convName The name of the new conversation
	 * @param {String} minMembershipLevel Minimal membership level
	 */
	createGroupConversation: async function(groupID, convName, minMembershipLevel) {
		await api("groups/create_conversation", {
			group_id: groupID,
			min_membership_level: minMembershipLevel,
			name: convName
		}, true)
	},

	
	/**
	 * Change group conversation visibility
	 * 
	 * @param {Number} convID The ID of the conversation to delete
	 * @param {String} newLevel New minimal conversation visibility level
	 */
	changeGroupConversationVisibility: async function(convID, newLevel) {
		await api("groups/set_conversation_visibility", {
			conv_id: convID,
			min_membership_level: newLevel
		}, true)
	},


	/**
	 * Delete a group conversation
	 * 
	 * @param {Number} convID The ID of the conversation to delete
	 */
	deleteGroupConversation: async function(convID) {
		await api("groups/delete_conversation", {
			conv_id: convID,
		}, true)
	},

	/**
	 * Check the availability of a virtual directory for a group
	 * 
	 * @param {String} directory The directory to check
	 * @param {Number} groupID The ID of the group to check
	 * @param {Function} callback
	 */
	checkVirtualDirectory: function(directory, groupID, callback){
		//Perform the request over the API
		var apiURI = "groups/checkVirtualDirectory";
		var params = {
			groupID: groupID,
			directory: directory
		};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
	},

	/**
	 * Upload a new group logo
	 * 
	 * @param {Number} id The ID of the target group
	 * @param {FormData} data The form data that contains the
	 * new logo (parameter name : logo)
	 * @param {Function} callback
	 */
	uploadLogo: function(id, data, callback){
		//Perform the request over the API
		var apiURI = "groups/upload_logo";
		data.append("id", id);
		ComunicWeb.common.api.makeFormDatarequest(apiURI, data, true, callback);
	},

	/**
	 * Delete user logo
	 * 
	 * @param {Number} id The ID of the target group
	 * @param {Function} callback
	 */
	deleteLogo: function(id, callback){
		//Perform the request over the API
		var apiURI = "groups/delete_logo";
		var params = {
			id: id
		};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
	},

	/**
	 * Invite a user to join a group
	 * 
	 * @param {Number} user_id The ID of the user to invite
	 * @param {Number} group_id Target group
	 * @param {Function} callback
	 */
	inviteUser: function(user_id, group_id, callback){
		ComunicWeb.common.api.makeAPIrequest(
			"groups/invite",
			{
				userID: user_id,
				group_id: group_id
			},
			true, callback
		);
	},

	/**
	 * Respond to a group invitation
	 * 
	 * @param {Number} id The ID of the target group
	 * @param {Boolean} accept Specify whether the invitation was
	 * accepted or not
	 * @param {Function} callback
	 */
	respondInvitation: function(id, accept, callback) {
		//Perform the request over the API
		var apiURI = "groups/respond_invitation";
		var params = {
			id: id,
			accept: accept
		};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
	},

	/**
	 * Cancel a membership request
	 * 
	 * @param {Number} id The ID of the target group
	 * @param {Function} callback
	 */
	cancelRequest: function(id, callback){
		//Perform the request over the API
		var apiURI = "groups/cancel_request";
		var params = {
			id: id
		};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
	},

	/**
	 * Send a request to join a group
	 * 
	 * @param {Number} id The ID of the target group
	 * @param {Function} callback
	 */
	sendRequest: function(id, callback){
		//Perform the request over the API
		var apiURI = "groups/send_request";
		var params = {
			id: id
		};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
	},

	/**
	 * Get the members of a group
	 * 
	 * @param {Number} id The ID of the target group
	 * @param {Function} callback
	 */
	getMembers: function(id, callback){
		//Perform the request over the API
		var apiURI = "groups/get_members";
		var params = {
			id: id
		};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
	},

	/**
	 * Get information about a single user membership
	 * 
	 * @param {Number} userID The ID of the target user
	 * @param {Number} groupID The ID of the target group
	 * @param {Function} callback The result
	 */
	getMembership: function(userID, groupID, callback){
		//Perform the request over the API
		var apiURI = "groups/get_membership";
		var params = {
			groupID: groupID,
			userID: userID
		};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
	},

	/**
	 * Remove (delete) a member from the group
	 * 
	 * @param {Number} groupID The ID of the target group
	 * @param {Number} userID The ID of the target user
	 * @param {Function} callback
	 */
	deleteMember: function(groupID, userID, callback){
		//Perform the request over the API
		var apiURI = "groups/delete_member";
		var params = {
			groupID: groupID,
			userID: userID
		};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
	},

	/**
	 * Respond to a membership request
	 * 
	 * @param {Number} groupID The ID of the target group
	 * @param {Number} userID The ID of the target user
	 * @param {Boolean} accept Specify whether the request is accepted or not
	 */
	respondRequest: function(groupID, userID, accept, callback){
		//Perform the request over the API
		var apiURI = "groups/respond_request";
		var params = {
			groupID: groupID,
			userID: userID,
			accept: accept
		};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
	},

	/**
	 * Cancel a membership invitation
	 * 
	 * @param {Number} groupID The ID of the target group
	 * @param {Number} userID The ID of the target user
	 * @param {Function} callback
	 */
	cancelInvitation: function(groupID, userID, callback){
		//Perform the request over the API
		var apiURI = "groups/cancel_invitation";
		var params = {
			groupID: groupID,
			userID: userID
		};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
	},

	/**
	 * Update the membership of a user
	 * 
	 * @param {Number} groupID The ID of the target group
	 * @param {Number} userID The ID of the target user
	 * @param {String} level The new membership level for the user
	 * @param {Function} callback
	 */
	updateMembership: function(groupID, userID, level, callback){
		//Perform the request over the API
		var apiURI = "groups/update_membership_level";
		var params = {
			groupID: groupID,
			userID: userID,
			level: level
		};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
	},

	/**
	 * Set whether a user is following a group or not
	 * 
	 * @param {Number} groupID The ID of the target group
	 * @param {Boolean} follow
	 * @param {Function} callback
	 */
	setFollowing: function(groupID, follow, callback){
		//Perform the request over the API
		var apiURI = "groups/set_following";
		var params = {
			groupID: groupID,
			follow: follow
		};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
	},

	/**
	 * Delete a group
	 * 
	 * @param {Number} groupID The ID of the group to delete
	 * @param {String} password The password of the user, for security
	 * @param {Function} callback
	 */
	deleteGroup: function(groupID, password, callback){
		//Perform the request over the API
		var apiURI = "groups/delete";
		var params = {
			groupID: groupID,
			password: password
		};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);
	}
};

ComunicWeb.components.groups.interface = GroupsInterface;