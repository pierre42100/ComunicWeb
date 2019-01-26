/**
 * Calls utilities
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.calls.utils = {

	/**
	 * Check out whether all the members of a conversation stop to follow it,
	 * except the current user
	 * 
	 * @param {Object} info Information about the conversation to analyze
	 */
	hasEveryoneLeft: function(info){

		var allDisconnected = true;
		info.members.forEach(function(member){
			if(member.status != "rejected" && member.status != "hang_up" && member.userID != userID())
				allDisconnected = false;
		});

		return allDisconnected;

	}

};