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

	}

}