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
	 * @param {Function(memberships, usersInfo, groupsInfo, convNames) : void} success Function called in case of success
	 */
	getMemberships: async function(err, success) {

		try {

			// Get the list of memberships
			const memberships = await api("webApp/getMemberships", {}, true);

			// Get users & groups ID in case of success
			const usersID = [];
			const groupsID = [];

			memberships.forEach(el => {
				if(el.type == "friend")
					usersID.push(el.friend.ID_friend);
				else if(el.type == "group")
					groupsID.push(el.id);
			});

			const usersInfo = await getUsers(usersID);
			const groupsInfo = await getGroups(groupsID);

			// Get conversations name
			const convNames = new Map()
			for(const el of memberships.filter(el => el.type == "conversation"))
				convNames.set(el.conv.ID, await getConvName(el.conv))

			success(memberships, usersInfo, groupsInfo, convNames);

		} catch(e) {
			console.error("Get memberships error", e)
			err();
		}


	}

}