/**
 * Groups utilities
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.groups.utils = {

	/**
	 * Extract users ids from members list
	 * 
	 * @param {Array} list The list of members to process
	 * @return {Array} The list of the IDs of the members of group
	 */
	getMembersIDs: function(list){

		var IDs = [];

		//Process the list of IDs
		list.forEach(function(member){
			IDs.push(member.user_id);
		});

		return IDs;

	},

	/**
	 * Check whether a user can create posts for a group or not
	 * 
	 * @param {Object} info Information about the target group
	 * @return {boolean} TRUE if the user can create a post / FALSE else
	 */
	canCreatePosts: function(info){

		//Administrator and moderators can always create posts
		if(info.membership == "administrator" || info.membership == "moderator")
			return true;
		
		if(info.membership == "member" && info.posts_level == "members")
			return true;

		//In all the other case, the user can not create posts
		return false;

	},

}