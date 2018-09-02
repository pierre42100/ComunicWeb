/**
 * Groups information management
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.groups.info = {

	/**
	 * Group information cache
	 */
	_cache: {},

	/**
	 * Get information about a single group
	 * 
	 * @param {Number} id The ID of the target group
	 * @param {Function} callback
	 */
	getInfo: function(id, callback){

		//First, check if the group is cached or not
		if(this._cache[id])
			return callback(this._cache[id]);
		
		//Then query the server, if required
		ComunicWeb.components.groups.interface.getInfo(id, function(result){

			//Check for errors
			if(result.error)
				return callback(result);

			//Save group information
			ComunicWeb.components.groups.info._cache[id] = result;

			//Call callback
			callback(result);
		});

	},

	/**
	 * Get information about a multiple groups
	 * 
	 * @param {Array} list The list of the IDs of the group to get information about
	 * @param {Function} callback
	 * @param {Boolean} force TRUE to ignore cache (FALSE by default)
	 */
	getInfoMultiple: function(list, callback, force){

		//First, check which group are unknown in the cache
		var toFetch = Array();

		list.forEach(function(id){
			if(!ComunicWeb.components.groups.info._cache[id] || force)
				toFetch.push(id);
		});

		if(toFetch.length == 0){
			this.getInfoMultiplePreCallback(list, callback);
			return;
		}

		//Perform the request over the server
		ComunicWeb.components.groups.interface.getInfoMultiple(toFetch, function(result){

			//Check for errors
			if(result.error)
				return notify("Could not get information about the groups!", "danger");
			
			//Process the list of groups
			for(i in result){
				
				//Save group information in the cache
				ComunicWeb.components.groups.info._cache[result[i].id] = result[i];

			}

			//Call callback
			ComunicWeb.components.groups.info.getInfoMultiplePreCallback(list, callback);

		});
	},

	/**
	 * Get multiple information pre-callback
	 * 
	 * @param {Array} list The list of the IDs of teh group to get information about
	 * @param {Function} callback
	 */
	getInfoMultiplePreCallback: function(list, callback){

		var groupInfo = {};

		list.forEach(function(id){
			groupInfo[id] = ComunicWeb.components.groups.info._cache[id];
		});

		//Call callback
		callback(groupInfo);
	},

	/**
	 * Clear cache
	 */
	clearCache: function(){
		this._cache = {};
	}

	
};

//Register cache cleaner
ComunicWeb.common.cacheManager.registerCacheCleaner("ComunicWeb.components.groups.info.clearCache");