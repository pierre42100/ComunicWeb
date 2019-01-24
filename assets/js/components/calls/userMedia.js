/**
 * User media getter
 *
 * @author Pierre HUBERT
 */

ComunicWeb.components.calls.userMedia = {

	/**
	 * Pointer on current user media
	 */
	_currMedia: undefined,

	/**
	 * Get user media
	 * 
	 * @return {Promise} A promise to get user media
	 */
	get: function(){

		//Check if we have already got user media
		if(this._currMedia != undefined && this._currMedia.active)
			return new Promise(function(resolve, error){
				resolve(ComunicWeb.components.calls.userMedia._currMedia);
			});
		
		//Use latest API
		return navigator.mediaDevices

			//Request user media
			.getUserMedia({
				audio: true,
				video: true
			})

			//Save stream
			.then(function(stream){
				ComunicWeb.components.calls.userMedia._currMedia = stream;
				return stream;
			});
	}

}