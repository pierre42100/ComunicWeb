/**
 * Likes API interface
 * 
 * @author Pierre HUBERT
 */

ComunicWeb.components.like.interface = {

	/**
	 * Update like status
	 * 
	 * @param {String} type The type of component
	 * @param {Integer} id The ID of the element
	 * @param {Boolean} like New like status
	 */
	update: function(type, id, like){
		//Perform an API request through websocket
		return ws("likes/update", {
			type: type,
			id: id,
			like: like
		});
	}

}