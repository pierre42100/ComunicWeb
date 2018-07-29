/**
 * Search interface
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.search.interface = {

	/**
	 * Make a global search (search for users & forms)
	 * 
	 * @param {String} query The search query
	 * @param {Function} callback
	 */
	global: function(query, callback){
		ComunicWeb.common.api.makeAPIrequest(
			"search/global",
			{
				query: query
			},
			true,
			callback
		);
	}

}