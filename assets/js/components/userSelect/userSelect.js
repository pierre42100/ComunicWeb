/**
 * User selector (using select2)
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.userSelect = {

	/**
	 * Initialize user selector for an element of the page
	 * 
	 * @param {HTMLElement} inputSelect The target select input
	 * @return {Boolean} True for a success
	 */
	init: function(inputSelect){

		//Log action
		ComunicWeb.debug.logMessage("INFO : Initialize user selector");

		$(inputSelect).select2({
			ajax: {
				transport: function(params, success, failure){

					//Check if some data were passed or not
					if(!params.data.term)
						return false;

					//Retrive users list
					ComunicWeb.user.userInfos.search(params.data.term, function(usersInfos){

						if(usersInfos.error)
							return; // Doesn't do anything failure();
						else{
							//Prepare results processing
							returnData = {
								results: []
							}
							
							//Processing results
							for(i in usersInfos){
								returnData.results.push({
									id: usersInfos[i].userID,
									text: usersInfos[i].firstName + " " + usersInfos[i].lastName,
									accountImage: usersInfos[i].accountImage, 
								});
							}
							
							//Return result
							success(returnData);
						}
					});

				},
				delay: 250,
			},

			//Format result displaying
			templateResult: ComunicWeb.components.userSelect.formatUser,
		});

	},

	/**
	 * Format the display of a user
	 * 
	 * @param {Object} infos Informations about the user
	 * @return {String} The formated informations
	 */
	formatUser: function(infos){

		if(!infos.id)
			return infos.id;
		
		return $("<img src='"+infos.accountImage+"' class='user-select-image' /> <span>" + infos.text + "</span>");
	},

	/**
	 * Returns the results of a specified select element
	 * 
	 * @param {HTMLElement} inputSelect The target element
	 * @return {Array} An array with all the select IDs
	 */
	getResults: function(inputSelect){
		
		//Get entries
		var selectUsersResult = $(inputSelect).select2("data");

		//Prepare return
		var usersID = [];

		for(i in selectUsersResult){

			//Check it is really a children
			if(selectUsersResult[i].id){
				//Add ID to the table
				usersID.push(selectUsersResult[i].id);
			}
		}

		//Return result IDs
		return usersID;

	},

	/**
	 * Push entries to user select element
	 * 
	 * @param {HTMLElement} inputSelect The target element (select2 initialized)
	 * @param {array} usersID The ID of the users to push in select2 element
	 * @return {Boolean} True for a success
	 */
	pushEntries: function(inputSelect, usersID){

		//Get informations about the entries
		getMultipleUsersInfo(usersID, function(usersInfos){
			
			//Check for errors
			if(usersInfos.error){
				//Log error
				ComunicWeb.debug.logMessage("Error ! Couldn't fill select2 element because a request on the server failed !");
				return false;
			}

			//In case of success
			var i;
			for(i in usersInfos){
				
				//Create the new option
				var option = createElem2({
					type: "option",
					value: usersInfos[i].userID,
					innerHTML: usersInfos[i].firstName + " " + usersInfos[i].lastName,
				});
				option.setAttribute("selected", "true");

				//Apply the new option
				$(inputSelect).append(option);
				$(inputSelect).trigger("change");
			}
		})

		//Success
		return true;
	}
};