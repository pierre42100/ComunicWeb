/**
 * Search utilities
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.search.utils = {

	/**
	 * Extract related users ID to a list of search results
	 * 
	 * @param {Array} list The list of results to parse
	 * @return {Array} The list of related users ID
	 */
	getUsersId: function(list){
		
		var IDs = [];

		list.forEach(function(result){

			if(result.kind == "user"){

				if(!IDs.includes(result.id))
					IDs.push(result.id);

			}

		});

		return IDs;

	},

	/**
	 * Extract related groups ID to a list of search results
	 * 
	 * @param {Array} list The list of results to parse
	 * @return {Array} The list of related groups ID
	 */
	getGroupsId: function(list){
		
		var IDs = [];

		list.forEach(function(result){

			if(result.kind == "group"){
				if(!IDs.includes(result.id))
					IDs.push(result.id);
			}

		});

		return IDs;

	},

}