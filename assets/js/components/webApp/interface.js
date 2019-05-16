/**
 * Web application interface
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.webApp.interface = {

	/**
	 * Get all the membership of the user
	 * 
	 * @param {Function} err Function called in case of errors
	 * @param {Function(memberships, usersInfo, groupsInfo) : void} success Function called in case of success
	 */
	getMemberships: function(err, success) {

		// Peform the request on the server
		ComunicWeb.common.api.makeAPIrequest(
			"webApp/getMemberships", 
			{}, 
			true,
			memberships => {
				
				// Check for error
				if(memberships.error)
					return err(memberships.error);
				
				// Get users & groups ID in case of success
				let usersID = [];
				let groupsID = [];

				memberships.forEach(el => {
					if(el.type == "friend")
						usersID.push(el.friend.ID_friend);
					else
						groupsID.push(el.id);
				});

				getMultipleUsersInfo(usersID, users => {
					if(users.error)
						return err(memberships.error);
					
					getInfoMultipleGroups(groupsID, groupsInfo => {
						if(groupsInfo.error)
							return err(groupsInfo.error);
						
						success(memberships, users, groupsInfo);
					});
				});

			}
		);

	}

}