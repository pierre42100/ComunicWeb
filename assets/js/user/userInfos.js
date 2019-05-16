/**
 * User informations functions
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.user.userInfos = {

	/**
	 * @var {String} User infos cache
	 */
	usersInfos: {},

	/**
	 * Get user informations
	 * 
	 * @param {String} userID User on which to make request (current to get connected user)
	 * @param {function} afterGetUserInfos What to do once user informations are available
	 * @param {Boolean} forceRequest Force the request to be made
	 * @return {Boolean} True for a success
	 */
	getUserInfos: function(userID, afterGetUserInfos, forceRequest){

		//Check if current user infos were required
		if(userID == "current")
			userID = ComunicWeb.user.userLogin.getUserID();

		//getMultipleUsersInfo mirror
		var usersID = [userID];

		return this.getMultipleUsersInfo(usersID, function(result){
			//We check if an error occured
			if(result.error)
				afterGetUserInfos(result);

			//Return a simple array
			else
				afterGetUserInfos(result["user-"+userID]);
		}, forceRequest);

	},

	/**
	 * Get multiple users informations
	 * 
	 * @param {Array~Object} usersID User on which to make request (current to get connected user)
	 * @param {function} afterGetUserInfos What to do once users informations are available
	 * @param {Boolean} forceRequest Force the request to be made
	 * @return {Boolean} True for a success
	 */
	getMultipleUsersInfo: function(usersID, afterGetUserInfos, forceRequest){

		//First, check if informations are already available in the cache for some users
		var cachedInformations = {};
		var needRequest = false; //By default the request isn't required
		var usersToGetList = "";
		for(i in usersID){
			//Extract userID
			var processUserID = usersID[i];

			//Check the local cache
			if(this.usersInfos["user-"+processUserID] && !forceRequest){
				//Add user information to cached informations
				cachedInformations["user-"+processUserID] = this.usersInfos["user-"+processUserID];
			}
			else {
				//Else we'll have to get data
				needRequest = true;
				usersToGetList += processUserID + ",";
			}
		}

		//Check if an API request is not required
		if(!needRequest){
			//Go immediatly to the next step
			afterGetUserInfos(cachedInformations);
			return true;
		}

		//Perform API request
		var apiURI = "user/getInfosMultiple";
		var params = {
			usersID: usersToGetList,
		}

		//Specify what to do next
		var onceGetUserInfos = function(result){
			if(result.error){
				//Log error
				ComunicWeb.debug.logMessage("ERROR : couldn't get infos about users ID !");

				//Returns the error to the next function
				afterGetUserInfos(result);

				//Something went wrong
				return false;
			}
			else {
				//Prepare return
				var returnInformations = cachedInformations;

				//Save results and prepare return
				for(i in result){
					//Get user ID
					var userID = result[i]['userID'];
					
					//Store
					ComunicWeb.user.userInfos.usersInfos["user-"+userID] = result[i];

					returnInformations["user-"+userID] = result[i];
				}
				

				//Return results
				afterGetUserInfos(returnInformations);
			}
		}

		//Perform request
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, onceGetUserInfos);

		//Everything is OK
		return true;

	},

	/**
	 * Empty user informations cache
	 * Remove all entries from user informations cache
	 * 
	 * @return {Boolean} True for a success
	 */
	emptyUserInfosCache: function(){
		this.userInfos = undefined; //Mark user info cache as undefined
		this.userInfos = {}; //Create a new variable

		return true;
	},

	/**
	 * Given a query, search for users and return the result
	 * 
	 * @param {String} query The query to search
	 * @param {Function} afterSearch What to do once we got results
	 * @return {Boolean} True for a success
	 */
	search: function(query, afterSearch){
		//Perform a request on the server
		apiURI = "user/search";
		params = {
			query: query,
		};
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, function(response){
			
			//Continue only in case of success
			if(response.error){
				afterSearch(false);
				return false;
			}
			
			//Preload users informations
			ComunicWeb.user.userInfos.getMultipleUsersInfo(response, function(usersInfos){
				//Go to next action
				afterSearch(usersInfos);
			});
		});
	},

	/**
	 * Given user IDs (in an array) the function return their names in a string
	 * 
	 * @param {Array} usersID The users to return as a string
	 * @param {Function} afterNames What to do once we have got the names
	 * @return {Boolean} True for a success
	 */
	getNames: function(usersID, afterNames){
		//Get users informations
		this.getMultipleUsersInfo(usersID, function(usersInfo){

			//Check for errors
			if(usersInfo.error){
				afterNames("Error");
			}

			//Prepare conversation name
			var usersName = "";

			//Process users informations
			for(i in usersInfo){
				if(usersInfo[i].firstName)

					//Add a coma if required
					if(usersName != "")
						usersName += ", ";

					usersName += usersInfo[i].firstName + " " + usersInfo[i].lastName;
			}
			
			//Perform next action with result
			afterNames(usersName);
		});
	},

	/**
	 * Get advanced informations about a user
	 * 
	 * @param {Integer} userID The ID of the user to fetch
	 * @param {Function} callback What to do once we got the information
	 */
	getAdvancedInfos: function(userID, callback){

		//Prepare an API request
		var apiURI = "user/getAdvancedUserInfos";
		var params = {
			userID: userID
		};

		//Perform the request
		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, callback);

	},

	/**
	 * Get the user ID specified by its folder name
	 * 
	 * @param {String} path The path of the user
	 * @param {Function} callback What to do once we got a response from the server
	 */
	getIDfromPath: function(path, callback){
		
		//Prepare an API request
		var apiURI = "user/findbyfolder";
		var params = {
			subfolder: path
		};

		//Define what to do next
		var next = function(response){
			if(response.userID){
				callback(response.userID*1);
			}
			else
				//An error occured
				callback(-1);
		}

		ComunicWeb.common.api.makeAPIrequest(apiURI, params, true, next);
	},

	/**
	 * Get the ID or the path of a user, depending of what is available
	 * 
	 * @param {Object} userInfos Informations about the user
	 * @return {String} The ID of the user or its path, if he has one
	 */
	getIDorPath: function(userInfos){

		//Check if a virtual directory is available
		if(userInfos.virtualDirectory != null && userInfos.virtualDirectory != ""){
			return userInfos.virtualDirectory;
		}

		//Else return user ID
		else {
			return userInfos.userID;
		}
	},

	/**
	 * Empty users cache
	 * 
	 * @return {Boolean} True for a success
	 */
	emptyCache: function(){
		this.usersInfos = {};

		//Success
		return true;
	}
};

//Register cache cleaner
ComunicWeb.common.cacheManager.registerCacheCleaner("ComunicWeb.user.userInfos.emptyCache");